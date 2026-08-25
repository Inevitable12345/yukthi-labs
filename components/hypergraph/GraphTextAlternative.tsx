import type { CausalGraph } from "@/data/schema";
import { KIND_LABEL } from "@/lib/graph/tokens";

/**
 * The prose reading of a diagram.
 *
 * Always in the DOM and always reachable by keyboard — a diagram whose meaning
 * exists only in its geometry is a diagram that excludes readers. This also makes
 * every causal argument on the site legible with images or scripts unavailable.
 */
export function GraphTextAlternative({ graph }: { graph: CausalGraph }) {
  return (
    <details className="group mt-5 border-t border-[color:var(--hairline)]">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 py-3 font-mono text-[0.625rem] tracking-[0.18em] text-dim-bone uppercase transition-colors hover:text-gold">
        <span
          aria-hidden="true"
          className="text-gold transition-transform duration-300 group-open:rotate-90"
        >
          →
        </span>
        Read this diagram as text
      </summary>
      <div className="pb-8">
        <p className="u-body max-w-2xl">{graph.textAlternative}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="u-instrument">Nodes</h3>
            <ul className="mt-3 space-y-2.5">
              {graph.nodes.map((node) => (
                <li key={node.id} className="text-[0.8125rem] leading-relaxed text-muted-bone">
                  <span className="text-bone">{node.label}</span>
                  <span className="text-dim-bone"> — {KIND_LABEL[node.kind]}</span>
                  {node.state ? <span className="text-steel"> · {node.state}</span> : null}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="u-instrument">Relations</h3>
            <ol className="mt-3 space-y-2.5">
              {graph.relations.map((relation) => (
                <li
                  key={relation.id}
                  className="text-[0.8125rem] leading-relaxed text-muted-bone"
                >
                  <span className="text-bone">
                    {relation.sourceIds.join(" + ")} → {relation.targetIds.join(" + ")}
                  </span>
                  {relation.mechanism ? (
                    <span className="block text-dim-bone">{relation.mechanism}</span>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </details>
  );
}
