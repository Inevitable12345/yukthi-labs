"use client";

import { useMemo } from "react";

import { EvidenceCard } from "@/components/evidence/EvidenceCard";
import { Dialog } from "@/components/ui/Dialog";
import { Hairline } from "@/components/ui/Hairline";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { getEvidenceMany } from "@/data/evidence";
import type { CausalGraph } from "@/data/schema";
import { indexGraph, traceDownstream } from "@/lib/graph/geometry";
import {
  KIND_LABEL,
  ORDER_LABEL,
  POLARITY_LABEL,
  RELATION_STATE_LABEL,
} from "@/lib/graph/tokens";

export type InspectorSelection =
  { type: "node"; id: string } | { type: "relation"; id: string } | null;

/**
 * The inspector.
 *
 * Every field is either filled from the data or shown as "Not recorded". There is
 * no default confidence, no placeholder probability and no inferred timestamp:
 * an empty field is information, and filling it with a plausible number would be
 * the single most dishonest thing this interface could do.
 */
export function CausalInspector({
  graph,
  selection,
  onClose,
  onSelectNode,
}: {
  graph: CausalGraph;
  selection: InspectorSelection;
  onClose: () => void;
  onSelectNode: (id: string) => void;
}) {
  const index = useMemo(() => indexGraph(graph), [graph]);

  if (!selection) return null;

  if (selection.type === "relation") {
    const relation = graph.relations.find((candidate) => candidate.id === selection.id);
    if (!relation) return null;
    const evidence = getEvidenceMany(relation.evidenceIds);

    return (
      <Dialog
        open
        onClose={onClose}
        title="Relation"
        labelledBy="inspector-title"
        variant="drawer"
        description="Details of a causal relation, its mechanism, evidence and alternative readings."
      >
        <InspectorHeader onClose={onClose} eyebrow="Relation" />
        <div className="px-6 pb-16 sm:px-8">
          <h2 id="inspector-title" className="u-display-3 text-bone">
            {relation.label ?? "Causal relation"}
          </h2>

          <Field label="Relationship">
            {relation.sourceIds.map((id) => index.nodeById.get(id)?.label ?? id).join(" + ")}
            {" → "}
            {relation.targetIds.map((id) => index.nodeById.get(id)?.label ?? id).join(" + ")}
          </Field>

          <Field label="Mechanism">{relation.mechanism ?? "Not recorded"}</Field>
          <Field label="Polarity">
            {relation.polarity ? POLARITY_LABEL[relation.polarity] : "Not recorded"}
          </Field>
          <Field label="Confidence">
            {typeof relation.confidence === "number"
              ? `${Math.round(relation.confidence * 100)}%`
              : "Not recorded — no calibrated estimate exists for this relation"}
          </Field>
          <Field label="Causal distance">{ORDER_LABEL[relation.order ?? 1]}</Field>
          <Field label="Status">
            {RELATION_STATE_LABEL[relation.state ?? "active"]}
            {relation.illustrative ? " · illustrative" : ""}
          </Field>

          <div className="mt-8">
            <InstrumentLabel as="p" tone="gold">
              Alternative hypotheses
            </InstrumentLabel>
            {relation.alternatives?.length ? (
              <ul className="mt-3 space-y-3">
                {relation.alternatives.map((alternative) => (
                  <li
                    key={alternative}
                    className="border-l border-[color:var(--hairline-strong)] pl-4 text-[0.8125rem] leading-relaxed text-muted-bone"
                  >
                    {alternative}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[0.8125rem] text-dim-bone">
                None recorded. That is a gap in this map, not evidence that none exist.
              </p>
            )}
          </div>

          <EvidenceBlock records={evidence} />
        </div>
      </Dialog>
    );
  }

  const node = index.nodeById.get(selection.id);
  if (!node) return null;

  const upstream = Array.from(index.upstreamByNode.get(node.id) ?? []);
  const downstream = Array.from(index.downstreamByNode.get(node.id) ?? []);
  const distances = traceDownstream(index, node.id, 3);
  const secondOrder = [...distances.entries()]
    .filter(([, order]) => order === 2)
    .map(([id]) => id);
  const thirdOrder = [...distances.entries()]
    .filter(([, order]) => order === 3)
    .map(([id]) => id);
  const evidence = getEvidenceMany(node.evidenceIds);
  const mechanisms = (index.relationsByNode.get(node.id) ?? [])
    .filter((relation) => relation.mechanism)
    .map((relation) => relation.mechanism!);

  return (
    <Dialog
      open
      onClose={onClose}
      title="Node"
      labelledBy="inspector-title"
      variant="drawer"
      description="Details of a causal node, its state, evidence and downstream consequences."
    >
      <InspectorHeader onClose={onClose} eyebrow={`Node · ${KIND_LABEL[node.kind]}`} />
      <div className="px-6 pb-16 sm:px-8">
        <h2 id="inspector-title" className="u-display-3 text-bone">
          {node.label}
        </h2>

        {node.description ? <p className="u-body mt-4">{node.description}</p> : null}

        <Field label="Current state">{node.state ?? "Not recorded"}</Field>
        <Field label="Causal role">
          {upstream.length === 0
            ? "Origin — nothing upstream of this node is represented in this scope"
            : downstream.length === 0
              ? "Terminal — this scope stops here"
              : "Intermediate — carries an effect from upstream to downstream"}
        </Field>

        <div className="mt-8">
          <InstrumentLabel as="p">Mechanism</InstrumentLabel>
          {mechanisms.length ? (
            <ul className="mt-3 space-y-3">
              {mechanisms.map((mechanism) => (
                <li
                  key={mechanism}
                  className="text-[0.8125rem] leading-relaxed text-muted-bone"
                >
                  {mechanism}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-[0.8125rem] text-dim-bone">Not recorded.</p>
          )}
        </div>

        <NodeList
          label="Upstream"
          ids={upstream}
          graph={graph}
          onSelect={onSelectNode}
          empty="Nothing upstream within this scope."
        />
        <NodeList
          label="Downstream · 1°"
          ids={downstream}
          graph={graph}
          onSelect={onSelectNode}
          empty="Nothing downstream within this scope."
        />
        <NodeList
          label="Second-order effects · 2°"
          ids={secondOrder}
          graph={graph}
          onSelect={onSelectNode}
          empty="None within this scope."
        />
        <NodeList
          label="Third-order effects · 3°"
          ids={thirdOrder}
          graph={graph}
          onSelect={onSelectNode}
          empty="None within this scope."
        />

        <Field label="Uncertainty">
          {typeof node.confidence === "number"
            ? `${Math.round(node.confidence * 100)}% confidence`
            : "Not recorded — this node carries no calibrated confidence estimate"}
        </Field>
        <Field label="Last update">{node.timestamp ?? "Not recorded"}</Field>
        {node.illustrative ? (
          <Field label="Provenance">
            Illustrative — this node explains a mechanism and does not report an observation.
          </Field>
        ) : null}

        <EvidenceBlock records={evidence} />
      </div>
    </Dialog>
  );
}

function InspectorHeader({ onClose, eyebrow }: { onClose: () => void; eyebrow: string }) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-6 border-b border-[color:var(--hairline)] bg-deep-field px-6 py-5 sm:px-8">
      <InstrumentLabel tone="steel">{eyebrow}</InstrumentLabel>
      <button
        type="button"
        onClick={onClose}
        className="min-h-11 font-mono text-[0.625rem] tracking-[0.2em] text-muted-bone uppercase transition-colors hover:text-gold"
      >
        Close
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <InstrumentLabel as="p">{label}</InstrumentLabel>
      <p className="mt-1.5 text-[0.875rem] leading-relaxed text-muted-bone">{children}</p>
    </div>
  );
}

function NodeList({
  label,
  ids,
  graph,
  onSelect,
  empty,
}: {
  label: string;
  ids: string[];
  graph: CausalGraph;
  onSelect: (id: string) => void;
  empty: string;
}) {
  return (
    <div className="mt-8">
      <InstrumentLabel as="p">{label}</InstrumentLabel>
      {ids.length ? (
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {ids.map((id) => {
            const node = graph.nodes.find((candidate) => candidate.id === id);
            if (!node) return null;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onSelect(id)}
                  className="min-h-11 border-b border-transparent text-[0.8125rem] text-bone transition-colors hover:border-gold hover:text-gold"
                >
                  {node.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-1.5 text-[0.8125rem] text-dim-bone">{empty}</p>
      )}
    </div>
  );
}

function EvidenceBlock({ records }: { records: ReturnType<typeof getEvidenceMany> }) {
  return (
    <div className="mt-10">
      <Hairline />
      <div className="pt-6">
        <InstrumentLabel as="p" tone="gold">
          Evidence · {records.length}
        </InstrumentLabel>
        {records.length ? (
          <div className="mt-5 space-y-8">
            {records.map((record) => (
              <EvidenceCard key={record.id} record={record} compact />
            ))}
          </div>
        ) : (
          <p className="mt-2 text-[0.8125rem] text-dim-bone">
            No source record is attached to this element.
          </p>
        )}
      </div>
    </div>
  );
}
