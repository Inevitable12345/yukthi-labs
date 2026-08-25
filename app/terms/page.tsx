import { PageShell, Section } from "@/components/layout/PageShell";
import { Prose } from "@/components/layout/Prose";
import { WebPageJsonLd } from "@/components/layout/JsonLd";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { buildMetadata } from "@/lib/metadata/build-metadata";

export const metadata = buildMetadata({
  title: "Terms",
  description: "Terms of use for the Yukthi Lab website.",
  path: "/terms",
});

const UPDATED = "2026-08-25";

export default function TermsPage() {
  return (
    <>
      <WebPageJsonLd
        name="Terms"
        description="Terms of use for the Yukthi Lab website."
        path="/terms"
      />
      <PageShell
        eyebrow="Legal · terms"
        title="Terms of use."
        lede="What this site is, what it is not, and the basis on which it is published."
        aside={<InstrumentLabel>Last updated {UPDATED}</InstrumentLabel>}
      >
        <Section>
          <Prose>
            <h2>Nature of this site</h2>
            <p>
              This website publishes research positions, an evidence record and a description of
              a system under development. It is provided for information. It is not an offer, a
              solicitation, or a contract, and access to it creates no relationship between you
              and Yukthi Lab.
            </p>

            <h2>Not advice</h2>
            <p>
              Nothing here is investment, legal, insurance, procurement, engineering or policy
              advice, and nothing here should be relied upon in making a consequential decision.
              The causal structures shown are analytical models of how systems may propagate
              effects; they are not predictions, and they are not a substitute for your own
              judgement or your own professional advisers.
            </p>

            <h2>Illustrative material</h2>
            <p>
              Diagrams marked <strong>illustrative</strong> are drawn to explain a mechanism.
              They are not output from a fitted model, they do not carry calibrated
              probabilities, and they must not be read as forecasts. Every such diagram is
              labelled where it appears.
            </p>

            <h2>Evidence and sources</h2>
            <p>
              Each factual claim on this site carries a source record with a verification
              status. Records marked <strong>needs verification</strong> have not yet been
              checked against the primary document and should be treated as provisional. Where a
              claim quotes or paraphrases a third party, the underlying work belongs to its
              author and is referenced for study and comment.
            </p>

            <h2>Intellectual property</h2>
            <p>
              The text, diagrams, visual system and source code of this site are the property of
              Yukthi Lab except where a third party is credited. You may quote from this site
              with attribution and a link. You may not present it as your own, or reproduce it
              wholesale as a competing publication.
            </p>

            <h2>External links</h2>
            <p>
              Links to external sources are provided so claims can be checked at their origin.
              Yukthi Lab does not control those sites and is not responsible for their content
              or availability. Outbound links open in a new context and carry{" "}
              <code>rel=&quot;noopener noreferrer&quot;</code>.
            </p>

            <h2>Availability</h2>
            <p>
              The site is published as-is and as-available. It may change, move or be taken
              offline without notice. To the fullest extent permitted by law, no warranty is
              given and no liability is accepted for loss arising from use of, or reliance on,
              this site.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms can be raised through the collaboration channel on the{" "}
              <a href="/about">About</a> page.
            </p>
          </Prose>
        </Section>
      </PageShell>
    </>
  );
}
