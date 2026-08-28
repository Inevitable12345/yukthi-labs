"use client";

import { useMemo } from "react";
import { layoutGraph, relationCentroid } from "@/lib/graph/layout";
import { NODE_CATEGORY_LABEL, type CausalGraph } from "@/lib/graph/types";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   CAUSAL DIAGRAM
   ----------------------------------------------------------------------------
   The hypergraph rendered honestly. A relation with one source and one target
   is drawn as an arrow. A relation with several sources is drawn as several
   lines meeting at a junction before a single arrow leaves it — because that
   is what conjunction means, and drawing it as parallel arrows would quietly
   assert that either cause alone is sufficient (§10).

   The diagram is decorative to assistive technology; the same structure is
   published beside it as text, which is also what a crawler reads (§42, §45).
   ========================================================================== */

const CATEGORY_TONE: Record<string, string> = {
  event: "var(--color-rupture)",
  actor: "var(--color-brass)",
  policy: "var(--color-brass)",
  market: "var(--color-signal)",
  resource: "var(--color-signal)",
  infrastructure: "var(--color-signal)",
  risk: "var(--color-rupture)",
  outcome: "var(--color-bone)",
};

export type CausalDiagramProps = {
  graph: CausalGraph;
  /** Nodes drawn as reached. Everything else is drawn as present but inert. */
  activeNodeIds?: ReadonlySet<string>;
  /** Relations drawn as fired. */
  activeRelationIds?: ReadonlySet<string>;
  /** Node the inspector is currently focused on. */
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
  orientation?: "vertical" | "horizontal";
  className?: string;
};

