"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { committees, totalCommitteeMembers } from "@/content/committees";
import { easeOut } from "@/lib/motion";

const leadership = committees.filter((group) => group.leadership);
const supporting = committees.filter((group) => !group.leadership);

/**
 * Leadership first, with the advisory and organising committees revealed
 * inline on request.
 *
 * There is no longer a separate /committees route, so the full listing lives
 * here rather than behind a link. Names stay at body size throughout — the
 * brief explicitly rules out shrinking committee text to make it fit.
 */
export function LeadershipPreview() {
  const [showAll, setShowAll] = useState(false);

  return (
    <section
      id="leadership"
      className="relative bg-white py-20 lg:py-28"
      aria-labelledby="leadership-heading"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow="Conference Leadership"
          title="Patrons and chairs of ICRTET-2026"
          lead="The conference is guided by the leadership of SCSVMV and TNTEU, supported by an advisory committee and organising teams across both universities."
          align="center"
        />

        <div className="mt-12 space-y-10 lg:mt-14">
          {leadership.map((group) => (
            <CommitteeGroupBlock key={group.id} group={group} />
          ))}
        </div>

        {/* Remaining committees.

            Mounted conditionally with an entrance-only animation. An exit
            animation left the wrapper at height:0 while the 30 members inside
            stayed in the accessibility tree and the tab order — invisible to
            sighted users but still read aloud and still focusable. */}
        {showAll && (
          <motion.div
            id="all-committees"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="space-y-10 pt-10"
          >
            {supporting.map((group) => (
              <CommitteeGroupBlock key={group.id} group={group} />
            ))}
          </motion.div>
        )}

        <div className="mt-12 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAll((open) => !open)}
            aria-expanded={showAll}
            aria-controls="all-committees"
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3 font-display text-sm font-semibold text-deep transition-colors hover:border-royal/50 hover:bg-surface-blue"
          >
            {showAll ? "Hide the full committee" : "View Complete Committee"}
            <ChevronDown
              className={`size-4 text-royal transition-transform duration-300 ${
                showAll ? "rotate-180" : "group-hover:translate-y-0.5"
              }`}
              aria-hidden="true"
            />
          </button>
          <p className="text-sm text-ink-soft">
            {totalCommitteeMembers} members across advisory, organising and
            joint-organising committees.
          </p>
        </div>
      </div>
    </section>
  );
}

function CommitteeGroupBlock({
  group,
}: {
  group: (typeof committees)[number];
}) {
  return (
    <div id={group.id} className="scroll-mt-28">
      <div className="mb-5 flex items-center gap-4">
        <h3 className="shrink-0 font-display text-lg font-bold text-deep sm:text-xl">
          {group.title}
        </h3>
        <span aria-hidden="true" className="hairline flex-1" />
        <span className="shrink-0 rounded-full bg-surface-blue px-2.5 py-0.5 text-xs font-semibold text-royal">
          {group.members.length}
        </span>
      </div>

      <RevealGroup step={0.05} className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {group.members.map((member) => (
          <RevealItem key={member.name} className="h-full">
            <article className="card-surface group h-full p-5">
              <div className="flex items-start gap-3.5">
                {/* Monogram stands in for a portrait — no invented photos. */}
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-royal to-violet font-display text-sm font-bold text-white"
                >
                  {initialsOf(member.name)}
                </span>
                <div className="min-w-0">
                  <h4 className="text-[1rem] font-semibold leading-snug text-deep">
                    {member.name}
                  </h4>
                  <p className="mt-1 text-[0.88rem] leading-snug text-ink-soft">
                    {member.designation}
                  </p>
                  <p className="mt-1 text-[0.82rem] font-semibold text-royal">
                    {member.institution}
                  </p>
                </div>
              </div>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

/** "Prof. K. Venkatramanan" → "KV" — titles and honorifics are skipped. */
function initialsOf(name: string) {
  const skip = new Set(["prof.", "dr.", "mr.", "mrs.", "ms.", "shri", "smt."]);
  const parts = name
    .split(/\s+/)
    .filter((part) => !skip.has(part.toLowerCase()))
    .map((part) => part.replace(/[^A-Za-z]/g, ""))
    .filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
