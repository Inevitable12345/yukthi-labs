import { describe, expect, it, vi } from "vitest";

import { buildContentSecurityPolicy, securityHeaders } from "@/lib/security/headers";
import { clientKey, hit } from "@/lib/security/rate-limit";
import { MIN_HUMAN_ELAPSED_MS, contactSchema } from "@/lib/contact/schema";

function directive(csp: string, name: string): string {
  return csp.split("; ").find((part) => part.startsWith(`${name} `)) ?? "";
}

describe("security headers", () => {
  const production = buildContentSecurityPolicy(false);

  it("emits every header the deployment relies on", () => {
    const keys = securityHeaders().map((header) => header.key);
    expect(keys).toContain("Content-Security-Policy");
    expect(keys).toContain("X-Content-Type-Options");
    expect(keys).toContain("Referrer-Policy");
    expect(keys).toContain("Permissions-Policy");
    expect(keys).toContain("Strict-Transport-Security");
    expect(keys).toContain("X-Frame-Options");
  });

  it("locks down the directives that matter most for XSS escalation", () => {
    expect(directive(production, "object-src")).toBe("object-src 'none'");
    expect(directive(production, "base-uri")).toBe("base-uri 'self'");
    expect(directive(production, "frame-ancestors")).toBe("frame-ancestors 'none'");
    expect(directive(production, "form-action")).toBe("form-action 'self'");
    expect(production).toContain("upgrade-insecure-requests");
  });

  it("never permits eval in production", () => {
    expect(production).not.toContain("unsafe-eval");
    expect(buildContentSecurityPolicy(true)).toContain("unsafe-eval");
  });

  it("allows no remote origin when no analytics provider is configured", () => {
    expect(directive(production, "connect-src")).toBe("connect-src 'self'");
    expect(directive(production, "script-src")).not.toContain("http");
    expect(directive(production, "font-src")).toBe("font-src 'self' data:");
  });
});

describe("rate limiting", () => {
  it("allows up to the limit inside a window, then refuses", () => {
    const key = `test-${Math.random()}`;
    expect(hit(key, 3, 60_000).allowed).toBe(true);
    expect(hit(key, 3, 60_000).allowed).toBe(true);
    const third = hit(key, 3, 60_000);
    expect(third.allowed).toBe(true);
    expect(third.remaining).toBe(0);

    const fourth = hit(key, 3, 60_000);
    expect(fourth.allowed).toBe(false);
    expect(fourth.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("opens a fresh window once the previous one has expired", () => {
    const key = `test-expiry-${Math.random()}`;
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2026-08-25T00:00:00.000Z"));
      expect(hit(key, 1, 60_000).allowed).toBe(true);
      expect(hit(key, 1, 60_000).allowed).toBe(false);

      vi.setSystemTime(new Date("2026-08-25T00:01:01.000Z"));
      expect(hit(key, 1, 60_000).allowed).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it("keys on the first forwarded address, scoped by route", () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.7, 70.41.3.18" });
    expect(clientKey(headers, "contact")).toBe("contact:203.0.113.7");
    expect(clientKey(new Headers(), "contact")).toBe("contact:unknown");
  });
});

describe("contact validation", () => {
  const valid = {
    name: "A Reader",
    email: "reader@example.com",
    organization: "An Organisation",
    role: "Head of Risk",
    message: "We depend on a single supplier and cannot name the failure mode.",
    consent: true as const,
  };

  it("accepts a complete enquiry", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("requires explicit consent rather than defaulting to it", () => {
    const result = contactSchema.safeParse({ ...valid, consent: false });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed address and a too-short message", () => {
    expect(contactSchema.safeParse({ ...valid, email: "not-an-address" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, message: "too short" }).success).toBe(false);
  });

  it("normalises the address and trims whitespace", () => {
    const parsed = contactSchema.parse({ ...valid, email: "  Reader@Example.COM " });
    expect(parsed.email).toBe("reader@example.com");
  });

  it("refuses a filled honeypot", () => {
    expect(contactSchema.safeParse({ ...valid, website: "http://spam" }).success).toBe(false);
  });

  it("defines a human floor for submission speed", () => {
    expect(MIN_HUMAN_ELAPSED_MS).toBeGreaterThan(1000);
  });
});
