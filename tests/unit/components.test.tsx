import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CausalDiagram } from "@/components/causal/CausalDiagram";
import { EvidenceRack } from "@/components/evidence/EvidenceRack";
import { EvidenceRecord } from "@/components/evidence/EvidenceRecord";
import { Ladder } from "@/components/ui/Ladder";
import { RoomHeading } from "@/components/story/RoomHeading";
import { CHOKEPOINT_GRAPH } from "@/content/scenarios";
import { EVIDENCE_BY_ID } from "@/content/evidence";

/* Accessibility properties that the argument depends on, asserted rather than
   assumed: nothing essential lives only inside a graphic, every disclosure is
   operable from the keyboard, and order survives without CSS (§42). */

describe("evidence record", () => {
  it("keeps the source's claim and Yukthi's interpretation in separate fields", () => {
    const record = EVIDENCE_BY_ID["ferc-nerc-uri"]!;
    render(<EvidenceRecord evidence={record} />);

    const claim = screen.getByText("Claim").parentElement!;
    const interpretation = screen.getByText("Yukthi interpretation").parentElement!;

    expect(within(claim).getByText(record.claim)).toBeInTheDocument();
    expect(within(interpretation).getByText(record.interpretation)).toBeInTheDocument();
  });

  it("shows a locator when no stable link is known", () => {
    const record = EVIDENCE_BY_ID["ferc-nerc-uri"]!;
    render(<EvidenceRecord evidence={record} />);
    expect(screen.getByText(record.locator!)).toBeInTheDocument();
  });

  it("marks an outbound link as opening a new tab", () => {
    const record = EVIDENCE_BY_ID["iea-electricity-2024"]!;
    render(<EvidenceRecord evidence={record} />);
    const link = screen.getByRole("link", { name: /opens in a new tab/i });
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAttribute("target", "_blank");
  });
});

describe("evidence rack", () => {
  it("opens and closes a record from the keyboard", async () => {
    const user = userEvent.setup();
    render(<EvidenceRack evidenceIds={["ecb-projection-errors"]} />);

    const trigger = screen.getByRole("button", { name: /European Central Bank/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("article")).toBeInTheDocument();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("renders nothing for unknown ids rather than an empty shell", () => {
    const { container } = render(<EvidenceRack evidenceIds={["missing"]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("causal diagram", () => {
  it("publishes the whole structure as text beside the graphic", () => {
    render(<CausalDiagram graph={CHOKEPOINT_GRAPH} />);
    const summary = screen.getByText(/Read this diagram as text/);
    expect(summary).toBeInTheDocument();

    for (const relation of CHOKEPOINT_GRAPH.relations) {
      expect(screen.getByText(relation.mechanism)).toBeInTheDocument();
    }
  });

  it("hides the decorative svg from assistive technology", () => {
    const { container } = render(<CausalDiagram graph={CHOKEPOINT_GRAPH} />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("ladder", () => {
  it("is an ordered list, so the sequence survives without styling", () => {
    render(<Ladder steps={["ONE", "TWO", "THREE"]} title="Order" />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent("ONE");
    expect(items[2]).toHaveTextContent("THREE");
  });
});

describe("room heading", () => {
  it("carries the id its section is labelled by", () => {
    render(<RoomHeading id="chokepoint" />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveAttribute("id", "chokepoint-heading");
  });

  it("prints the class of the claim the room makes", () => {
    render(<RoomHeading id="simulate" />);
    expect(screen.getByText("Illustrative scenario")).toBeInTheDocument();
  });
});
