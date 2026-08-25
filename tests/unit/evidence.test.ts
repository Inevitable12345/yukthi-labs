import { describe, expect, it } from "vitest";

import {
  evidenceById,
  evidenceCounts,
  evidenceRecords,
  getEvidence,
  getEvidenceMany,
} from "@/data/evidence";
import { evidenceRecordSchema } from "@/data/schema";

/**
 * These tests exist to protect the site's integrity claims, not its rendering.
 * Every one of them corresponds to a promise the site makes to the reader.
 */
describe("evidence library", () => {
  it("every record satisfies the schema", () => {
    for (const record of evidenceRecords) {
      expect(() => evidenceRecordSchema.parse(record)).not.toThrow();
    }
  });

  it("uses unique, sequentially formatted identifiers", () => {
    const ids = evidenceRecords.map((record) => record.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^E-\d{3}$/);
  });

  it("never records a non-HTTPS or malformed source URL", () => {
    for (const record of evidenceRecords) {
      if (!record.url) continue;
      const url = new URL(record.url);
      expect(url.protocol).toBe("https:");
      expect(url.hostname.length).toBeGreaterThan(3);
    }
  });

  it("states a verification status on every record", () => {
    for (const record of evidenceRecords) {
      expect(["verified", "needs-verification", "illustrative"]).toContain(record.status);
    }
  });

  it("gives every verified record a source, a date and a checked-on date", () => {
    for (const record of evidenceRecords.filter((r) => r.status === "verified")) {
      expect(record.organization, `${record.id} organization`).toBeTruthy();
      expect(record.date, `${record.id} date`).toBeTruthy();
      expect(record.accessedAt, `${record.id} accessedAt`).toBeTruthy();
    }
  });

  it("explains the causal relevance of every record", () => {
    for (const record of evidenceRecords) {
      expect(record.causalRelevance, `${record.id}`).toBeTruthy();
    }
  });

  it("reports counts that match the underlying array", () => {
    expect(evidenceCounts.total).toBe(evidenceRecords.length);
    expect(
      evidenceCounts.verified + evidenceCounts.needsVerification + evidenceCounts.illustrative,
    ).toBe(evidenceRecords.length);
  });

  it("resolves records by id and ignores unknown ids", () => {
    expect(getEvidence("E-001")?.id).toBe("E-001");
    expect(getEvidence("E-999")).toBeUndefined();
    expect(getEvidenceMany(["E-001", "E-999", "E-002"]).map((r) => r.id)).toEqual([
      "E-001",
      "E-002",
    ]);
    expect(getEvidenceMany()).toEqual([]);
  });

  it("indexes every record", () => {
    expect(evidenceById.size).toBe(evidenceRecords.length);
  });
});
