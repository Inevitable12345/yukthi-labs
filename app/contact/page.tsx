import { PageShell } from "@/components/layout/PageShell";
import { WebPageJsonLd } from "@/components/layout/JsonLd";
import { ContactForm } from "@/components/contact/ContactForm";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { decisionScopes } from "@/data/scopes";
import { buildMetadata } from "@/lib/metadata/build-metadata";

const DESCRIPTION =
  "Talk to Yukthi. For people with a consequential decision, a 3 a.m. problem, and ideally a documented incumbent process to compare against.";

export const metadata = buildMetadata({
  title: "Contact",
  description: DESCRIPTION,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <WebPageJsonLd name="Contact" description={DESCRIPTION} path="/contact" />

      <PageShell
        eyebrow="Contact"
        title="Talk to Yukthi."
        lede={
          <>
            Most useful if you have a decision with a large number attached to it and no clear
            owner for the question &ldquo;what breaks next?&rdquo;
          </>
        }
      >
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-24">
          <ContactForm />

          <aside className="space-y-12">
            <div>
              <InstrumentLabel as="h2">Who this is for</InstrumentLabel>
              <ul className="mt-6 space-y-4">
                {decisionScopes.map((scope) => (
                  <li key={scope.id} className="border-b border-[color:var(--hairline)] pb-4">
                    <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-steel uppercase">
                      {scope.label}
                    </p>
                    <p className="u-body mt-2">{scope.question}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[color:var(--hairline)] pt-8">
              <InstrumentLabel as="h2">What happens to what you send</InstrumentLabel>
              <p className="u-body mt-4">
                It is used to reply to you, and for nothing else. It is not added to a marketing
                list, not sold, and not shared with third parties. There is no tracking on this
                site — no analytics, no advertising pixels, no third-party scripts of any kind.
              </p>
            </div>
          </aside>
        </div>
      </PageShell>
    </>
  );
}
