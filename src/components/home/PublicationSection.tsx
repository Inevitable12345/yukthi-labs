import { BookMarked, Info, ScrollText, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { publication } from "@/content/publication";

const icons = [ShieldCheck, Sparkles, BookMarked, ScrollText];

export function PublicationSection({ heading = true }: { heading?: boolean }) {
  return (
    <section
      id="publication"
      className="relative bg-white py-20 lg:py-28"
      aria-labelledby="publication-heading"
    >
      <div className="container-page">
        {heading && (
          <SectionHeading
            eyebrow="Publication"
            title="Peer review and proposed publication"
            align="center"
          />
        )}

        {/* The approved statement, given the weight of a pull quote. */}
        <Reveal delay={0.05} className="mx-auto mt-10 max-w-3xl">
          <blockquote className="relative rounded-2xl border border-line bg-surface-blue px-6 py-8 text-center sm:px-10">
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-0 h-1 w-24 -translate-x-1/2 rounded-full bg-gradient-to-r from-royal to-violet"
            />
            <p className="font-serif text-[1.15rem] leading-relaxed text-deep sm:text-[1.3rem]">
              {publication.statement}
            </p>
          </blockquote>
        </Reveal>

        <RevealGroup step={0.08} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {publication.highlights.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <RevealItem key={item.title} className="h-full">
                <article className="card-surface h-full p-5">
                  <span className="grid size-11 place-items-center rounded-xl bg-surface-blue text-royal">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-[1.02rem]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {item.body}
                  </p>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 flex max-w-2xl items-start gap-2.5 rounded-xl border border-line bg-surface px-4 py-3.5 text-sm text-ink-soft">
            <Info className="mt-0.5 size-4.5 shrink-0 text-royal" aria-hidden="true" />
            {publication.disclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
