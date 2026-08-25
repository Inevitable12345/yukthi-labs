import { causalGraphSchema, type CausalGraph } from "./schema";

/* ============================================================================
   RARE-EARTH CASCADE
   ----------------------------------------------------------------------------
   Structure: observed. Every node corresponds to a documented stage and every
   relation to a mechanism named in the cited sources (E-004, E-005, E-006, E-016).

   What is *not* claimed: that the cascade ran to completion, that any specific
   plant stopped, or that the exposure figure was realised as loss. E-006 measures
   activity sitting behind the chokepoint, and the graph says exactly that.
   ========================================================================== */

export const rareEarthCascade: CausalGraph = causalGraphSchema.parse({
  id: "rare-earth-cascade",
  title: "Heavy rare-earth export licensing",
  scope: "Automotive and industrial exposure to medium and heavy rare-earth magnet supply",
  illustrative: false,
  evidenceIds: ["E-004", "E-005", "E-006", "E-016"],
  textAlternative:
    "A causal cascade running left to right in seven stages. Refining concentration — roughly 90% of global rare-earth separation capacity in one jurisdiction — is the standing condition. On 4 April 2025 an export licensing requirement is imposed on seven medium and heavy rare earth elements and certain permanent magnets. Licensing converts availability into a queue: shipments continue, but at the rate licences are granted. Constrained magnet supply propagates to Tier-2 and Tier-3 suppliers, who hold the least inventory and the least pricing power. Component plants producing motors, sensors and actuators interrupt. Four downstream sectors depend on those components: automotive production, wind and grid equipment, defence systems, and data centre build-out. Behind those sectors the IEA estimates up to 6.5 trillion US dollars of annual economic activity outside China would be exposed under full implementation of the controls, of which over 3 trillion is automotive. The exposure figure measures activity sitting behind the chokepoint; it is not a realised loss and not a forecast.",
  nodes: [
    {
      id: "re-concentration",
      label: "Refining concentration",
      kind: "state",
      position: { x: 0.04, y: 0.14 },
      labelSide: "below",
      state: "~90% of global separation and refining capacity in one jurisdiction",
      description:
        "Mined production is comparatively distributed. Separation and refining is not. The chokepoint sits at processing, not at the deposit.",
      evidenceIds: ["E-005"],
      scope: "upstream",
      tags: ["chokepoint"],
    },
    {
      id: "re-control",
      label: "Export licensing",
      kind: "policy",
      position: { x: 0.04, y: 0.86 },
      labelSide: "below",
      state: "Imposed 4 April 2025 on seven elements and certain magnets",
      timestamp: "2025-04-04",
      description:
        "Samarium, gadolinium, terbium, dysprosium, lutetium, scandium, yttrium — and permanent magnets containing them.",
      evidenceIds: ["E-004"],
      scope: "upstream",
    },
    {
      id: "re-licence",
      label: "Licence processing",
      kind: "mechanism",
      position: { x: 0.235, y: 0.5 },
      labelSide: "below",
      state: "Administrative queue",
      description:
        "The binding constraint is not physical scarcity. It is the time between an application and a granted licence.",
      evidenceIds: ["E-004", "E-016"],
    },
    {
      id: "re-magnet",
      label: "Magnet supply",
      kind: "asset",
      position: { x: 0.4, y: 0.5 },
      labelSide: "below",
      state: "Constrained",
      description:
        "High-coercivity permanent magnets — the input that lets a small motor deliver high torque in a small volume.",
      evidenceIds: ["E-005", "E-016"],
    },
    {
      id: "re-tier",
      label: "Tier-2 / Tier-3 suppliers",
      kind: "actor",
      position: { x: 0.575, y: 0.1 },
      labelSide: "above",
      state: "Least inventory, least visibility",
      description:
        "The layer no procurement dashboard reaches. Buyers know their Tier-1s; the constraint binds two levels below that.",
    },
    {
      id: "re-component",
      label: "Motors · sensors · actuators",
      kind: "asset",
      position: { x: 0.575, y: 0.9 },
      labelSide: "below",
      state: "Production interrupted",
      description:
        "The physical components in which the magnet is embedded, and the last point at which substitution is still cheap.",
    },
    {
      id: "re-auto",
      label: "Automotive production",
      kind: "outcome",
      position: { x: 0.8, y: 0.06 },
      labelSide: "above",
      state: "Exposed",
      description: "Over USD 3 trillion of the exposed activity identified by the IEA.",
      evidenceIds: ["E-006"],
    },
    {
      id: "re-energy",
      label: "Wind · grid equipment",
      kind: "outcome",
      position: { x: 0.8, y: 0.36 },
      labelSide: "above",
      state: "Exposed",
      description:
        "Direct-drive generators and grid equipment carry the same magnet dependency.",
      evidenceIds: ["E-006"],
    },
    {
      id: "re-defence",
      label: "Defence systems",
      kind: "outcome",
      position: { x: 0.8, y: 0.64 },
      labelSide: "below",
      state: "Exposed",
      description:
        "Applications tied to foreign military programmes are treated differently under the licensing regime.",
      evidenceIds: ["E-004"],
    },
    {
      id: "re-datacentre",
      label: "Data-centre build-out",
      kind: "outcome",
      position: { x: 0.8, y: 0.94 },
      labelSide: "below",
      state: "Exposed",
      description:
        "Cooling, drives and grid connection equipment — the point where this cascade meets the electricity chain.",
      evidenceIds: ["E-006", "E-015"],
    },
    {
      id: "re-exposure",
      label: "Downstream exposure",
      kind: "risk",
      position: { x: 0.975, y: 0.5 },
      labelSide: "below",
      anchor: "end",
      state: "Up to USD 6.5T of annual activity outside China, under full implementation",
      description:
        "Activity sitting behind the chokepoint under a full-implementation scenario. Not a loss, not a forecast, not a probability.",
      evidenceIds: ["E-006"],
      tags: ["scenario-bound"],
    },
  ],
  relations: [
    {
      id: "re-r1",
      sourceIds: ["re-concentration", "re-control"],
      targetIds: ["re-licence"],
      label: "concentration × control",
      mechanism:
        "A licensing requirement is only a chokepoint where alternative processing capacity does not exist. Concentration and control are jointly necessary — either alone would be absorbed.",
      polarity: "positive",
      order: 1,
      state: "active",
      evidenceIds: ["E-004", "E-005"],
      alternatives: [
        "Inventory drawdown at magnet buyers could absorb a short licensing delay without any downstream effect.",
        "Substitution to ferrite or to non-magnet motor designs is possible in some applications at a cost and weight penalty.",
      ],
    },
    {
      id: "re-r2",
      sourceIds: ["re-licence"],
      targetIds: ["re-magnet"],
      label: "queue",
      mechanism:
        "Delivery timing becomes a function of administrative throughput rather than production capacity.",
      polarity: "negative",
      order: 1,
      state: "active",
      evidenceIds: ["E-016"],
    },
    {
      id: "re-r3",
      sourceIds: ["re-magnet"],
      targetIds: ["re-tier", "re-component"],
      label: "to tier-n",
      mechanism:
        "Constraint reaches the layer holding the least inventory first. Allocation decisions are made where visibility is worst.",
      polarity: "negative",
      order: 2,
      state: "active",
    },
    {
      id: "re-r4",
      sourceIds: ["re-tier", "re-component"],
      targetIds: ["re-auto", "re-energy", "re-defence", "re-datacentre"],
      label: "shared input",
      mechanism:
        "Four sectors that appear unrelated on a balance sheet share one physical input. Their correlation is invisible until the input binds.",
      polarity: "negative",
      order: 3,
      state: "active",
      evidenceIds: ["E-006"],
    },
    {
      id: "re-r5",
      sourceIds: ["re-auto", "re-energy", "re-defence", "re-datacentre"],
      targetIds: ["re-exposure"],
      label: "aggregate",
      mechanism:
        "Exposure is the sum of activity that depends on the constrained input, not the sum of activity that stops.",
      polarity: "positive",
      order: 3,
      state: "active",
      evidenceIds: ["E-006"],
    },
  ],
});
