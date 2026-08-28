import type { Metadata } from "next";
import Link from "next/link";
import { EvidenceRack } from "@/components/evidence/EvidenceRack";
import { JsonLd, pageSchema } from "@/components/layout/JsonLd";
import { PageShell } from "@/components/layout/PageShell";
import { ClaimBadge } from "@/components/ui/ClaimBadge";
import { Hairline } from "@/components/ui/Hairline";
import { Ladder } from "@/components/ui/Ladder";
import { PROOF_QUESTIONS, ROOM_COPY } from "@/content/thesis";
import { buildMetadata } from "@/lib/metadata/build-metadata";
import { ROOMS, coordinate } from "@/lib/story/chapters";

/* ============================================================================
   /THESIS  (§44)
   ----------------------------------------------------------------------------
   The same argument, without the exhibition. Every room in reading order, with
   its coordinate, its claim class, its ladder and its sources.

   This route exists because a serious reader should not have to scroll through
   twenty held scenes to check a claim — and because the whole argument being
   available as plain, static HTML is the strongest possible answer to §41 and
   §45 at once.
   ========================================================================== */

export const metadata: Metadata = buildMetadata({
  title: "Thesis",
  description:
    "The full argument in reading order: why the world's structure changed, why historical relationships become fragile, why causal interactions matter, and what Yukthi Lab is building.",
  path: "/thesis",
});

export default function ThesisPage() {
  return (
    <>
      <PageShell
        coordinate="Yukthi / Thesis"
        title="The world was easier to reason about when its structure was stable."
        standfirst="The exhibition makes this argument spatially. This page makes it in prose, in the same order, with every source attached."
      >
        <div className="grid gap-16 lg:grid-cols-[16rem_1fr] lg:gap-24">
          <nav aria-label="Rooms" className="lg:sticky lg:top-28 lg:self-start">
            <p className="label-dim mb-4">Contents</p>
            <ol className="space-y-1.5">
              {ROOMS.map((room) => (
                <li key={room.id}>
                  <a
                    href={`#thesis-${room.domId}`}
                    className="flex gap-3 font-mono text-[0.68rem] tracking-[0.08em] text-ash transition-colors hover:text-bone"
                  >
                    <span className="text-brass-dim">{coordinate(room.room)}</span>
                    {room.label}
                  </a>
                </li>
              ))}
            </ol>
            <Link
              href="/"
              className="mt-8 inline-block font-mono text-[0.68rem] tracking-[0.16em] uppercase text-brass underline decoration-brass-dim underline-offset-4"
            >
              Enter the exhibition
            </Link>
          </nav>

          <div className="max-w-[62rem]">
            {ROOMS.map((room) => {
              const copy = ROOM_COPY[room.id];
              return (
                <section
                  key={room.id}
                  id={`thesis-${room.domId}`}
                  aria-labelledby={`thesis-${room.domId}-heading`}
                  className="scroll-mt-28 pb-16"
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <p className="label">{copy.eyebrow}</p>
                    {copy.claimClass ? <ClaimBadge claim={copy.claimClass} /> : null}
                  </div>

                  <h2 id={`thesis-${room.domId}-heading`} className="headline mt-4">
                    {copy.headline}
                  </h2>
                  {copy.standfirst ? (
                    <p className="standfirst mt-4 max-w-[54ch]">{copy.standfirst}</p>
                  ) : null}

                  <div className="prose-argument mt-6">
                    {copy.body.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>

                  {copy.ladder ? (
                    <Ladder className="mt-8" steps={copy.ladder.steps} title={copy.ladder.title} />
                  ) : null}

                  {copy.pull ? (
                    <p className="headline mt-8 max-w-[26ch] text-white-hot">{copy.pull}</p>
                  ) : null}

                  {copy.evidenceIds ? (
                    <EvidenceRack className="mt-8" evidenceIds={copy.evidenceIds} />
                  ) : null}

                  <Hairline className="mt-12" />
                </section>
              );
            })}

            <section aria-labelledby="proof-heading" className="scroll-mt-28" id="thesis-proof">
              <p className="label">Coda / The empirical standard</p>
              <h2 id="proof-heading" className="headline mt-4">
                What Yukthi would have to prove
              </h2>
              <p className="standfirst mt-4 max-w-[54ch]">
                Published before there is anything to defend, so that it can be used against us.
              </p>
              <ol className="mt-8 space-y-4">
                {PROOF_QUESTIONS.map((question, index) => (
                  <li key={question} className="flex gap-4">
                    <span className="font-mono text-[0.72rem] text-brass-dim">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="font-display text-[1.15rem] leading-snug">{question}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </PageShell>

      <JsonLd
        schema={pageSchema(
          "Thesis",
          "The full Yukthi Lab argument in reading order, with sources.",
          "/thesis",
        )}
      />
    </>
  );
}
