import type { Metadata } from "next";

import { AICapability } from "@/components/home/AICapability";
import { CivilizationalAmbition } from "@/components/home/CivilizationalAmbition";
import { Convergence } from "@/components/home/Convergence";
import { EvidenceFieldAct } from "@/components/home/EvidenceFieldAct";
import { Invocation } from "@/components/home/Invocation";
import { LinearModelFailure } from "@/components/home/LinearModelFailure";
import { RareEarthCascadeAct } from "@/components/home/RareEarthCascade";
import { Rupture } from "@/components/home/Rupture";
import { StableWorld } from "@/components/home/StableWorld";
import { StructuralBreak } from "@/components/home/StructuralBreak";
import { ThreeAMProblem } from "@/components/home/ThreeAMProblem";
import { UriFeedbackLoop } from "@/components/home/UriFeedbackLoop";
import { YukthiBet } from "@/components/home/YukthiBet";
import { WebPageJsonLd } from "@/components/layout/JsonLd";
import { SITE, absoluteUrl } from "@/lib/metadata/site";

export const metadata: Metadata = {
  title: SITE.titleDefault,
  description: SITE.description,
  alternates: { canonical: absoluteUrl("/") },
};

/**
 * The homepage is a sequence, not a landing page.
 *
 * Twelve acts, each an independent component, read in order. Every act is
 * complete as static HTML before any script runs — the argument does not depend on
 * hydration, and neither does its evidence.
 */
export default function Home() {
  return (
    <>
      <WebPageJsonLd name={SITE.titleDefault} description={SITE.description} path="/" />
      <Invocation />
      <StableWorld />
      <Rupture />
      <EvidenceFieldAct />
      <RareEarthCascadeAct />
      <LinearModelFailure />
      <StructuralBreak />
      <UriFeedbackLoop />
      <Convergence />
      <ThreeAMProblem />
      <AICapability />
      <YukthiBet />
      <CivilizationalAmbition />
    </>
  );
}
