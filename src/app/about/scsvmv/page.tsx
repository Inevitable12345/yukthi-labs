import type { Metadata } from "next";
import { InstitutionProfile } from "@/components/InstitutionProfile";
import { JsonLd } from "@/components/ui/JsonLd";
import { scsvmv } from "@/content/institutions";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "About SCSVMV",
  description:
    "Sri Chandrasekharendra Saraswathi Viswa Mahavidyalaya, Kanchipuram — the university organising ICRTET-2026 through its School of Education.",
  alternates: { canonical: "/about/scsvmv" },
};

export default function ScsvmvPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "About", path: "/about" },
          { name: "About SCSVMV", path: "/about/scsvmv" },
        ])}
      />

      <InstitutionProfile
        institution={scsvmv}
        breadcrumbs={[
          { name: "About", path: "/about" },
          { name: "SCSVMV", path: "/about/scsvmv" },
        ]}
        sections={[
          "History and establishment",
          "Faculties and schools",
          "The School of Education",
          "Research and publications",
          "Campus and facilities",
          "Accreditation and rankings",
        ]}
      />
    </>
  );
}
