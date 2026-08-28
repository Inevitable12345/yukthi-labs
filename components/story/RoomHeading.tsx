import { ROOM_BY_ID, type Chapter } from "@/lib/story/chapters";
import { ROOM_COPY } from "@/content/thesis";
import { ClaimBadge } from "@/components/ui/ClaimBadge";
import { InstrumentLabel } from "@/components/ui/InstrumentLabel";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils/cn";

/**
 * The heading block every room shares: coordinate, headline, standfirst and —
 * where the room makes a factual assertion — the class that assertion belongs
 * to (§33). The `<h2>` carries the id the section is labelled by.
 */
export function RoomHeading({
  id,
  className,
  size = "headline",
}: {
  id: Chapter;
  className?: string;
  size?: "headline" | "display";
}) {
  const room = ROOM_BY_ID[id];
  const copy = ROOM_COPY[id];

  return (
    <Reveal className={cn("max-w-[54rem]", className)}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <InstrumentLabel>{copy.eyebrow}</InstrumentLabel>
        {copy.claimClass ? <ClaimBadge claim={copy.claimClass} /> : null}
      </div>
      <h2 id={`${room.domId}-heading`} className={cn("mt-5", size)}>
        {copy.headline}
      </h2>
      {copy.standfirst ? <p className="standfirst mt-5 max-w-[52ch]">{copy.standfirst}</p> : null}
    </Reveal>
  );
}
