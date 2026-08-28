import { Room } from "@/components/story/Room";
import { RoomBody } from "@/components/story/RoomBody";
import { RoomHeading } from "@/components/story/RoomHeading";

export function StableWorldScene() {
  return (
    <Room id="stability">
      <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <RoomHeading id="stability" />
          <RoomBody id="stability" className="mt-10" showLadder={false} />
        </div>
        <div className="lg:pt-40">
          <RoomBody id="stability" paragraphs={0} showEvidence={false} />
        </div>
      </div>
    </Room>
  );
}
