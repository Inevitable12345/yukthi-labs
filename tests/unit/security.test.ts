import { beforeEach, describe, expect, it } from "vitest";

import { contentSecurityPolicy, securityHeaders } from "@/lib/security/headers";
import { rateLimit, resetRateLimits } from "@/lib/security/rate-limit";
import { contactSchema } from "@/lib/contact/schema";

describe("content security policy", () => {
  const production = contentSecurityPolicy(false);

  it("never permits eval in production", () => {
    expect(production).not.toContain("unsafe-eval");
  });

  it("permits eval in development only, for React Refresh", () => {
    expect(contentSecurityPolicy(true)).toContain("unsafe-eval");
  });

  it("locks down the dangerous directives", () => {
    expect(production).toContain("object-src 'none'");
    expect(production).toContain("frame-ancestors 'none'");
    expect(production).toContain("base-uri 'self'");
    expect(production).toContain("form-action 'self'");
  });

  it("allows no third-party network connections", () => {
    // If this ever loosens, a tracker can be added without anyone noticing.
    expect(production).toContain("connect-src 'self'");
  });

  it("has a default-src fallback", () => {
    expect(production).toContain("default-src 'self'");
  });
});

describe("security headers", () => {
  const headers = new Map(securityHeaders().map((header) => [header.key, header.value]));

  it("sets the expected set", () => {
    for (const key of [
      "Content-Security-Policy",
      "X-Content-Type-Options",
      "X-Frame-Options",
      "Referrer-Policy",
      "Strict-Transport-Security",
      "Permissions-Policy",
      "Cross-Origin-Opener-Policy",
    ]) {
      expect(headers.has(key), `${key} is missing`).toBe(true);
    }
  });

  it("denies framing and sniffing", () => {
    expect(headers.get("X-Frame-Options")).toBe("DENY");
    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("disables sensitive browser features", () => {
    const policy = headers.get("Permissions-Policy")!;
    for (const feature of ["camera=()", "microphone=()", "geolocation=()"]) {
      expect(policy).toContain(feature);
    }
  });
});

describe("rate limiting", () => {
  beforeEach(() => resetRateLimits());

  it("allows requests up to the limit", () => {
    for (let i = 0; i < 5; i += 1) {
      expect(rateLimit("a", { limit: 5 }).ok).toBe(true);
    }
  });

  it("blocks past the limit and reports a retry delay", () => {
    for (let i = 0; i < 5; i += 1) rateLimit("b", { limit: 5 });
    const blocked = rateLimit("b", { limit: 5 });

    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("keeps separate counters per key", () => {
    for (let i = 0; i < 5; i += 1) rateLimit("c", { limit: 5 });
    expect(rateLimit("c", { limit: 5 }).ok).toBe(false);
    expect(rateLimit("d", { limit: 5 }).ok).toBe(true);
  });

  it("resets once the window has passed", () => {
    const start = 1_000_000;
    for (let i = 0; i < 5; i += 1) {
      rateLimit("e", { limit: 5, windowMs: 60_000, now: start });
    }
    expect(rateLimit("e", { limit: 5, windowMs: 60_000, now: start }).ok).toBe(false);
    expect(rateLimit("e", { limit: 5, windowMs: 60_000, now: start + 60_001 }).ok).toBe(true);
  });
});

describe("contact validation", () => {
  const valid = {
    name: "A Reader",
    email: "reader@example.com",
    context: "We run a production line and cannot see two tiers below our direct suppliers.",
  };

  it("accepts a well-formed submission", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a malformed email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("requires enough context to be worth replying to", () => {
    expect(contactSchema.safeParse({ ...valid, context: "hi" }).success).toBe(false);
  });

  it("bounds every field", () => {
    expect(contactSchema.safeParse({ ...valid, name: "x".repeat(200) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, context: "x".repeat(5000) }).success).toBe(
      false,
    );
  });

  it("rejects a filled honeypot", () => {
    // The route accepts and discards these; the schema is what identifies them.
    expect(contactSchema.safeParse({ ...valid, website: "http://spam" }).success).toBe(false);
  });

  it("trims incidental whitespace", () => {
    const parsed = contactSchema.safeParse({ ...valid, name: "  A Reader  " });
    expect(parsed.success && parsed.data.name).toBe("A Reader");
  });
});
