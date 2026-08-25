import { Act } from "./Act";
import { EvidenceField } from "@/components/evidence/EvidenceField";
import { evidenceCounts } from "@/data/evidence";

/* ACT 04 — THE EVIDENCE FIELD
   The argument stops being assertion here. Every record is inspectable, and the
   verification status of each one is stated rather than implied. */
export function EvidenceFieldAct() {
  return (
    <Act
      id="evidence-field"
      index="Act 04"
      eyebrow="The record"
      headline="The evidence is already visible in the structure."
      lede={
        <>
          {evidenceCounts.total} records, each attached to the claim it supports and each
          carrying its own verification status. {evidenceCounts.verified} have been checked
          against the cited publication; {evidenceCounts.needsVerification} have not, and say
          so. Nothing on this site rests on a source you cannot open.
        </>
      }
    >
      <EvidenceField />
    </Act>
  );
}
