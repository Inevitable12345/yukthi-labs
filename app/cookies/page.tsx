import { PageShell, Section } from "@/components/layout/PageShell";
import { Prose } from "@/components/layout/Prose";
import { WebPageJsonLd } from "@/components/layout/JsonLd";
import { Hairline } from "@/components/ui/Hairline";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { ConsentReopen } from "@/components/consent/ConsentReopen";
import { CONSENT_CATEGORIES } from "@/lib/consent/consent";
import { buildMetadata } from "@/lib/metadata/build-metadata";

export const metadata = buildMetadata({
  title: "Cookies",
  description:
    "The cookie and local-storage categories used by this site, what each one does, and how to change your choice.",
  path: "/cookies",
});

const UPDATED = "2026-08-25";

export default function CookiesPage() {
  return (
    <>
      <WebPageJsonLd
        name="Cookies"
        description="Cookie policy for the Yukthi Lab website."
        path="/cookies"
      />
      <PageShell
        eyebrow="Legal · cookies"
        title="Cookies."
        lede="Four categories. One is required. The other three are off until you switch them on."
        aside={<InstrumentLabel>Last updated {UPDATED}</InstrumentLabel>}
      >
        <Section index="01 / categories" title="What each category covers">
          <ul className="u-measure">
            {CONSENT_CATEGORIES.map((category) => (
              <li key={category.id}>
                <Hairline />
                <div className="py-6">
                  <div className="flex flex-wrap items-baseline gap-4">
                    <h3 className="text-[0.9375rem] text-bone">{category.label}</h3>
                    <InstrumentLabel tone={category.required ? "gold" : "dim"}>
                      {category.required ? "Always active" : "Off by default"}
                    </InstrumentLabel>
                  </div>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-muted-bone">
                    {category.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <Hairline className="u-measure" />
        </Section>

        <Section index="02 / inventory" title="What is actually stored today">
          <Prose>
            <dl>
              <dt>yukthi.consent.v1 — local storage, necessary</dt>
              <dd>
                Your cookie choice and the time you made it. Four booleans and a timestamp. No
                identifier. Never sent to a server. Persists until you clear it.
              </dd>
              <dt>Interface preferences — local storage, functional</dt>
              <dd>
                Written only if you grant the functional category. Remembers a selected decision
                scope or an open evidence drawer so the site resumes where you left it.
              </dd>
              <dt>Analytics — network, analytics</dt>
              <dd>
                Written only if an analytics provider is configured for this deployment{" "}
                <em>and</em> you grant the analytics category. At the time of writing, no
                provider is configured, so nothing in this row is loaded.
              </dd>
              <dt>Marketing</dt>
              <dd>
                Nothing. The category exists so this page stays accurate if that ever changes,
                not because anything currently uses it.
              </dd>
            </dl>

            <h2>No first-party analytics cookie set on the server</h2>
            <p>
              This site sets no cookies from the server. Everything in the table above is
              browser storage on your own device, written by the page and readable only by it.
            </p>

            <h2>Changing your choice</h2>
            <p>
              Your decision is not final and does not expire into a re-consent prompt designed
              to wear you down. Reopen the panel below, or clear site data in your browser to
              return to the default — necessary only.
            </p>
          </Prose>
          <div className="mt-8">
            <ConsentReopen />
          </div>
        </Section>
      </PageShell>
    </>
  );
}
