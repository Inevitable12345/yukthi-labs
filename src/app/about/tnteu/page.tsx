import type { Metadata } from "next";
import { InstitutionProfile } from "@/components/InstitutionProfile";
import { JsonLd } from "@/components/ui/JsonLd";
import { tnteu } from "@/content/institutions";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "About TNTEU",
  description:
    "Tamil Nadu Teachers Education University, Chennai — the university associated with ICRTET-2026 through its Department of Educational Technology.",
  alternates: { canonical: "/about/tnteu" },
};

export default function TnteuPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "About", path: "/about" },
          { name: "About TNTEU", path: "/about/tnteu" },
        ])}
      />

      <InstitutionProfile
        institution={tnteu}
        breadcrumbs={[
          { name: "About", path: "/about" },
          { name: "TNTEU", path: "/about/tnteu" },
        ]}
        sections={[
          "History and establishment",
          "Departments and programmes",
          "Department of Educational Technology",
          "Research and publications",
          "Affiliated colleges",
          "Accreditation",
        ]}
      />
    </>
  );
}
