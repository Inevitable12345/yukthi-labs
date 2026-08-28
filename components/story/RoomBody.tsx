import { ROOM_COPY } from "@/content/thesis";
import { EvidenceRack } from "@/components/evidence/EvidenceRack";
import { Ladder } from "@/components/ui/Ladder";
import { PullQuote } from "@/components/ui/PullQuote";
import { Reveal } from "@/components/ui/Reveal";
import type { Chapter } from "@/lib/story/chapters";
import { cn } from "@/lib/utils/cn";

/**
 * The prose half of a room. Rooms compose this with whatever visual apparatus
 * their argument needs; nothing here knows about the world instrument, which is
 * why the argument survives when the world does not render (§41).
 */
export function RoomBody({
  id,
  className,
  showLadder = true,
  showEvidence = true,
  paragraphs,
}: {
  id: Chapter;
  className?: string;
  showLadder?: boolean;
  showEvidence?: boolean;
  /** Limits how much prose this placement carries. Omit for all of it. */
  paragraphs?: number;
}) {
  const copy = ROOM_COPY[id];
  const body = paragraphs ? copy.body.slice(0, paragraphs) : copy.body;

  return (
    <div className={cn("space-y-8", className)}>
      <Reveal delay={80}>
        <div className="prose-argument">
          {body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </Reveal>

      {showLadder && copy.ladder ? (
        <Reveal delay={140}>
          <Ladder steps={copy.ladder.steps} title={copy.ladder.title} />
        </Reveal>
      ) : null}

      {copy.pull ? (
        <Reveal delay={180}>
          <PullQuote>{copy.pull}</PullQuote>
        </Reveal>
      ) : null}

      {showEvidence && copy.evidenceIds ? (
        <Reveal delay={220}>
          <EvidenceRack evidenceIds={copy.evidenceIds} />
        </Reveal>
      ) : null}
    </div>
  );
}
