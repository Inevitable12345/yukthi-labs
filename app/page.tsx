import type { Metadata } from "next";

import { StoryShell } from "@/components/story/StoryShell";
import { WebPageJsonLd } from "@/components/layout/JsonLd";
import { Invocation } from "@/components/scenes/Invocation";
import { StabilityScene } from "@/components/scenes/StabilityScene";
import { RuptureScene } from "@/components/scenes/RuptureScene";
import { RareEarthScene } from "@/components/scenes/RareEarthScene";
import { SemiconductorScene } from "@/components/scenes/SemiconductorScene";
import { StructuralBreakScene } from "@/components/scenes/StructuralBreakScene";
import { UriFeedbackScene } from "@/components/scenes/UriFeedbackScene";
import { ComingDecadeScene } from "@/components/scenes/ComingDecadeScene";
import { AIReasoningScene } from "@/components/scenes/AIReasoningScene";
import { HypergraphRevealScene } from "@/components/scenes/HypergraphRevealScene";
import { OperatingLoopScene } from "@/components/scenes/OperatingLoopScene";
import { DecisionScopeScene } from "@/components/scenes/DecisionScopeScene";
import { InvestmentScene } from "@/components/scenes/InvestmentScene";
import { FinaleScene } from "@/components/scenes/FinaleScene";
import { SITE, absoluteUrl } from "@/lib/metadata/site";

export const metadata: Metadata = {
  title: SITE.titleDefault,
  description: SITE.description,
  alternates: { canonical: absoluteUrl("/") },
};

/**
 * The homepage is an argument, not a landing page.
 *
 * Thirteen chapters read in order. Each is an independent component and each is
 * complete as static HTML before any script runs — the argument does not depend
 * on hydration, and neither does its evidence.
 *
 * The scroll is the argument: the world behind these chapters transforms from a
 * globe into a causal hypergraph as the reasoning requires it to, driven by the
 * same story state the prose is registered with.
 */
export default function Home() {
  return (
    <>
      <WebPageJsonLd name={SITE.titleDefault} description={SITE.description} path="/" />

      <StoryShell>
        <Invocation />
        <StabilityScene />
        <RuptureScene />
        <RareEarthScene />
        <SemiconductorScene />
        <StructuralBreakScene />
        <UriFeedbackScene />
        <ComingDecadeScene />
        <AIReasoningScene />
        <HypergraphRevealScene />
        <OperatingLoopScene />
        <DecisionScopeScene />
        <InvestmentScene />
        <FinaleScene />
      </StoryShell>
    </>
  );
}
