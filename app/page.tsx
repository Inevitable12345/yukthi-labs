import { CascadeScene } from "@/components/scenes/CascadeScene";
import { ChokepointScene } from "@/components/scenes/ChokepointScene";
import { ConvergenceScene } from "@/components/scenes/ConvergenceScene";
import { DecisionScopesScene } from "@/components/scenes/DecisionScopesScene";
import { FeedbackScene } from "@/components/scenes/FeedbackScene";
import { FinaleScene } from "@/components/scenes/FinaleScene";
import { GapScene } from "@/components/scenes/GapScene";
import { InvestmentScene } from "@/components/scenes/InvestmentScene";
import { ObservatoryScene } from "@/components/scenes/ObservatoryScene";
import { OldInstrumentsScene } from "@/components/scenes/OldInstrumentsScene";
import {
  ForecastScene,
  MapScene,
  MonitorScene,
  RemapScene,
  SimulateScene,
} from "@/components/scenes/OperatingLoopScenes";
import { RuptureScene } from "@/components/scenes/RuptureScene";
import { StableWorldScene } from "@/components/scenes/StableWorldScene";
import { StructuralBreakScene } from "@/components/scenes/StructuralBreakScene";
import { WhyNowScene } from "@/components/scenes/WhyNowScene";
import { WorldModelScene } from "@/components/scenes/WorldModelScene";
import { YukthiRevealScene } from "@/components/scenes/YukthiRevealScene";
import { CoordinateReadout } from "@/components/story/CoordinateReadout";
import { RoomIndex } from "@/components/story/RoomIndex";
import { ScrollDriver } from "@/components/story/ScrollDriver";
import { WorldStage } from "@/components/world/WorldStage";
import { JsonLd, pageSchema } from "@/components/layout/JsonLd";
import { SITE } from "@/lib/metadata/site";

/* ============================================================================
   THE EXHIBITION
   ----------------------------------------------------------------------------
   Twenty rooms and an observatory, in the order the argument runs (§50). The
   world instrument, the coordinate readout and the room index sit outside the
   sequence because they persist across all of it.

   This is a server component. Every room's text is in the initial HTML, which
   is what makes the thesis crawlable without executing WebGL (§45) and readable
   if none of the client bundles ever arrive.
   ========================================================================== */

export default function ExhibitionPage() {
  return (
    <>
      <WorldStage />
      <ScrollDriver />
      <CoordinateReadout />
      <RoomIndex />

      <ObservatoryScene />
      <StableWorldScene />
      <RuptureScene />
      <ChokepointScene />
      <CascadeScene />
      <StructuralBreakScene />
      <FeedbackScene />
      <ConvergenceScene />
      <OldInstrumentsScene />
      <GapScene />
      <WhyNowScene />
      <YukthiRevealScene />
      <WorldModelScene />
      <MapScene />
      <MonitorScene />
      <ForecastScene />
      <SimulateScene />
      <RemapScene />
      <DecisionScopesScene />
      <InvestmentScene />
      <FinaleScene />

      <JsonLd
        schema={pageSchema(
          `${SITE.name} — ${SITE.mission}`,
          `An immersive thesis in twenty rooms: why the world's structure changed, why the existing toolkit is insufficient in combination, and what ${SITE.name} is building.`,
          "/",
        )}
      />
    </>
  );
}
