import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { NAVIGATION } from "@/lib/metadata/site";

export default function NotFound() {
  return (
    <PageShell
      coordinate="Yukthi / Observatory / —"
      title="No room at this coordinate"
      standfirst="The exhibition has twenty rooms and five pages. This is not one of them."
    >
      <nav aria-label="Elsewhere" className="flex flex-wrap gap-x-8 gap-y-3">
        <Link
          href="/"
          className="font-mono text-[0.72rem] tracking-[0.16em] uppercase text-brass underline decoration-brass-dim underline-offset-8"
        >
          The exhibition
        </Link>
        {NAVIGATION.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-mono text-[0.72rem] tracking-[0.16em] uppercase text-ash underline decoration-graphite underline-offset-8 transition-colors hover:text-bone"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </PageShell>
  );
}
