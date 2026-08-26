import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { absoluteUrl, siteUrl } from "@/lib/metadata/site";

/**
 * Regression tests for a bug that failed an entire production build.
 *
 * `metadataBase: new URL(siteUrl())` is evaluated while Next.js collects page
 * configuration. When NEXT_PUBLIC_SITE_URL was defined but empty — an
 * environment variable added in a dashboard and left unfilled — `??` passed the
 * empty string through, `new URL("")` threw `ERR_INVALID_URL`, and every route
 * failed to build. So: this function must never throw, and must never treat a
 * blank value as a configured origin.
 */
const KEYS = ["NEXT_PUBLIC_SITE_URL", "VERCEL_PROJECT_PRODUCTION_URL", "VERCEL_URL"] as const;

let saved: Record<string, string | undefined> = {};

beforeEach(() => {
  saved = Object.fromEntries(KEYS.map((key) => [key, process.env[key]]));
  for (const key of KEYS) delete process.env[key];
});

afterEach(() => {
  for (const key of KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
});

describe("siteUrl", () => {
  it("falls back to localhost when nothing is configured", () => {
    expect(siteUrl()).toBe("http://localhost:3000");
  });

  it("treats an empty variable as unconfigured — the bug that broke the build", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "";
    expect(siteUrl()).toBe("http://localhost:3000");
    expect(() => new URL(siteUrl())).not.toThrow();
  });

  it("treats a whitespace-only variable as unconfigured", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "   ";
    expect(siteUrl()).toBe("http://localhost:3000");
  });

  it("skips a blank value and uses the next source that has one", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "yukthi-labs.vercel.app";
    expect(siteUrl()).toBe("https://yukthi-labs.vercel.app");
  });

  it("adds https:// to Vercel's bare hostname variables", () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "yukthi-labs.vercel.app";
    expect(siteUrl()).toBe("https://yukthi-labs.vercel.app");
  });

  it("falls through to the deployment URL when no production domain is set", () => {
    process.env.VERCEL_URL = "yukthi-labs-abc123.vercel.app";
    expect(siteUrl()).toBe("https://yukthi-labs-abc123.vercel.app");
  });

  it("prefers an explicit origin over Vercel's", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://yukthi.example";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "yukthi-labs.vercel.app";
    expect(siteUrl()).toBe("https://yukthi.example");
  });

  it("strips trailing slashes", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://yukthi.example///";
    expect(siteUrl()).toBe("https://yukthi.example");
  });

  it("preserves a configured base path", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/lab/";
    expect(siteUrl()).toBe("https://example.com/lab");
  });

  it("keeps http for local development", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:4000";
    expect(siteUrl()).toBe("http://localhost:4000");
  });

  it("degrades instead of throwing on an unparseable value", () => {
    for (const bad of ["http://", "https://", ":::", "http://[", " \t "]) {
      process.env.NEXT_PUBLIC_SITE_URL = bad;
      expect(() => siteUrl(), bad).not.toThrow();
      expect(() => new URL(siteUrl()), bad).not.toThrow();
    }
  });

  it("always returns something new URL() accepts — metadataBase depends on it", () => {
    const cases = ["", "   ", "example.com", "https://example.com/", "nonsense", "http://"];
    for (const value of cases) {
      process.env.NEXT_PUBLIC_SITE_URL = value;
      expect(() => new URL(siteUrl()), `input ${JSON.stringify(value)}`).not.toThrow();
    }
  });
});

describe("absoluteUrl", () => {
  it("joins a path onto the origin, with or without a leading slash", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://yukthi.example";
    expect(absoluteUrl("/thesis")).toBe("https://yukthi.example/thesis");
    expect(absoluteUrl("thesis")).toBe("https://yukthi.example/thesis");
  });

  it("defaults to the root", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://yukthi.example";
    expect(absoluteUrl()).toBe("https://yukthi.example/");
  });

  it("produces a valid URL even when the origin is misconfigured", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "";
    expect(() => new URL(absoluteUrl("/evidence"))).not.toThrow();
  });
});
