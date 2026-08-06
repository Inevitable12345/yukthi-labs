import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactSection } from "@/components/home/ContactSection";
import { JsonLd } from "@/components/ui/JsonLd";
import { conferenceEmail } from "@/content/contacts";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact the ICRTET-2026 organising secretaries by phone, or write to ${conferenceEmail}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])} />

      <PageHeader
        eyebrow="Contact & Support"
        title="Get in touch"
        lead="Reach the organising secretaries at SCSVMV and TNTEU for any question about the conference."
        breadcrumbs={[{ name: "Contact", path: "/contact" }]}
      />

      <ContactSection heading={false} />
    </>
  );
}
