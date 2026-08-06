import { SectionHeading } from "@/components/ui/SectionHeading";
import { KeyAreasExplorer } from "./KeyAreasExplorer";
import { keyAreas } from "@/content/key-areas";

/**
 * `preview` (homepage) shows the first eight with a "view all" control.
 * `full` (/registration) lists all twenty from the start — it replaced the
 * standalone key areas page, so nothing should be hidden behind a click.
 */
export function KeyAreasSection({
  variant = "preview",
}: {
  variant?: "preview" | "full";
}) {
  return (
    <section
      id="key-areas"
      className="relative scroll-mt-28 overflow-hidden bg-white py-20 lg:py-28"
      aria-labelledby="key-areas-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 size-[30rem] rounded-full bg-violet/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-10 size-[26rem] rounded-full bg-cyan/5 blur-3xl"
      />

      <div className="container-page relative">
        <SectionHeading
          eyebrow="Call for Papers"
          title={
            <>
              {keyAreas.length} key areas invited for{" "}
              <span className="text-gradient">oral presentation</span>
            </>
          }
          lead="Search the list to find where your work fits. Papers on related themes not listed below are also welcome under “Other Related Themes”."
          align="center"
        />

        <KeyAreasExplorer variant={variant} />
      </div>
    </section>
  );
}
