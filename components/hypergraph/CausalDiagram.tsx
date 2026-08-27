"use client";

import { useId, useMemo, useState } from "react";

import type { CausalGraph, CausalRelation, PositionedNode } from "@/data/schema";
import { EvidenceInspector } from "@/components/evidence/EvidenceInspector";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   CAUSAL DIAGRAM
   ----------------------------------------------------------------------------
   Renders an authored causal graph as SVG.

   Hyperedges are drawn through an explicit junction rather than as a bundle of
   arrows, because the conjunction is the content: it takes *all* of these
   together to produce *those*. A reader who sees three separate arrows learns
   something false about the mechanism.

   Accessibility (§33):
     · the figure carries the graph's authored text alternative, so the argument
       survives without the picture;
     · nodes are focusable buttons that reveal their mechanism and evidence;
     · state is carried by shape and label as well as colour;
     · the diagram scrolls inside its own frame — the page body never does.
   ========================================================================== */

const VIEWBOX = { width: 1000, height: 620 };

export function CausalDiagram({
  graph,
  height = 480,
  minWidth = 720,
  className,
}: {
  graph: CausalGraph;
  height?: number;
  minWidth?: number;
  className?: string;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const [selected, setSelected] = useState<string | null>(null);

  const nodesById = useMemo(
    () => new Map(graph.nodes.map((node) => [node.id, node])),
    [graph.nodes],
  );

  const toPoint = (node: PositionedNode) => ({
    x: node.position.x * VIEWBOX.width,
    y: node.position.y * VIEWBOX.height,
  });

  const centroid = (ids: string[]) => {
    const points = ids
      .map((id) => nodesById.get(id))
      .filter((node): node is PositionedNode => !!node)
      .map(toPoint);
    if (points.length === 0) return { x: 0, y: 0 };
    return {
      x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
      y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
    };
  };

  const selectedNode = selected ? nodesById.get(selected) : undefined;
  const selectedRelations = selected
    ? graph.relations.filter(
        (relation) =>
          relation.sourceIds.includes(selected) || relation.targetIds.includes(selected),
      )
    : [];

  return (
    <figure className={cn("m-0 min-w-0", className)}>
      {/* Focusable: a region that scrolls must be reachable by keyboard, or a
          keyboard-only reader cannot pan a diagram wider than their screen. */}
      <div className="u-figure-scroll" tabIndex={0} role="region" aria-label={graph.title}>
        <svg
          viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
          // `group`, not `img`: an img is an atomic leaf that assistive
          // technology does not descend into, which would make every node
          // inside unreachable. The full prose description is in the caption
          // below regardless, so nothing depends on reading the graphic.
          role="group"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          style={{ height, minWidth, width: "100%" }}
          className="block"
        >
          <title id={titleId}>{graph.title}</title>
          <desc id={descriptionId}>{graph.textAlternative}</desc>

          <defs>
            <marker
              id={`arrow-${titleId}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-steel-dim)" />
            </marker>
          </defs>

          <g>
            {graph.relations.map((relation) => (
              <Relation
                key={relation.id}
                relation={relation}
                nodesById={nodesById}
                toPoint={toPoint}
                centroid={centroid}
                markerId={`arrow-${titleId}`}
                dimmed={selected !== null && !isTouching(relation, selected)}
              />
            ))}
          </g>

          <g>
            {graph.nodes.map((node) => (
              <Node
                key={node.id}
                node={node}
                point={toPoint(node)}
                selected={selected === node.id}
                dimmed={
                  selected !== null &&
                  selected !== node.id &&
                  !isNeighbour(graph, selected, node.id)
                }
                onSelect={() => setSelected(selected === node.id ? null : node.id)}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* The inspector. Reads as a caption when nothing is selected, so the
          figure is never a dead end. */}
      <figcaption className="mt-6 border-t border-[color:var(--hairline)] pt-6">
        {selectedNode ? (
          <div>
            <InstrumentLabel tone="gold">{selectedNode.kind}</InstrumentLabel>
            <h3 className="mt-3 text-[1.0625rem] text-bone">{selectedNode.label}</h3>
            {selectedNode.description ? (
              <p className="u-body mt-3 u-measure">{selectedNode.description}</p>
            ) : null}
            {selectedNode.state ? (
              <p className="u-instrument mt-3">State — {selectedNode.state}</p>
            ) : null}

            {selectedRelations.length > 0 ? (
              <dl className="mt-6 space-y-4">
                {selectedRelations.map((relation) => (
                  <div key={relation.id}>
                    <dt className="u-instrument text-steel">{relation.label ?? "Mechanism"}</dt>
                    <dd className="u-body mt-1 u-measure">{relation.mechanism}</dd>
                    {relation.alternatives?.length ? (
                      <dd className="u-body mt-2 u-measure text-dim-bone">
                        Also consistent with: {relation.alternatives.join("; ")}.
                      </dd>
                    ) : null}
                  </div>
                ))}
              </dl>
            ) : null}

            {selectedNode.evidenceIds?.length ? (
              <EvidenceInspector ids={selectedNode.evidenceIds} className="mt-6" />
            ) : null}

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="u-instrument mt-6 border-b border-[color:var(--hairline-strong)] pb-1 transition-colors hover:border-bone hover:text-bone"
            >
              Clear selection
            </button>
          </div>
        ) : (
          <div>
            <p className="u-body u-measure">{graph.textAlternative}</p>
            <p className="u-instrument mt-4">
              Select any node to read its mechanism and sources.
            </p>
            {graph.evidenceIds?.length ? (
              <EvidenceInspector ids={graph.evidenceIds} className="mt-5" />
            ) : null}
          </div>
        )}
      </figcaption>
    </figure>
  );
}

function isTouching(relation: CausalRelation, nodeId: string): boolean {
  return relation.sourceIds.includes(nodeId) || relation.targetIds.includes(nodeId);
}

function isNeighbour(graph: CausalGraph, selected: string, candidate: string): boolean {
  return graph.relations.some(
    (relation) =>
      isTouching(relation, selected) &&
      (relation.sourceIds.includes(candidate) || relation.targetIds.includes(candidate)),
  );
}

function Relation({
  relation,
  nodesById,
  toPoint,
  centroid,
  markerId,
  dimmed,
}: {
  relation: CausalRelation;
  nodesById: Map<string, PositionedNode>;
  toPoint: (node: PositionedNode) => { x: number; y: number };
  centroid: (ids: string[]) => { x: number; y: number };
  markerId: string;
  dimmed: boolean;
}) {
  const isHyperedge = relation.sourceIds.length > 1 || relation.targetIds.length > 1;

  const stroke =
    relation.state === "broken"
      ? "var(--color-rupture)"
      : relation.state === "latent"
        ? "var(--color-steel-dim)"
        : isHyperedge
          ? "var(--color-gold-dim)"
          : "var(--color-steel-dim)";

  // Latent relations are dashed: present in the structure, not currently
  // transmitting. Broken relations are dashed and red.
  const dash =
    relation.state === "latent" ? "3 6" : relation.state === "broken" ? "7 5" : undefined;

  const opacity = dimmed ? 0.12 : 1;

  if (!isHyperedge) {
    const from = nodesById.get(relation.sourceIds[0]!);
    const to = nodesById.get(relation.targetIds[0]!);
    if (!from || !to) return null;

    const a = toPoint(from);
    const b = toPoint(to);

    return (
      <line
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={stroke}
        strokeWidth={1.4}
        strokeDasharray={dash}
        markerEnd={`url(#${markerId})`}
        opacity={opacity}
      />
    );
  }

  const sourceCentre = centroid(relation.sourceIds);
  const targetCentre = centroid(relation.targetIds);
  const junction = {
    x: sourceCentre.x + (targetCentre.x - sourceCentre.x) * 0.5,
    y: sourceCentre.y + (targetCentre.y - sourceCentre.y) * 0.5,
  };

  return (
    <g opacity={opacity}>
      {relation.sourceIds.map((id) => {
        const node = nodesById.get(id);
        if (!node) return null;
        const point = toPoint(node);
        return (
          <line
            key={`s-${id}`}
            x1={point.x}
            y1={point.y}
            x2={junction.x}
            y2={junction.y}
            stroke={stroke}
            strokeWidth={1.2}
            strokeDasharray={dash}
          />
        );
      })}

      {relation.targetIds.map((id) => {
        const node = nodesById.get(id);
        if (!node) return null;
        const point = toPoint(node);
        return (
          <line
            key={`t-${id}`}
            x1={junction.x}
            y1={junction.y}
            x2={point.x}
            y2={point.y}
            stroke={stroke}
            strokeWidth={1.2}
            strokeDasharray={dash}
            markerEnd={`url(#${markerId})`}
          />
        );
      })}

      {/* The junction itself — the visible statement that this is one relation
          with several participants, not several relations. */}
      <circle cx={junction.x} cy={junction.y} r={4} fill="var(--color-gold)" opacity={0.85} />
      <circle
        cx={junction.x}
        cy={junction.y}
        r={9}
        fill="none"
        stroke="var(--color-gold-dim)"
        strokeWidth={0.8}
      />
    </g>
  );
}

const KIND_SHAPE: Record<string, "circle" | "square" | "diamond"> = {
  policy: "square",
  event: "diamond",
  risk: "diamond",
  outcome: "square",
};

function Node({
  node,
  point,
  selected,
  dimmed,
  onSelect,
}: {
  node: PositionedNode;
  point: { x: number; y: number };
  selected: boolean;
  dimmed: boolean;
  onSelect: () => void;
}) {
  const shape = KIND_SHAPE[node.kind] ?? "circle";
  const radius = selected ? 8 : 6;

  const fill = selected
    ? "var(--color-gold)"
    : node.kind === "risk" || node.kind === "event"
      ? "var(--color-rupture)"
      : node.kind === "policy"
        ? "var(--color-steel)"
        : "var(--color-bone)";

  const side = node.labelSide ?? "below";
  const labelOffset = side === "above" ? -18 : side === "below" ? 24 : 0;
  const labelX = side === "left" ? point.x - 14 : side === "right" ? point.x + 14 : point.x;
  const anchor =
    node.anchor ?? (side === "left" ? "end" : side === "right" ? "start" : "middle");

  return (
    <g
      opacity={dimmed ? 0.2 : 1}
      className="cursor-pointer"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${node.label}. ${node.kind}.${node.state ? ` State: ${node.state}.` : ""}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      {/* Generous invisible hit area — the visible glyph is far below the 24px
          minimum target size. */}
      <circle cx={point.x} cy={point.y} r={22} fill="transparent" />

      {shape === "circle" ? (
        <circle cx={point.x} cy={point.y} r={radius} fill={fill} />
      ) : shape === "square" ? (
        <rect
          x={point.x - radius}
          y={point.y - radius}
          width={radius * 2}
          height={radius * 2}
          fill={fill}
        />
      ) : (
        <rect
          x={point.x - radius}
          y={point.y - radius}
          width={radius * 2}
          height={radius * 2}
          fill={fill}
          transform={`rotate(45 ${point.x} ${point.y})`}
        />
      )}

      {selected ? (
        <circle
          cx={point.x}
          cy={point.y}
          r={radius + 7}
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth={1}
        />
      ) : null}

      <text
        x={labelX}
        y={point.y + labelOffset}
        textAnchor={anchor}
        dominantBaseline={side === "left" || side === "right" ? "middle" : "auto"}
        fontSize={13}
        letterSpacing="0.06em"
        fill={selected ? "var(--color-bone)" : "var(--color-muted-bone)"}
        style={{ textTransform: "uppercase" }}
      >
        {node.label}
      </text>
    </g>
  );
}
