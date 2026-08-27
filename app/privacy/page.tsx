import { PageShell } from "@/components/layout/PageShell";
import { Prose } from "@/components/layout/Prose";
import { buildMetadata } from "@/lib/metadata/build-metadata";

export const metadata = buildMetadata({
  title: "Privacy",
  description: "What this site collects, which is close to nothing.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Privacy"
      title="What this site collects."
      lede={<>Short, because there is very little to describe.</>}
    >
      <Prose>
        <h2>Analytics</h2>
        <p>
          There are none. This site runs no analytics, no advertising pixels, no session
          recording, no A/B testing and no third-party scripts of any kind. Its Content Security
          Policy restricts network connections to its own origin, which means a tracker could
          not be added without an explicit change to that policy.
        </p>

        <h2>Cookies</h2>
        <p>
          This site sets no cookies. It uses no local storage. There is no consent banner
          because there is nothing to consent to — a banner offering a choice that does not
          exist would be theatre.
        </p>

        <h2>The contact form</h2>
        <p>
          If you send a message, the name, email address, optional organisation and message you
          submit are used to reply to you. They are not added to a mailing list, sold, or shared
          with third parties.
        </p>
        <p>
          The endpoint applies rate limiting by IP address to prevent abuse. That check happens
          in memory at request time and is not written to durable storage.
        </p>

        <h2>Server logs</h2>
        <p>
          The hosting platform will keep standard request logs. What those contain and how long
          they are retained is a property of the deployment rather than of this application; the
          repository&rsquo;s deployment guide states what to configure.
        </p>

        <h2>Fonts</h2>
        <p>
          Typefaces are served from this site&rsquo;s own origin. They are fetched at build time
          and bundled, so loading a page makes no request to a font provider and no third party
          learns that you visited.
        </p>

        <h2>External links</h2>
        <p>
          Evidence records link to source documents on the publishers&rsquo; own sites.
          Following one takes you to a third party with its own privacy practices. Those links
          open in a new tab with <code>rel=&ldquo;noopener noreferrer&rdquo;</code>, so the
          destination is not told which page you came from.
        </p>
      </Prose>
    </PageShell>
  );
}
