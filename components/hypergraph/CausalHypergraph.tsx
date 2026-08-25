"use client";

import { useMemo, useState } from "react";

import { CausalInspector } from "./CausalInspector";
import { GraphLegend } from "./GraphLegend";
import { GraphTextAlternative } from "./GraphTextAlternative";
import { NodeGlyph } from "./NodeGlyph";
import { IllustrativeBadge } from "@/components/evidence/IllustrativeBadge";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import type { CausalGraph, CausalRelation, PositionedNode } from "@/data/schema";
import {
  centroid,
  curve,
  hyperedgeJunction,
  indexGraph,
  project,
  shorten,
  type Point,
  type Viewport,
} from "@/lib/graph/geometry";
import { wrapLabel } from "@/lib/graph/labels";
import {
  NODE_TONE,
  ORDER_LABEL,
  ORDER_OPACITY,
  RELATION_DASH,
  RELATION_TONE,
} from "@/lib/graph/tokens";
import { track } from "@/lib/analytics/analytics";
import { cn } from "@/lib/utils/cn";
import { useInView } from "@/lib/utils/use-in-view";

const VIEW_WIDTH = 1200;

type Props = {
  graph: CausalGraph;
  /** viewBox height. Sets the diagram's aspect ratio. */
  height?: number;
  /** Minimum rendered width before the figure scrolls inside its own frame. */
  minWidth?: number;
  caption?: string;
  className?: string;
  /** Turns off the entrance sequence for diagrams that are already on screen. */
  animate?: boolean;
};

/**
 * The signature visualisation: a scoped causal hypergraph.
 *
 * A hyperedge with several sources is drawn as sources → junction → targets, not
 * as a bundle of pairwise lines. That distinction is the entire reason the site
 * uses a hypergraph: pairwise edges can only say "A affects C", while the junction
 * says "A, B and D *together* produce C, and none of them does alone".
 *
 * Accessibility: every node is a focusable control with an accessible name; every
 * relation state carries a stroke pattern as well as a colour; every causal order
 * carries a printed degree as well as an opacity; and the whole diagram has a
 * prose alternative that is always present in the DOM, not a hover-only tooltip.
 */
