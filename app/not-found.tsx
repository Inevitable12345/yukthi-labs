import { PageShell } from "@/components/layout/PageShell";
import { ActionLink } from "@/components/ui/ActionLink";

export default function NotFound() {
  return (
    <PageShell
      eyebrow="404"
      title="No path to this node."
      lede={<>The page you asked for is not in the graph. These are.</>}
    >
      <nav aria-label="Suggested pages" className="flex flex-col gap-6">
        <ActionLink href="/" tone="gold">
          The argument
        </ActionLink>
        <ActionLink href="/thesis">Read the thesis</ActionLink>
        <ActionLink href="/technology">Explore the technical bet</ActionLink>
        <ActionLink href="/evidence">See the evidence</ActionLink>
      </nav>
    </PageShell>
  );
}
