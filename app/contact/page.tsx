import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { JsonLd, pageSchema } from "@/components/layout/JsonLd";
import { PageShell } from "@/components/layout/PageShell";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Hairline } from "@/components/ui/Hairline";
import { buildMetadata } from "@/lib/metadata/build-metadata";
import { SITE } from "@/lib/metadata/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Institutional contact for Yukthi Lab — research collaboration, investment, partnership and press.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageShell
        coordinate="Yukthi / Contact"
        title="Write to us"
        standfirst="Research collaboration, investment, partnership or press. A person reads every message."
      >
        <div className="grid max-w-[68rem] gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <ContactForm />
          </div>

          <aside className="space-y-8">
            <div>
              <p className="label-dim">What is useful to include</p>
              <ul className="mt-3 space-y-2 text-[0.9rem] leading-relaxed text-bone/85">
                <li>— The decision you are accountable for, in a sentence.</li>
                <li>— The dependency you cannot currently see through.</li>
                <li>— What you already monitor, and where it stops being enough.</li>
              </ul>
            </div>

            <Hairline />

            <div>
              <p className="label-dim">Direct</p>
              {SITE.contactEmail ? (
                <p className="mt-3">
                  <ExternalLink href={`mailto:${SITE.contactEmail}`}>
                    {SITE.contactEmail}
                  </ExternalLink>
                </p>
              ) : (
                <p className="mt-3 max-w-[42ch] text-[0.88rem] leading-relaxed text-ash">
                  No public address is configured for this deployment. Set{" "}
                  <code className="font-mono text-[0.8rem] text-brass">
                    NEXT_PUBLIC_CONTACT_EMAIL
                  </code>{" "}
                  to publish one — the form above works regardless.
                </p>
              )}
            </div>

            <Hairline />

            <div>
              <p className="label-dim">What happens to what you send</p>
              <p className="mt-3 max-w-[46ch] text-[0.88rem] leading-relaxed text-ash">
                Submissions are validated and rate-limited on the server, then forwarded to the
                address the operator configured. Nothing is stored in a browser, no tracking cookie
                is set, and no third party receives the message. The privacy note has the detail.
              </p>
            </div>
          </aside>
        </div>
      </PageShell>

      <JsonLd schema={pageSchema("Contact", "Institutional contact for Yukthi Lab.", "/contact")} />
    </>
  );
}