export function CausalDiagram({
  graph,
  activeNodeIds,
  activeRelationIds,
  selectedNodeId,
  onSelectNode,
  orientation = "vertical",
  className,
}: CausalDiagramProps) {
  const layout = useMemo(
    // Row spacing has to clear the widest label box, or siblings at the same
    // causal depth collide — which reads as a relationship that is not there.
    () => layoutGraph(graph, { orientation, depthGap: 94, rowGap: 216 }),
    [graph, orientation],
  );

  const padding = 120;
  const viewBox = [
    -layout.width / 2 - padding,
    -padding * 0.6,
    layout.width + padding * 2,
    layout.height + padding * 1.4,
  ].join(" ");

  const hasSelection = Boolean(activeNodeIds);

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={`Causal diagram: ${graph.title}. A full text description follows.`}
      className={cn(
        // The diagram gets its own ground. Read against the world field alone,
        // thin relation strokes disappear into the particles behind them.
        "w-full overflow-x-auto border border-graphite bg-ink/55 p-4 sm:p-6",
        className,
      )}
    >
      <svg viewBox={viewBox} aria-hidden="true" className="h-auto w-full min-w-[34rem]">
        <defs>
          <marker
            id={`arrow-${graph.id}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>

        {graph.relations.map((relation) => {
          const fired = !activeRelationIds || activeRelationIds.has(relation.id);
          const junction = relationCentroid(layout, [...relation.sourceIds, ...relation.targetIds]);
          if (!junction) return null;
          const conjunction = relation.sourceIds.length > 1;
          const opacity = fired ? 0.95 : 0.45;

          return (
            <g
              key={relation.id}
              style={{
                color: fired ? "var(--color-signal)" : "var(--color-signal-dim)",
                transition: "opacity 700ms ease, color 700ms ease",
              }}
              opacity={opacity}
            >
              {relation.sourceIds.map((sourceId) => {
                const source = layout.nodes.get(sourceId);
                if (!source) return null;
                return (
                  <path
                    key={`${relation.id}-in-${sourceId}`}
                    d={curve(source.x, source.y, junction.x, junction.y, orientation)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={fired ? 1.4 : 1}
                  />
                );
              })}

              {relation.targetIds.map((targetId) => {
                const target = layout.nodes.get(targetId);
                if (!target) return null;
                return (
                  <path
                    key={`${relation.id}-out-${targetId}`}
                    d={curve(junction.x, junction.y, target.x, target.y, orientation)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={fired ? 1.4 : 1}
                    markerEnd={`url(#arrow-${graph.id})`}
                  />
                );
              })}

              {conjunction ? (
                <>
                  {/* The junction is the conjunction made visible: both causes
                      must arrive here before anything leaves. */}
                  <circle cx={junction.x} cy={junction.y} r={5.5} fill="var(--color-void)" />
                  <circle
                    cx={junction.x}
                    cy={junction.y}
                    r={5.5}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.4}
                  />
                  <text
                    x={junction.x}
                    y={junction.y + 3}
                    textAnchor="middle"
                    fontSize="7"
                    fill="currentColor"
                    fontFamily="var(--font-mono)"
                  >
                    &amp;
                  </text>
                </>
              ) : null}
            </g>
          );
        })}

        {graph.nodes.map((node) => {
          const point = layout.nodes.get(node.id);
          if (!point) return null;
          const reached = !hasSelection || activeNodeIds!.has(node.id);
          const selected = selectedNodeId === node.id;
          const tone = CATEGORY_TONE[node.category] ?? "var(--color-bone)";
          const width = Math.max(94, Math.min(170, node.label.length * 6.1 + 22));

          return (
            <g
              key={node.id}
              transform={`translate(${point.x} ${point.y})`}
              style={{ transition: "opacity 700ms ease" }}
              opacity={reached ? 1 : 0.55}
              onClick={onSelectNode ? () => onSelectNode(node.id) : undefined}
              className={onSelectNode ? "cursor-pointer" : undefined}
            >
              <rect
                x={-width / 2}
                y={-15}
                width={width}
                height={30}
                fill="var(--color-void)"
                stroke={selected ? "var(--color-brass)" : reached ? tone : "var(--color-graphite)"}
                strokeWidth={selected ? 1.6 : 1}
              />
              <rect
                x={-width / 2}
                y={-15}
                width={2.5}
                height={30}
                fill={tone}
                opacity={reached ? 1 : 0.4}
              />
              <text
                x={0}
                y={4}
                textAnchor="middle"
                fontSize="9"
                fontFamily="var(--font-mono)"
                letterSpacing="0.04em"
                fill={reached ? "var(--color-bone)" : "var(--color-ash)"}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      <GraphText graph={graph} />
    </div>
  );
}

/** Curved connector. Bows along the causal axis so crossings stay readable. */
function curve(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  orientation: "vertical" | "horizontal",
): string {
  if (orientation === "vertical") {
    const midpoint = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${midpoint}, ${x2} ${midpoint}, ${x2} ${y2}`;
  }
  const midpoint = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${midpoint} ${y1}, ${midpoint} ${y2}, ${x2} ${y2}`;
}

/**
 * The diagram as prose. Not a caption — the complete structure, so that nothing
 * essential exists only inside a graphic (§42).
 */
function GraphText({ graph }: { graph: CausalGraph }) {
  return (
    <details className="mt-6 border border-graphite/70 bg-void/60">
      <summary className="cursor-pointer px-4 py-3 font-mono text-[0.7rem] tracking-[0.16em] uppercase text-ash hover:text-bone">
        Read this diagram as text — {graph.relations.length} relations, {graph.nodes.length} nodes
      </summary>
      <div className="border-t border-graphite/70 px-4 py-4">
        <p className="mb-4 font-mono text-[0.7rem] tracking-[0.08em] text-ash">
          Scoped to: {graph.scopedTo}
        </p>
        <ol className="space-y-3">
          {graph.relations.map((relation) => {
            const name = (id: string) => graph.nodes.find((node) => node.id === id)?.label ?? id;
            return (
              <li key={relation.id} className="text-[0.82rem] leading-relaxed text-bone/85">
                <span className="font-mono text-[0.7rem] tracking-[0.08em] text-brass">
                  {relation.sourceIds.map(name).join(" and ")} →{" "}
                  {relation.targetIds.map(name).join(", ")}
                </span>
                <br />
                {relation.mechanism}
                {relation.lag ? (
                  <span className="text-ash"> Characteristic lag: {relation.lag}.</span>
                ) : null}
              </li>
            );
          })}
        </ol>
        <p className="mt-5 font-mono text-[0.66rem] tracking-[0.08em] text-ash">
          Node categories:{" "}
          {[...new Set(graph.nodes.map((node) => NODE_CATEGORY_LABEL[node.category]))].join(", ")}.
        </p>
      </div>
    </details>
  );
}
