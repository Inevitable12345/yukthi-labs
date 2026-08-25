import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { EvidenceCard } from "@/components/evidence/EvidenceCard";
import { EvidenceMarker } from "@/components/evidence/EvidenceMarker";
import { ScenarioSelector } from "@/components/scenario/ScenarioSelector";
import { getEvidence } from "@/data/evidence";

/**
 * Behaviour tests written from the reader's point of view: what is announced,
 * what can be reached by keyboard, and what a dialog does with focus.
 */
describe("evidence marker", () => {
  it("names its source in its accessible label", () => {
    render(<EvidenceMarker id="E-001" />);
    const marker = screen.getByRole("button");
    expect(marker).toHaveAccessibleName(/E-001/);
    expect(marker).toHaveAccessibleName(/International Monetary Fund/);
  });

  it("renders nothing for an unknown record rather than an empty citation", () => {
    const { container } = render(<EvidenceMarker id="E-404" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("opens a modal dialog with the full record, and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<EvidenceMarker id="E-004" />);

    await user.click(screen.getByRole("button"));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(within(dialog).getAllByText(/Export licensing/i).length).toBeGreaterThan(0);
    expect(within(dialog).getByText("Verified")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("evidence card", () => {
  it("shows verification status and the source, and never fabricates a link", () => {
    const record = getEvidence("E-009")!;
    render(<EvidenceCard record={record} />);

    expect(screen.getByText("Needs verification")).toBeInTheDocument();
    expect(screen.getByText("European Central Bank")).toBeInTheDocument();
    // E-009 has no URL, so the card must say so rather than render a dead link.
    expect(screen.getByText(/No stable link recorded/i)).toBeInTheDocument();
  });

  it("marks an external source link as safe and shows where it goes", () => {
    render(<EvidenceCard record={getEvidence("E-001")!} />);
    const link = screen.getByRole("link", { name: /Open source/i });
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(link).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAccessibleName(/imf\.org/);
  });
});

describe("scenario selector", () => {
  it("exposes decision scopes as a tablist with one selected tab", () => {
    render(<ScenarioSelector />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBe(6);
    expect(tabs.filter((tab) => tab.getAttribute("aria-selected") === "true")).toHaveLength(1);
  });

  it("moves between scopes with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<ScenarioSelector />);

    const industry = screen.getByRole("tab", { name: /industry/i });
    industry.focus();
    await user.keyboard("{ArrowDown}");

    expect(screen.getByRole("tab", { name: /energy/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent(/grid operator|energy trader/i);
  });

  it("labels every trace as illustrative", () => {
    render(<ScenarioSelector />);
    expect(screen.getByText(/Illustrative causal trace/i)).toBeInTheDocument();
  });
});

describe("cookie banner", () => {
  it("offers reject, accept-all and per-category choice at equal prominence", async () => {
    window.localStorage.clear();
    render(
      <ConsentProvider>
        <CookieBanner />
      </ConsentProvider>,
    );

    const region = await screen.findByRole("region", { name: /cookie consent/i });
    const reject = within(region).getByRole("button", { name: /reject optional/i });
    const acceptAll = within(region).getByRole("button", { name: /accept all/i });
    const choose = within(region).getByRole("button", { name: /choose categories/i });

    // No dark pattern: the three actions share one class list, so none is louder.
    expect(reject.className).toBe(acceptAll.className);
    expect(choose.className).toBe(acceptAll.className);
  });

  it("stores only the necessary category when optional is rejected", async () => {
    window.localStorage.clear();
    const user = userEvent.setup();
    render(
      <ConsentProvider>
        <CookieBanner />
      </ConsentProvider>,
    );

    await user.click(await screen.findByRole("button", { name: /reject optional/i }));

    const stored = JSON.parse(window.localStorage.getItem("yukthi.consent.v1")!);
    expect(stored.state).toEqual({
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
    });
    expect(screen.queryByRole("region", { name: /cookie consent/i })).not.toBeInTheDocument();
  });
});
