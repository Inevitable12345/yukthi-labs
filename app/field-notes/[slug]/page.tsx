import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PageShell, Section } from "@/components/layout/PageShell";
import { WebPageJsonLd } from "@/components/layout/JsonLd";
import { EvidenceCard } from "@/components/evidence/EvidenceCard";
import { Hairline } from "@/components/ui/Hairline";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { ActionLink } from "@/components/ui/ActionLink";
import { buildMetadata } from "@/lib/metadata/build-metadata";
import { fieldNotes, getFieldNote } from "@/content/field-notes/registry";
import { getEvidenceMany } from "@/data/evidence";

export function generateStaticParams() {
  return fieldNotes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getFieldNote(slug);
  if (!note) return { title: "Field note not found", robots: { index: false } };

  return buildMetadata({
    title: note.title,
    description: note.summary,
    path: `/field-notes/${note.slug}`,
    type: "article",
    publishedTime: note.date,
  });
}

export default async function FieldNotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getFieldNote(slug);
  if (!note) notFound();

  const { Content } = note;
  const evidence = getEvidenceMany(note.evidenceIds);

  return (
    <>
      <WebPageJsonLd
        name={note.title}
        description={note.summary}
        path={`/field-notes/${slug}`}
      />
      <PageShell
        eyebrow={`Field note · ${note.date}`}
        title={note.title}
        lede={note.summary}
        aside={
          <div>
            <InstrumentLabel as="p">Tags</InstrumentLabel>
            <ul className="mt-3 space-y-1">
              {note.tags.map((tag) => (
                <li
                  key={tag}
                  className="font-mono text-[0.625rem] tracking-[0.14em] text-muted-bone uppercase"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <Section>
          <article>
            <Content />
          </article>

          {evidence.length ? (
            <div className="mt-20">
              <Hairline />
              <div className="pt-10">
                <InstrumentLabel as="h2" tone="gold">
                  Evidence this note rests on
                </InstrumentLabel>
                <div className="mt-8 grid gap-12 lg:grid-cols-2">
                  {evidence.map((record) => (
                    <EvidenceCard key={record.id} record={record} compact />
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-[color:var(--hairline)] pt-10">
            <ActionLink href="/field-notes">All field notes</ActionLink>
            <ActionLink href="/evidence">The evidence library</ActionLink>
          </div>
        </Section>
      </PageShell>
      <p className="u-sr-only">
        <Link href="/field-notes">Back to field notes</Link>
      </p>
    </>
  );
}
