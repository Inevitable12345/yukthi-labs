import type { Metadata } from "next";
import { Clock3 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { faqs, pendingAnswerNotice } from "@/content/faq";
import { breadcrumbSchema, faqSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about ICRTET-2026 registration, paper submission, payment, publication and hybrid participation.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const items: AccordionItem[] = faqs.map((faq) => ({
    id: faq.id,
    title: faq.question,
    meta: faq.category,
    content:
      faq.status === "confirmed" && faq.answer ? (
        <p className="leading-relaxed text-ink-soft">{faq.answer}</p>
      ) : (
        <p className="flex items-start gap-2.5 rounded-xl border border-dashed border-line bg-surface px-4 py-3 text-[0.92rem] leading-relaxed text-ink-soft">
          <Clock3 className="mt-0.5 size-4 shrink-0 text-royal" aria-hidden="true" />
          {pendingAnswerNotice}
        </p>
      ),
  }));

  // Only approved answers are exposed to search engines.
  const answered = faqs
    .filter((faq) => faq.status === "confirmed" && faq.answer)
    .map((faq) => ({ question: faq.question, answer: faq.answer as string }));

  return (
    <>
      <JsonLd data={faqSchema(answered)} />
      <JsonLd data={breadcrumbSchema([{ name: "FAQ", path: "/faq" }])} />

      <PageHeader
        eyebrow="Support"
        title="Frequently asked questions"
        lead="Answers confirmed by the organising committee. Questions still being finalised are marked as such rather than answered speculatively."
        breadcrumbs={[{ name: "FAQ", path: "/faq" }]}
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <Reveal className="mx-auto max-w-3xl">
            <Accordion items={items} defaultOpenId={faqs[0]?.id} />
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
            <div className="rounded-2xl border border-line bg-surface-blue p-6 text-center">
              <h2 className="text-lg">Still have a question?</h2>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ink-soft">
                The organising secretaries answer registration, submission,
                payment and publication queries directly.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button href="/contact" withArrow>
                  Contact the organisers
                </Button>
                <Button href="/registration" variant="outline">
                  Registration details
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
