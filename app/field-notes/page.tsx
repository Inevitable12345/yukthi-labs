import Link from "next/link";

import { PageShell, Section } from "@/components/layout/PageShell";
import { WebPageJsonLd } from "@/components/layout/JsonLd";
import { Hairline } from "@/components/ui/Hairline";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { buildMetadata } from "@/lib/metadata/build-metadata";
import { fieldNotes } from "@/content/field-notes/registry";

export const metadata = buildMetadata({
  title: "Field Notes",
  description:
    "Observations on structures that appear to be changing — emerging signals, causal readings and regime changes, each attached to the evidence it rests on.",
  path: "/field-notes",
});

export default function FieldNotesPage() {
  return (
    <>
      <WebPageJsonLd
        name="Field Notes"
        description="Observations on structures that appear to be changing."
        path="/field-notes"
      />
      <PageShell
        eyebrow="00 / field notes"
        title="Observations, not findings."
        lede="Short readings of structures that appear to be moving. Each is dated, each cites the evidence it rests on, and none of them is a result."
        aside={
          <div>
            <InstrumentLabel as="p">Count</InstrumentLabel>
            <p className="mt-2 font-mono text-[1.25rem] text-bone tabular-nums">
              {String(fieldNotes.length).padStart(2, "0")}
            </p>
          </div>
        }
      >
        <Section>
          <ol>
            {fieldNotes.map((note, index) => (
              <li key={note.slug}>
                <Hairline />
                <Link
                  href={`/field-notes/${note.slug}`}
                  className="group grid grid-cols-1 gap-x-10 gap-y-4 py-10 sm:grid-cols-[4rem_minmax(0,1fr)_8rem]"
                >
                  <span className="font-mono text-[0.625rem] text-dim-bone tabular-nums">
                    {String(fieldNotes.length - index).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="u-display-3 block text-bone transition-colors duration-300 group-hover:text-gold">
                      {note.title}
                    </span>
                    <span className="mt-4 block max-w-2xl text-[0.9375rem] leading-relaxed text-muted-bone">
                      {note.summary}
                    </span>
                    <span className="mt-5 flex flex-wrap gap-x-4 gap-y-1">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[0.5625rem] tracking-[0.16em] text-dim-bone uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="font-mono text-[0.625rem] tracking-[0.14em] text-dim-bone uppercase tabular-nums sm:justify-self-end">
                    {note.date}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <Hairline />

          <p className="mt-10 max-w-2xl border-l border-[color:var(--hairline-strong)] pl-6 text-[0.8125rem] leading-relaxed text-dim-bone">
            Field notes are the lab&rsquo;s own readings of published evidence. They argue; they
            do not report results. Where a note makes a factual claim it carries a source
            marker, and that marker resolves to the same record the rest of the site cites.
          </p>
        </Section>
      </PageShell>
    </>
  );
}
