import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { CallForPapers } from "@/components/home/CallForPapers";
import { KeyAreasSection } from "@/components/home/KeyAreasSection";
import { DatesTimeline } from "@/components/home/DatesTimeline";
import { SubmissionGuidelines } from "@/components/home/SubmissionGuidelines";
import { FeesSection } from "@/components/home/FeesSection";
import { PaymentSection } from "@/components/home/PaymentSection";
import { PublicationSection } from "@/components/home/PublicationSection";
import { SectionJumpNav } from "@/components/ui/SectionJumpNav";
import { QrPanel } from "@/components/ui/QrPanel";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { conference } from "@/content/conference";
import { qrCodes } from "@/content/payment";
import { breadcrumbSchema, eventSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Registration & Call for Papers",
  description:
    "Everything authors and delegates need for ICRTET-2026 in one place — call for papers, key areas, important dates, submission guidelines, registration fees, payment details and publication.",
  alternates: { canonical: "/registration" },
};

/**
 * The single destination for authors and delegates.
 *
 * Call for papers, key areas, important dates, guidelines, fees, payment and
 * publication were previously six separate routes; they are now anchored
 * sections here so nobody has to hop between pages mid-submission.
 */
const jumpLinks = [
  { id: "call-for-papers", label: "Call for Papers" },
  { id: "key-areas", label: "Key Areas" },
  { id: "important-dates", label: "Important Dates" },
  { id: "guidelines", label: "Submission Guidelines" },
  { id: "fees", label: "Registration Fees" },
  { id: "scan", label: "Scan to Register" },
  { id: "payment", label: "Payment" },
  { id: "publication", label: "Publication" },
];

export default function RegistrationPage() {
  return (
    <>
      <JsonLd data={eventSchema()} />
      <JsonLd
        data={breadcrumbSchema([{ name: "Registration", path: "/registration" }])}
      />

      <PageHeader
        eyebrow="Authors & Delegates"
        title="Registration & Call for Papers"
        lead="Submit your paper by September 5, 2026 and complete payment by September 10, 2026. Everything you need is on this page."
        breadcrumbs={[{ name: "Registration", path: "/registration" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Button
            href={conference.links.registration}
            variant="accent"
            size="lg"
            withArrow
          >
            Open registration form
          </Button>
          <Button href="/faq" variant="onDark" size="lg">
            Read the FAQ
          </Button>
        </div>
      </PageHeader>

      <SectionJumpNav links={jumpLinks} />

      <CallForPapers />
      <KeyAreasSection variant="full" />
      <DatesTimeline />
      <SubmissionGuidelines />
      <FeesSection heading showProcess={false} ctaHref={conference.links.registration} />

      {/* Scan to register */}
      <section id="scan" className="scroll-mt-28 bg-white py-20 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Scan to Register"
            title="Register and submit from your phone"
            lead="Scan the code, or use the text link below it — both open the same official form."
            align="center"
          />

          <Reveal delay={0.08} className="mx-auto mt-10 max-w-sm">
            <QrPanel qr={qrCodes.find((qr) => qr.id === "registration")!} />
          </Reveal>
        </div>
      </section>

      <PaymentSection heading />
      <PublicationSection heading />
    </>
  );
}
