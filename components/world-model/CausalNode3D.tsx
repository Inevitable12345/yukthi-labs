"use client";

import { StrategicNode } from "./StrategicNode";

/**
 * The nodes with no address: mechanisms, shared constraints, regime states.
 *
 * They are the reason a map is insufficient. A licence queue has no coordinates,
 * and neither does the constraint it produces — but both sit on the causal path
 * between a policy in one country and a stopped line in another. They are drawn
 * by the same instanced renderer as the geographic nodes, because to the model
 * they are the same kind of object.
 */
export function CausalNode3D() {
  return <StrategicNode subset="structural" />;
}
