import { Hero } from "@/components/home/Hero";
import { QuickInfo } from "@/components/home/QuickInfo";
import { AboutPreview } from "@/components/home/AboutPreview";
import { WhyParticipate } from "@/components/home/WhyParticipate";
import { KeyAreasSection } from "@/components/home/KeyAreasSection";
import { DatesTimeline } from "@/components/home/DatesTimeline";
import { SpeakersShowcase } from "@/components/home/SpeakersShowcase";
import { LeadershipPreview } from "@/components/home/LeadershipPreview";
import { CallForPapers } from "@/components/home/CallForPapers";
import { FeesSection } from "@/components/home/FeesSection";
import { PublicationSection } from "@/components/home/PublicationSection";
import { PaymentSection } from "@/components/home/PaymentSection";
import { ContactSection } from "@/components/home/ContactSection";
import { JsonLd } from "@/components/ui/JsonLd";
import { eventSchema } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <>
      <JsonLd data={eventSchema()} />

      <Hero />
      <QuickInfo />
      <AboutPreview />
      <WhyParticipate />
      <KeyAreasSection />
      <DatesTimeline />
      <SpeakersShowcase />
      <LeadershipPreview />
      <CallForPapers />
      <FeesSection />
      <PublicationSection />
      <PaymentSection />
      <ContactSection />
    </>
  );
}
