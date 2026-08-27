import { PageShell } from "@/components/layout/PageShell";
import { Prose } from "@/components/layout/Prose";
import { buildMetadata } from "@/lib/metadata/build-metadata";

export const metadata = buildMetadata({
  title: "Terms",
  description: "Terms of use, and what the content on this site is and is not.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Terms"
      title="Terms of use."
      lede={
        <>
          Mostly a statement about what the content here is, and what it must not be taken for.
        </>
      }
    >
      <Prose>
        <h2>The content is not advice</h2>
        <p>
          Nothing on this site is investment, financial, legal, procurement or operational
          advice. The scenarios are explicitly labelled illustrative: they demonstrate the shape
          of a causal analysis, and they are not findings about any organisation, market or
          asset.
        </p>

        <h2>No model output</h2>
        <p>
          No content on this site is the output of a running Yukthi system. Every scenario,
          trace and diagram is authored to explain a mechanism. Where something describes what
          Yukthi intends to build rather than what exists, it is marked{" "}
          <strong>Product ambition</strong>.
        </p>

        <h2>Evidence and third-party sources</h2>
        <p>
          Evidence records quote and characterise documents published by other organisations.
          Those documents remain the property of their publishers, are linked rather than
          reproduced, and are quoted with their own stated limits attached. Any characterisation
          is Yukthi&rsquo;s; any error in one is Yukthi&rsquo;s too, and corrections are welcome
          via the contact page.
        </p>
        <p>
          Records marked <strong>unverified</strong> have not been checked against the primary
          document and should not be relied on until they have been.
        </p>

        <h2>Accuracy and change</h2>
        <p>
          The evidence base reflects sources as accessed on the dates recorded against each
          record. Sources are revised, and figures quoted here may be superseded. Each record
          carries the date it was last checked so a reader can judge staleness rather than
          assume currency.
        </p>

        <h2>Liability</h2>
        <p>
          This site is provided as is. Yukthi Lab accepts no liability for decisions taken on
          the basis of the material here, which is published to explain an argument rather than
          to support a decision.
        </p>
      </Prose>
    </PageShell>
  );
}
