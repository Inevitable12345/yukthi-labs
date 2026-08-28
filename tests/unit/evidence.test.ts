import { describe, expect, it } from "vitest";
import { EVIDENCE, EVIDENCE_BY_ID, evidenceFor } from "@/content/evidence";
import { DECISION_SCOPES } from "@/content/decisions";
import { GRAPHS } from "@/content/scenarios";
import { ROOM_COPY } from "@/content/thesis";

/* The evidence standard from §33 and §46, enforced rather than promised. */

describe("evidence library", () => {
  it("has unique ids", () => {
    expect(new Set(EVIDENCE.map((record) => record.id)).size).toBe(EVIDENCE.length);
  });

  it("names an organisation and a document for every record", () => {
    for (const record of EVIDENCE) {
      expect(record.organization.length, record.id).toBeGreaterThan(2);
      expect(record.title.length, record.id).toBeGreaterThan(8);
    }
  });

  it("separates what the source says from what Yukthi concludes", () => {
    for (const record of EVIDENCE) {
      expect(record.claim.length, record.id).toBeGreaterThan(40);
      expect(record.interpretation.length, record.id).toBeGreaterThan(40);
      expect(record.claim, record.id).not.toBe(record.interpretation);
    }
  });

  it("gives every record a way to be located — a stable link or a locator", () => {
    for (const record of EVIDENCE) {
      const locatable = Boolean(record.url) || Boolean(record.locator);
      expect(locatable, record.id).toBe(true);
      if (record.url) expect(record.url.startsWith("https://"), record.id).toBe(true);
    }
  });

  it("resolves the ids cited by every room", () => {
    for (const copy of Object.values(ROOM_COPY)) {
      for (const id of copy.evidenceIds ?? []) {
        expect(EVIDENCE_BY_ID[id], `${copy.id} cites ${id}`).toBeDefined();
      }
    }
  });

  it("resolves the ids cited by every decision scope", () => {
    for (const scope of DECISION_SCOPES) {
      for (const id of scope.evidenceIds) {
        expect(EVIDENCE_BY_ID[id], `${scope.id} cites ${id}`).toBeDefined();
      }
    }
  });

  it("resolves the ids attached to graph nodes and relations", () => {
    for (const graph of Object.values(GRAPHS)) {
      const ids = [
        ...graph.nodes.flatMap((node) => node.evidenceIds ?? []),
        ...graph.relations.flatMap((relation) => relation.evidenceIds ?? []),
      ];
      for (const id of ids) {
        expect(EVIDENCE_BY_ID[id], `${graph.id} cites ${id}`).toBeDefined();
      }
    }
  });

  it("ignores unknown ids rather than rendering an empty record", () => {
    expect(evidenceFor(["nope"])).toEqual([]);
    expect(evidenceFor(undefined)).toEqual([]);
  });
});

describe("no fabricated certainty", () => {
  const surfaces = [
    ...Object.values(ROOM_COPY).flatMap((copy) => [
      copy.headline,
      copy.standfirst ?? "",
      copy.pull ?? "",
      ...copy.body,
    ]),
    ...EVIDENCE.flatMap((record) => [record.claim, record.interpretation, record.supports]),
    ...Object.values(GRAPHS).flatMap((graph) =>
      graph.relations.map((relation) => relation.mechanism),
    ),
  ];

  it("publishes no probability value", () => {
    // §46: no fake probabilities anywhere in the argument.
    for (const text of surfaces) {
      expect(text, text.slice(0, 60)).not.toMatch(
        /\b\d{1,3}(\.\d+)?\s*%\s*(chance|probability|likely)/i,
      );
      expect(text, text.slice(0, 60)).not.toMatch(/\bprobability of \d/i);
    }
  });

  it("promises no guaranteed prediction", () => {
    for (const text of surfaces) {
      expect(text, text.slice(0, 60)).not.toMatch(
        /guarantee[sd]? (accurate|prediction|detection)/i,
      );
      expect(text, text.slice(0, 60)).not.toMatch(/\bperfectly predicts?\b/i);
    }
  });
});
