import { beforeEach, describe, expect, it } from "vitest";
import { contentSecurityPolicy, securityHeaders } from "@/lib/security/headers";
import { clientKey, consume, reset } from "@/lib/security/rate-limit";
import { contactSchema } from "@/lib/contact/schema";

describe("content security policy", () => {
  it("forbids framing, plugins and off-origin defaults", () => {
    const policy = contentSecurityPolicy(false);
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("base-uri 'self'");
    expect(policy).toContain("form-action 'self'");
  });

  it("permits eval only in development", () => {
    expect(contentSecurityPolicy(false)).not.toContain("unsafe-eval");
    expect(contentSecurityPolicy(true)).toContain("unsafe-eval");
  });

  it("ships the full header set", () => {
    const keys = securityHeaders().map((header) => header.key);
    expect(keys).toEqual(
      expect.arrayContaining([
        "Content-Security-Policy",
        "X-Content-Type-Options",
        "X-Frame-Options",
        "Referrer-Policy",
        "Permissions-Policy",
        "Strict-Transport-Security",
      ]),
    );
  });
});

describe("rate limit", () => {
  beforeEach(() => reset());

  it("allows a burst then refuses", () => {
    const now = Date.now();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(consume("1.2.3.4", now).ok).toBe(true);
    }
    const refused = consume("1.2.3.4", now);
    expect(refused.ok).toBe(false);
    expect(refused.remaining).toBe(0);
    expect(refused.resetInSeconds).toBeGreaterThan(0);
  });

  it("keeps callers independent", () => {
    const now = Date.now();
    for (let attempt = 0; attempt < 5; attempt += 1) consume("1.1.1.1", now);
    expect(consume("2.2.2.2", now).ok).toBe(true);
  });

  it("opens a new window once the old one expires", () => {
    const now = Date.now();
    for (let attempt = 0; attempt < 6; attempt += 1) consume("3.3.3.3", now);
    expect(consume("3.3.3.3", now + 61_000).ok).toBe(true);
  });

  it("takes the first forwarded address, and falls back safely", () => {
    expect(clientKey(new Headers({ "x-forwarded-for": "9.9.9.9, 10.0.0.1" }))).toBe("9.9.9.9");
    expect(clientKey(new Headers({ "x-real-ip": "8.8.8.8" }))).toBe("8.8.8.8");
    expect(clientKey(new Headers())).toBe("anonymous");
  });
});

describe("contact schema", () => {
  const valid = {
    name: "A Reader",
    email: "reader@example.org",
    intent: "research" as const,
    message: "We monitor a dependency we cannot see through and would like to talk about it.",
  };

  it("accepts a well-formed submission", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a bad address, a short message and an unknown intent", () => {
    expect(contactSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, message: "hello" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, intent: "spam" }).success).toBe(false);
  });

  it("rejects a filled honeypot", () => {
    expect(contactSchema.safeParse({ ...valid, website: "http://spam" }).success).toBe(false);
  });

  it("bounds the message so a submission cannot be used as a payload", () => {
    expect(contactSchema.safeParse({ ...valid, message: "x".repeat(4001) }).success).toBe(false);
  });
});
