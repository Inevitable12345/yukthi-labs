"use client";

/* ============================================================================
   LINE → NETWORK → HYPERGRAPH  (§10)
   ----------------------------------------------------------------------------
   Three representations of the same six facts, morphed by one scalar.

   Stage 1  A → B → C.                     Every effect has exactly one cause.
   Stage 2  Shared causes and feedback.    Effects have several causes, severally.
   Stage 3  A junction.                    Causes act jointly, or not at all.

   The third stage is the one that has to land, so it is the only one that adds
   a mark the earlier stages do not have: the junction where two lines meet
   before a single arrow leaves. Everything else is position.
   ========================================================================== */

const NODES = [
  { id: "a", label: "A", line: [-96, 0], web: [-96, -34], hyper: [-96, -40] },
  { id: "b", label: "B", line: [0, 0], web: [-8, 26], hyper: [-14, 34] },
  { id: "c", label: "C", line: [96, 0], web: [92, -30], hyper: [96, 0] },
  { id: "d", label: "D", line: [0, 0], web: [12, -46], hyper: [-96, 40] },
  { id: "e", label: "E", line: [96, 0], web: [86, 34], hyper: [96, 44] },
];

type Stage = "line" | "web" | "hyper";

function positionAt(node: (typeof NODES)[number], t: number): [number, number] {
  const from: Stage = t < 0.5 ? "line" : "web";
  const to: Stage = t < 0.5 ? "web" : "hyper";
  const local = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5;
  const eased = local * local * (3 - 2 * local);
  const a = node[from] as number[];
  const b = node[to] as number[];
  return [a[0]! + (b[0]! - a[0]!) * eased, a[1]! + (b[1]! - a[1]!) * eased];
}

export function LineToHypergraph({ progress }: { progress: number }) {
  const t = Math.min(1, Math.max(0, progress));
  const points = new Map(NODES.map((node) => [node.id, positionAt(node, t)]));

  const get = (id: string) => points.get(id) ?? [0, 0];
  const [ax, ay] = get("a");
  const [bx, by] = get("b");
  const [cx, cy] = get("c");
  const [dx, dy] = get("d");
  const [ex, ey] = get("e");

  const webStrength = Math.min(1, t / 0.5);
  const hyperStrength = Math.max(0, (t - 0.55) / 0.45);
  const junction = [(ax + dx) / 2 + 34, (ay + dy) / 2];

  return (
    <svg viewBox="-140 -80 280 160" className="h-auto w-full" aria-hidden="true">
      <defs>
        <marker
          id="lth-arrow"
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

      <g stroke="currentColor" fill="none" style={{ color: "var(--color-signal)" }}>
        {/* The original chain, thinning as the other structures take over. */}
        <line
          x1={ax!}
          y1={ay!}
          x2={bx!}
          y2={by!}
          strokeWidth={1.2}
          opacity={1 - hyperStrength * 0.8}
          markerEnd="url(#lth-arrow)"
        />
        <line
          x1={bx!}
          y1={by!}
          x2={cx!}
          y2={cy!}
          strokeWidth={1.2}
          opacity={1 - hyperStrength * 0.8}
          markerEnd="url(#lth-arrow)"
        />

        {/* Shared cause and feedback appear at stage two. */}
        <line
          x1={ax!}
          y1={ay!}
          x2={dx!}
          y2={dy!}
          strokeWidth={1}
          opacity={webStrength * (1 - hyperStrength)}
          markerEnd="url(#lth-arrow)"
        />
        <line
          x1={dx!}
          y1={dy!}
          x2={ex!}
          y2={ey!}
          strokeWidth={1}
          opacity={webStrength * (1 - hyperStrength * 0.6)}
          markerEnd="url(#lth-arrow)"
        />
        <path
          d={`M ${cx} ${cy} C ${cx! + 40} ${cy! - 40}, ${bx! + 20} ${by! - 60}, ${bx} ${by}`}
          strokeWidth={1}
          opacity={webStrength * (1 - hyperStrength * 0.5)}
          markerEnd="url(#lth-arrow)"
        />
      </g>

      {/* Stage three: conjunction. */}
      <g
        stroke="var(--color-brass)"
        fill="none"
        opacity={hyperStrength}
        style={{ color: "var(--color-brass)" }}
      >
        <line x1={ax!} y1={ay!} x2={junction[0]!} y2={junction[1]!} strokeWidth={1.4} />
        <line x1={dx!} y1={dy!} x2={junction[0]!} y2={junction[1]!} strokeWidth={1.4} />
        <line
          x1={junction[0]!}
          y1={junction[1]!}
          x2={cx!}
          y2={cy!}
          strokeWidth={1.4}
          markerEnd="url(#lth-arrow)"
        />
        <line
          x1={junction[0]!}
          y1={junction[1]!}
          x2={ex!}
          y2={ey!}
          strokeWidth={1.4}
          markerEnd="url(#lth-arrow)"
        />
        <circle
          cx={junction[0]!}
          cy={junction[1]!}
          r={7}
          fill="var(--color-void)"
          strokeWidth={1.4}
        />
        <text
          x={junction[0]!}
          y={junction[1]! + 3.4}
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-brass)"
          stroke="none"
          fontFamily="var(--font-mono)"
        >
          &amp;
        </text>
      </g>

      <g>
        {NODES.map((node) => {
          const [x, y] = positionAt(node, t);
          const visible = node.id === "d" || node.id === "e" ? webStrength : 1;
          return (
            <g key={node.id} opacity={visible}>
              <circle
                cx={x!}
                cy={y!}
                r={11}
                fill="var(--color-void)"
                stroke="var(--color-graphite)"
              />
              <text
                x={x!}
                y={y! + 3.6}
                textAnchor="middle"
                fontSize="10"
                fontFamily="var(--font-mono)"
                fill="var(--color-bone)"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function stageLabel(progress: number): string {
  if (progress < 0.34) return "LINE — every effect has exactly one cause";
  if (progress < 0.62) return "NETWORK — effects have several causes, each sufficient";
  return "HYPERGRAPH — causes act jointly; the junction fires only when both arrive";
}