export function CausalHypergraph({
  graph,
  height = 620,
  minWidth = 880,
  caption,
  className,
  animate = true,
}: Props) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.12 });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selected, setSelected] = useState<
    { type: "node"; id: string } | { type: "relation"; id: string } | null
  >(null);

  const viewport: Viewport = useMemo(
    () => ({
      width: VIEW_WIDTH,
      height,
      padding: { top: 54, right: 130, bottom: 66, left: 120 },
    }),
    [height],
  );

  const index = useMemo(() => indexGraph(graph), [graph]);

  const points = useMemo(() => {
    const map = new Map<string, Point>();
    for (const node of graph.nodes) map.set(node.id, project(node, viewport));
    return map;
  }, [graph, viewport]);

  const highlighted = useMemo(() => {
    if (!activeId) return null;
    const set = new Set<string>([activeId]);
    for (const id of index.neighboursByNode.get(activeId) ?? []) set.add(id);
    return set;
  }, [activeId, index]);

  const activeRelationIds = useMemo(() => {
    if (!activeId) return null;
    return new Set((index.relationsByNode.get(activeId) ?? []).map((relation) => relation.id));
  }, [activeId, index]);

  const started = !animate || inView;

  const openNode = (id: string) => {
    setSelected({ type: "node", id });
    track("causal_node_open", { graph: graph.id, node: id });
  };

  const openRelation = (id: string) => {
    setSelected({ type: "relation", id });
    track("causal_node_open", { graph: graph.id, relation: id });
  };

  return (
    <figure className={cn("relative min-w-0 max-w-full", className)} ref={ref}>
      <figcaption className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <InstrumentLabel tone="steel">{graph.title}</InstrumentLabel>
          {graph.illustrative ? <IllustrativeBadge /> : null}
        </div>
        <InstrumentLabel className="hidden sm:block">Scope · {graph.scope}</InstrumentLabel>
      </figcaption>

      <div className="u-figure-scroll relative border border-[color:var(--hairline)] bg-deep-field/40">
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
          /* A group rather than an image: the nodes inside are real controls,
             and `role="img"` would promise a leaf that has no focusable children. */
          role="group"
          aria-label={`${graph.title}. ${graph.scope}. Contains ${graph.nodes.length} interactive causal nodes; a full text reading follows the diagram.`}
          className="block h-auto w-full"
          style={{ minWidth }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker
              id={`${graph.id}-arrow`}
              viewBox="0 0 10 10"
              refX="8.5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.6 L 9 5 L 0 8.4 z" fill="currentColor" />
            </marker>
          </defs>

          {/* relations first, so glyphs sit above the lines */}
          <g>
            {graph.relations.map((relation, relationIndex) => (
              <RelationMark
                key={relation.id}
                graphId={graph.id}
                relation={relation}
                points={points}
                dimmed={Boolean(activeRelationIds) && !activeRelationIds?.has(relation.id)}
                started={started}
                delay={relationIndex * 110}
                animate={animate}
                onOpen={() => openRelation(relation.id)}
              />
            ))}
          </g>

          <g>
            {graph.nodes.map((node, nodeIndex) => {
              const point = points.get(node.id)!;
              const tone = NODE_TONE[node.kind];
              const dimmed = Boolean(highlighted) && !highlighted?.has(node.id);
              const isActive = activeId === node.id;
              const lines = wrapLabel(node.label, 22, 2);
              const evidenceCount = node.evidenceIds?.length ?? 0;
              const label = labelPlacement(point, node.labelSide, node.anchor, lines.length);

              return (
                <g
                  key={node.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.label}. ${node.kind}.${
                    node.state ? ` State: ${node.state}.` : ""
                  }${evidenceCount ? ` ${evidenceCount} evidence records.` : ""} Activate to inspect.`}
                  className={cn(
                    "cursor-pointer transition-opacity duration-300 outline-none",
                    started && animate ? "u-causal-in" : "",
                  )}
                  style={{
                    opacity: started ? (dimmed ? 0.2 : 1) : undefined,
                    ["--delay" as string]: `${nodeIndex * 90}ms`,
                  }}
                  onMouseEnter={() => setActiveId(node.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onFocus={() => setActiveId(node.id)}
                  onBlur={() => setActiveId(null)}
                  onClick={() => openNode(node.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openNode(node.id);
                    }
                  }}
                >
                  {/* generous invisible hit area — 44px at typical render scale */}
                  <circle cx={point.x} cy={point.y} r={26} fill="transparent" />
                  {isActive ? (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={17}
                      fill="none"
                      stroke={tone}
                      strokeOpacity={0.42}
                      strokeWidth={1}
                      vectorEffect="non-scaling-stroke"
                    />
                  ) : null}
                  <NodeGlyph
                    kind={node.kind}
                    x={point.x}
                    y={point.y}
                    tone={tone}
                    emphasis={isActive}
                  />
                  <text
                    x={label.x}
                    y={label.y}
                    textAnchor={label.anchor}
                    className="pointer-events-none select-none"
                    fontSize={13}
                    letterSpacing="0.04em"
                    fill={isActive ? "var(--color-bone)" : "var(--color-muted-bone)"}
                    stroke="var(--color-void)"
                    strokeWidth={4}
                    paintOrder="stroke"
                    strokeLinejoin="round"
                  >
                    {lines.map((textLine, lineIndex) => (
                      <tspan key={textLine} x={label.x} dy={lineIndex === 0 ? 0 : 15}>
                        {textLine}
                      </tspan>
                    ))}
                    {evidenceCount ? (
                      <tspan dx="6" fontSize={10} fill="var(--color-gold)">
                        {`·${evidenceCount}`}
                      </tspan>
                    ) : null}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {caption ? <p className="u-body mt-5 max-w-2xl">{caption}</p> : null}

      <GraphLegend graph={graph} />
      <GraphTextAlternative graph={graph} />

      <CausalInspector
        graph={graph}
        selection={selected}
        onClose={() => setSelected(null)}
        onSelectNode={openNode}
      />
    </figure>
  );
}

function RelationMark({
  graphId,
  relation,
  points,
  dimmed,
  started,
  delay,
  animate,
  onOpen,
}: {
  graphId: string;
  relation: CausalRelation;
  points: Map<string, Point>;
  dimmed: boolean;
  started: boolean;
  delay: number;
  animate: boolean;
  onOpen: () => void;
}) {
  const sources = relation.sourceIds.map((id) => points.get(id)).filter(Boolean) as Point[];
  const targets = relation.targetIds.map((id) => points.get(id)).filter(Boolean) as Point[];
  if (sources.length === 0 || targets.length === 0) return null;

  const state = relation.state ?? "active";
  const tone = RELATION_TONE[state];
  const dash = RELATION_DASH[state];
  const order = relation.order ?? 1;
  const baseOpacity = ORDER_OPACITY[order];
  const isHyperedge = sources.length > 1 || targets.length > 1;
  const junction = hyperedgeJunction(sources, targets);
  const labelPoint = relationLabelPoint(sources, targets, junction);
  const showLabel = isHyperedge || order > 1;

  return (
    <g
      className={cn("transition-opacity duration-300", started && animate ? "u-edge-in" : "")}
      style={{
        opacity: started ? (dimmed ? 0.08 : baseOpacity) : undefined,
        ["--delay" as string]: `${delay}ms`,
        color: tone,
      }}
      role="button"
      tabIndex={0}
      aria-label={`Relation: ${relation.label ?? "causal link"}. ${state}. Order ${order}. Activate to inspect.`}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      {isHyperedge ? (
        <>
          {sources.map((source, sourceIndex) => (
            <path
              key={`${relation.id}-s-${sourceIndex}`}
              d={curve(shorten(source, junction, 16), junction, 0.05)}
              fill="none"
              stroke={tone}
              strokeWidth={1.1}
              strokeDasharray={dash}
              vectorEffect="non-scaling-stroke"
              opacity={0.75}
            />
          ))}
          {/* the junction: the visual assertion that these sources act jointly */}
          <circle
            cx={junction.x}
            cy={junction.y}
            r={4.5}
            fill="var(--color-void)"
            stroke={tone}
            strokeWidth={1.2}
            vectorEffect="non-scaling-stroke"
          />
          <circle cx={junction.x} cy={junction.y} r={1.6} fill={tone} />
          {targets.map((target, targetIndex) => (
            <path
              key={`${relation.id}-t-${targetIndex}`}
              d={curve(junction, shorten(target, junction, 18), 0.05)}
              fill="none"
              stroke={tone}
              strokeWidth={1.3}
              strokeDasharray={dash}
              markerEnd={`url(#${graphId}-arrow)`}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </>
      ) : (
        <path
          d={curve(
            shorten(sources[0]!, targets[0]!, 16),
            shorten(targets[0]!, sources[0]!, 18),
            0.08,
          )}
          fill="none"
          stroke={tone}
          strokeWidth={1.3}
          strokeDasharray={dash}
          markerEnd={`url(#${graphId}-arrow)`}
          vectorEffect="non-scaling-stroke"
        />
      )}

      {/* Only hyperedges are labelled on the canvas. A junction is a claim that
          needs naming; a plain arrow between two named nodes is already legible,
          and labelling every one of them buries the diagram in type. The mechanism
          for any relation is one click away in the inspector. */}
      {showLabel ? (
        <text
          x={labelPoint.x}
          y={labelPoint.y}
          textAnchor="middle"
          fontSize={relation.label ? 10 : 9}
          letterSpacing="0.14em"
          fill={relation.label ? tone : "var(--color-dim-bone)"}
          opacity={0.9}
          stroke="var(--color-void)"
          strokeWidth={3.5}
          paintOrder="stroke"
          strokeLinejoin="round"
          className="pointer-events-none select-none uppercase"
        >
          {relation.label ? (
            <>
              {relation.label}
              <tspan dx="6" fill="var(--color-dim-bone)">
                {ORDER_LABEL[order]}
              </tspan>
            </>
          ) : (
            ORDER_LABEL[order]
          )}
        </text>
      ) : null}
    </g>
  );
}

/**
 * Where a node's label sits.
 *
 * Authored per node rather than resolved by a collision solver: these diagrams are
 * arguments, and a label that jumps sides between renders would make one harder to
 * follow than a label that occasionally sits close to a line.
 */
function labelPlacement(
  point: Point,
  side: PositionedNode["labelSide"],
  anchor: PositionedNode["anchor"],
  lineCount: number,
): { x: number; y: number; anchor: "start" | "middle" | "end" } {
  switch (side) {
    case "above":
      return {
        x: point.x,
        y: point.y - 26 - (lineCount - 1) * 15,
        anchor: anchor ?? "middle",
      };
    case "left":
      return { x: point.x - 24, y: point.y + 4, anchor: anchor ?? "end" };
    case "right":
      return { x: point.x + 24, y: point.y + 4, anchor: anchor ?? "start" };
    default:
      return { x: point.x, y: point.y + 30, anchor: anchor ?? "middle" };
  }
}

/**
 * Relation labels sit perpendicular to the run of the edge rather than on top of
 * it, so the label and the line it describes never occupy the same pixels.
 */
function relationLabelPoint(sources: Point[], targets: Point[], junction: Point): Point {
  const from = centroid(sources);
  const to = centroid(targets);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  // Unit normal, always pointing upward on screen so labels stay above the edge.
  const nx = -dy / length;
  const ny = dx / length;
  const sign = ny > 0 ? -1 : 1;
  return { x: junction.x + nx * 23 * sign, y: junction.y + ny * 23 * sign - 4 };
}
