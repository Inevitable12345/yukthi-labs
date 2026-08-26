import type { Metadata } from "next";

import { AICapability } from "@/components/home/AICapability";
import { CivilizationalAmbition } from "@/components/home/CivilizationalAmbition";
import { Convergence } from "@/components/home/Convergence";
import { EvidenceFieldAct } from "@/components/home/EvidenceFieldAct";
import { Invocation } from "@/components/home/Invocation";
import { LinearModelFailure } from "@/components/home/LinearModelFailure";
import { PossibleFutures } from "@/components/home/PossibleFutures";
import { RareEarthCascadeAct } from "@/components/home/RareEarthCascade";
import { Rupture } from "@/components/home/Rupture";
import { StableWorld } from "@/components/home/StableWorld";
import { StructuralBreak } from "@/components/home/StructuralBreak";
import { ThreeAMProblem } from "@/components/home/ThreeAMProblem";
import { UriFeedbackLoop } from "@/components/home/UriFeedbackLoop";
import { YukthiBet } from "@/components/home/YukthiBet";
import { WebPageJsonLd } from "@/components/layout/JsonLd";
import { WorldModelScene } from "@/components/world-model/WorldModelScene";
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
 *
 * Behind them runs one continuous world model, pinned to the sections: a sphere
 * with real coordinates that is progressively shown to be a causal structure. It
 * is a layer, not a gate. Remove it — no WebGL, reduced motion, no JavaScript at
 * all — and the argument above is unchanged.
 */
export default function Home() {
  return (
    <>
      <WebPageJsonLd name={SITE.titleDefault} description={SITE.description} path="/" />
      <WorldModelScene />
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
      <PossibleFutures />
      <CivilizationalAmbition />
    </>
  );
}
