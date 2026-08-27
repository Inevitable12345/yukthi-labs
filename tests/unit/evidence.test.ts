import { describe, expect, it } from "vitest";

import {
  evidenceRecords,
  evidenceById,
  getEvidenceMany,
  evidenceCounts,
} from "@/data/evidence";
import { signatureGraphs } from "@/data/graphs";
import { decisionScopes } from "@/data/scopes";
import { demoScenarios } from "@/data/scenarios";

/* The evidence base is the site's integrity claim. These tests are the thing
   that keeps it true as the content changes. */

describe("evidence records", () => {
  it("have unique, well-formed identifiers", () => {
    const ids = evidenceRecords.map((record) => record.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^E-\d{3}$/);
  });

  it("name an organisation and state a claim", () => {
    for (const record of evidenceRecords) {
      expect(record.organization.length).toBeGreaterThan(0);
      expect(record.claim.length).toBeGreaterThan(20);
    }
  });

  it("record what the figure does not say", () => {
    // A number without its limits is a misquotation. Every record must carry
    // its own hedge.
    for (const record of evidenceRecords) {
      expect(record.context, `${record.id} is missing context`).toBeTruthy();
    }
  });

  it("explain why each source matters causally", () => {
    for (const record of evidenceRecords) {
      expect(record.causalRelevance, `${record.id} is missing causal relevance`).toBeTruthy();
    }
  });

  it("use https for every URL that is present", () => {
    for (const record of evidenceRecords) {
      if (!record.url) continue;
      expect(record.url.startsWith("https://"), `${record.id} is not https`).toBe(true);
    }
  });

  it("carry an explicit verification status", () => {
    for (const record of evidenceRecords) {
      expect(["verified", "needs-verification"]).toContain(record.status);
    }
    expect(evidenceCounts.total).toBe(evidenceRecords.length);
    expect(evidenceCounts.verified + evidenceCounts.needsVerification).toBe(
      evidenceCounts.total,
    );
  });

  it("resolves known ids and ignores unknown ones", () => {
    expect(getEvidenceMany(["E-001"]).length).toBe(1);
    expect(getEvidenceMany(["E-999"]).length).toBe(0);
    expect(getEvidenceMany(["E-001", "E-999"]).length).toBe(1);
  });
});

describe("every evidence reference on the site resolves", () => {
  const missing: string[] = [];

  const check = (ids: readonly string[] | undefined, where: string) => {
    for (const id of ids ?? []) {
      if (!evidenceById.has(id)) missing.push(`${where} → ${id}`);
    }
  };

  it("across graphs, nodes, relations, scopes and scenarios", () => {
    for (const graph of Object.values(signatureGraphs)) {
      check(graph.evidenceIds, `graph ${graph.id}`);
      for (const node of graph.nodes) check(node.evidenceIds, `${graph.id}/${node.id}`);
      for (const relation of graph.relations) {
        check(relation.evidenceIds, `${graph.id}/${relation.id}`);
      }
    }

    for (const scope of decisionScopes) check(scope.evidenceIds, `scope ${scope.id}`);
    for (const scenario of demoScenarios)
      check(scenario.evidenceIds, `scenario ${scenario.id}`);

    expect(missing).toEqual([]);
  });
});

describe("causal graphs", () => {
  it("give every relation a mechanism", () => {
    // A relation without a mechanism is an association wearing a causal label.
    for (const graph of Object.values(signatureGraphs)) {
      for (const relation of graph.relations) {
        expect(
          relation.mechanism.length,
          `${graph.id}/${relation.id} has no mechanism`,
        ).toBeGreaterThan(20);
      }
    }
  });

  it("give every graph a text alternative", () => {
    for (const graph of Object.values(signatureGraphs)) {
      expect(graph.textAlternative.length).toBeGreaterThan(80);
    }
  });

  it("reference only nodes that exist", () => {
    // `defineGraph` enforces this at module load; this asserts the guard works.
    for (const graph of Object.values(signatureGraphs)) {
      const ids = new Set(graph.nodes.map((node) => node.id));
      for (const relation of graph.relations) {
        for (const id of [...relation.sourceIds, ...relation.targetIds]) {
          expect(ids.has(id), `${graph.id}/${relation.id} → ${id}`).toBe(true);
        }
      }
    }
  });

  it("contain at least one genuine hyperedge where the argument needs one", () => {
    const hyperedged = (id: keyof typeof signatureGraphs) =>
      signatureGraphs[id].relations.some(
        (relation) => relation.sourceIds.length > 1 || relation.targetIds.length > 1,
      );

    // These two acts exist specifically to demonstrate many-to-many causation.
    expect(hyperedged("semiconductorHypergraph")).toBe(true);
    expect(hyperedged("comingDecade")).toBe(true);
  });

  it("closes the Uri loop", () => {
    // The reinforcing arrow is the entire point of that act. If it is ever
    // removed the diagram becomes a chain and the argument silently breaks.
    const graph = signatureGraphs.uriFeedback;
    const closing = graph.relations.find(
      (relation) =>
        relation.targetIds.includes("genfail") && relation.sourceIds.includes("fuel"),
    );
    expect(closing).toBeDefined();
  });
});

describe("illustrative scenarios", () => {
  it("never carry a probability", () => {
    // §18: no probability values, not one. This test is the enforcement.
    const serialised = JSON.stringify(demoScenarios);
    expect(serialised).not.toMatch(/"probability"/);
    expect(serialised).not.toMatch(/\b\d{1,3}\s?% (chance|likely|probability)/i);
  });

  it("cite at least one real source each", () => {
    for (const scenario of demoScenarios) {
      expect(scenario.evidenceIds.length).toBeGreaterThan(0);
    }
  });

  it("give a full propagation structure", () => {
    for (const scenario of demoScenarios) {
      expect(scenario.propagation.length).toBeGreaterThanOrEqual(2);
      expect(scenario.affected.length).toBeGreaterThanOrEqual(3);
      expect(scenario.secondOrder.length).toBeGreaterThanOrEqual(2);
      expect(scenario.thirdOrder.length).toBeGreaterThanOrEqual(2);
      expect(scenario.monitor.length).toBeGreaterThanOrEqual(2);
      expect(scenario.interventions.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("points every scenario at a real decision scope", () => {
    const scopeIds = new Set(decisionScopes.map((scope) => scope.id));
    for (const scenario of demoScenarios) {
      expect(scopeIds.has(scenario.scopeId), `${scenario.id} → ${scenario.scopeId}`).toBe(true);
    }
  });
});

describe("decision scopes", () => {
  it("cover the six roles the brief names", () => {
    const ids = decisionScopes.map((scope) => scope.id).sort();
    expect(ids).toEqual(
      ["energy", "government", "industrial", "insurance", "portfolio", "supply-chain"].sort(),
    );
  });

  it("state a question, an assumption and a three-step trace", () => {
    for (const scope of decisionScopes) {
      expect(scope.question).toMatch(/\?$/);
      expect(scope.assumption.length).toBeGreaterThan(20);
      expect(scope.trace.map((step) => step.order)).toEqual([1, 2, 3]);
    }
  });
});
