import { PageShell, Section } from "@/components/layout/PageShell";
import { Prose } from "@/components/layout/Prose";
import { WebPageJsonLd } from "@/components/layout/JsonLd";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { buildMetadata } from "@/lib/metadata/build-metadata";

export const metadata = buildMetadata({
  title: "Privacy",
  description:
    "What this site collects, what it does not, and how any information you choose to send is handled.",
  path: "/privacy",
});

const UPDATED = "2026-08-25";

export default function PrivacyPage() {
  return (
    <>
      <WebPageJsonLd
        name="Privacy"
        description="Privacy statement for the Yukthi Lab website."
        path="/privacy"
      />
      <PageShell
        eyebrow="Legal · privacy"
        title="Privacy."
        lede="This site is a publication, not a product. It is built to be read without being measured."
        aside={<InstrumentLabel>Last updated {UPDATED}</InstrumentLabel>}
      >
        <Section>
          <Prose>
            <h2>What this site is</h2>
            <p>
              This website publishes Yukthi Lab&rsquo;s thesis, its evidence record and its
              technical architecture. There are no accounts, no logins, no paywalls and no
              personalisation. Nothing on the site requires you to identify yourself.
            </p>

            <h2>What is stored on your device</h2>
            <p>
              One entry, under the key <code>yukthi.consent.v1</code> in your browser&rsquo;s
              local storage, recording the cookie choice you made so the notice does not
              reappear on every visit. It contains four booleans and a timestamp. It contains no
              identifier and is never transmitted to a server.
            </p>
            <p>
              If you grant the <strong>functional</strong> category, the site may additionally
              remember interface preferences — a chosen decision scope, an expanded evidence
              drawer — on your device only.
            </p>
            <p>
              You can clear both at any time by choosing <strong>Cookie preferences</strong> in
              the footer, or by clearing site data in your browser.
            </p>

            <h2>Analytics</h2>
            <p>
              No analytics provider is loaded unless one has been configured for the deployment
              <em>and</em> you have granted the analytics category. Until both are true, no
              analytics script is requested and no analytics request leaves your browser.
            </p>
            <p>
              When analytics is active, the events that may be recorded are a fixed, published
              list: which thesis sections were read, which evidence records and causal nodes
              were opened, which decision scope was selected, and whether an outbound source
              link was followed. No free text, no reading history beyond those events, and no
              attempt to identify you as an individual.
            </p>

            <h2>Server logs</h2>
            <p>
              Like any website, this one is served by a hosting provider that keeps short-lived
              operational logs — typically IP address, timestamp, requested path and user agent
              — for security and reliability. These are the host&rsquo;s standard logs; Yukthi
              Lab does not build profiles from them and does not join them to anything else.
            </p>

            <h2>If you contact us</h2>
            <p>
              The collaboration form asks for a name, a work email, an organisation, a role and
              a short description of the decision or risk you are trying to understand. That is
              all it asks for, and all of it is used solely to reply to you.
            </p>
            <p>
              Submissions are rate limited by IP address to resist automated abuse. The
              rate-limit record holds a counter and a timestamp, is held in memory, and expires
              within the hour.
            </p>
            <p>
              Do not send confidential, regulated or personally sensitive information through
              this form. It is a first contact channel, not a secure one.
            </p>

            <h2>Third parties</h2>
            <p>
              Web fonts are served from this site&rsquo;s own origin — no request is made to a
              font CDN while you read. No advertising networks, no social widgets, no session
              recording, no cross-site trackers, and no chat widgets are used.
            </p>

            <h2>Your rights</h2>
            <p>
              Where the GDPR, UK GDPR, or a comparable regime applies, you have the right to
              access, correct, export, restrict or erase personal data held about you, and to
              withdraw consent at any time. Because this site holds almost nothing, in most
              cases the only data that exists is a message you chose to send.
            </p>
            <p>
              To exercise any of these rights, or to ask that a message you sent be deleted, use
              the collaboration channel on the <a href="/about">About</a> page.
            </p>

            <h2>Changes</h2>
            <p>
              Material changes to this statement will be reflected in the date at the top of
              this page. This statement describes the site as deployed; it does not describe any
              product Yukthi Lab may later offer under a separate agreement.
            </p>
          </Prose>
        </Section>
      </PageShell>
    </>
  );
}
