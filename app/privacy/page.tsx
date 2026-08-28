import type { Metadata } from "next";
import { JsonLd, pageSchema } from "@/components/layout/JsonLd";
import { PageShell } from "@/components/layout/PageShell";
import { Prose } from "@/components/layout/Prose";
import { buildMetadata } from "@/lib/metadata/build-metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy",
  description: "What this site collects, what it does not, and why.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const analyticsConfigured = Boolean(process.env.NEXT_PUBLIC_ANALYTICS_SRC?.trim());

  return (
    <>
      <PageShell
        coordinate="Yukthi / Privacy"
        title="What this site collects"
        standfirst="Short, because the answer is short."
      >
        <Prose className="max-w-[62ch]">
          <p>
            This site sets no cookies. It stores nothing in your browser — no local storage, no
            session storage, no fingerprinting. Nothing you do while reading is recorded anywhere.
          </p>
          <p>
            {analyticsConfigured
              ? "This deployment loads a cookieless analytics script that records page views in aggregate. It sets no identifier and follows no visitor between sessions or between sites."
              : "This deployment loads no analytics of any kind. The relevant environment variable is unset, so the script is simply absent from the page."}
          </p>
          <p>
            If you use the contact form, what you type is sent to this site&rsquo;s server,
            validated, rate-limited by IP address for one minute, and forwarded to the address the
            operator configured. It is not stored in a database here and is not shared with any
            third party beyond that delivery. If no delivery endpoint is configured, the submission
            is acknowledged and discarded.
          </p>
          <p>
            The site loads no remote fonts, no third-party stylesheets, no embedded video and no
            advertising. Its Content-Security-Policy allows scripts only from this origin and —
            where one is configured — a single analytics origin. Everything else is refused by the
            browser rather than by our good intentions.
          </p>
          <p>
            Server logs, kept by the hosting platform rather than by this application, may record
            request metadata such as IP address and user agent in the ordinary course of operating a
            web server. Consult your host&rsquo;s retention policy for how long that persists.
          </p>
        </Prose>
      </PageShell>

      <JsonLd
        schema={pageSchema("Privacy", "What this site collects, and what it does not.", "/privacy")}
      />
    </>
  );
}
