import type { CausalGraph } from "@/data/schema";
import {
  KIND_LABEL,
  ORDER_LABEL,
  RELATION_DASH,
  RELATION_STATE_LABEL,
  RELATION_TONE,
  NODE_TONE,
  type RelationState,
} from "@/lib/graph/tokens";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { NodeGlyph } from "./NodeGlyph";

/**
 * Legend derived from the graph itself, so it can never describe a key that is
 * not on the diagram or omit one that is.
 */
export function GraphLegend({ graph }: { graph: CausalGraph }) {
  const kinds = Array.from(new Set(graph.nodes.map((node) => node.kind)));
  const states = Array.from(
    new Set(graph.relations.map((relation) => relation.state ?? "active")),
  ) as RelationState[];
  const orders = Array.from(
    new Set(graph.relations.map((relation) => relation.order ?? 1)),
  ).sort() as Array<1 | 2 | 3>;

  return (
    <div className="mt-5 flex min-w-0 flex-wrap items-start gap-x-10 gap-y-5 border-t border-[color:var(--hairline)] pt-5">
      <div>
        <InstrumentLabel as="p">Node kind</InstrumentLabel>
        <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-2">
          {kinds.map((kind) => (
            <li key={kind} className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                aria-hidden="true"
                className="shrink-0"
              >
                <NodeGlyph kind={kind} x={9} y={9} r={5} tone={NODE_TONE[kind]} />
              </svg>
              <span className="font-mono text-[0.625rem] tracking-[0.12em] text-muted-bone uppercase">
                {KIND_LABEL[kind]}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <InstrumentLabel as="p">Relation state</InstrumentLabel>
        <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-2">
          {states.map((state) => (
            <li key={state} className="flex items-center gap-2">
              <svg width="22" height="6" aria-hidden="true" className="overflow-visible">
                <path
                  d="M 0 3 L 22 3"
                  stroke={RELATION_TONE[state]}
                  strokeWidth="1.4"
                  strokeDasharray={RELATION_DASH[state]}
                />
              </svg>
              <span className="font-mono text-[0.625rem] tracking-[0.12em] text-muted-bone uppercase">
                {RELATION_STATE_LABEL[state]}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {orders.length > 1 ? (
        <div>
          <InstrumentLabel as="p">Causal distance</InstrumentLabel>
          <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-2">
            {orders.map((order) => (
              <li
                key={order}
                className="font-mono text-[0.625rem] tracking-[0.12em] text-muted-bone uppercase"
              >
                {ORDER_LABEL[order]} ·{" "}
                {order === 1 ? "direct" : order === 2 ? "second order" : "third order"}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
