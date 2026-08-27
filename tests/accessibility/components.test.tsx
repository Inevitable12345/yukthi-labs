import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ScopeLens } from "@/components/scope/ScopeLens";
import { WhatBreaksNext } from "@/components/demo/WhatBreaksNext";
import { EvidenceInspector } from "@/components/evidence/EvidenceInspector";
import { CausalDiagram } from "@/components/hypergraph/CausalDiagram";
import { ContactForm } from "@/components/contact/ContactForm";
import { signatureGraphs } from "@/data/graphs";

/* These cover the interactive components. A regression in any of them silently
   removes the argument from a keyboard or screen reader user. */

describe("ScopeLens", () => {
  it("is a tablist with exactly one selected tab", () => {
    render(<ScopeLens />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBe(6);
    expect(tabs.filter((tab) => tab.getAttribute("aria-selected") === "true").length).toBe(1);
  });

  it("moves between scopes with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<ScopeLens />);

    const tabs = screen.getAllByRole("tab");
    tabs[0]!.focus();
    await user.keyboard("{ArrowRight}");

    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
  });

  it("wraps around at the ends", async () => {
    const user = userEvent.setup();
    render(<ScopeLens />);

    const tabs = screen.getAllByRole("tab");
    tabs[0]!.focus();
    await user.keyboard("{ArrowLeft}");

    expect(tabs[tabs.length - 1]).toHaveAttribute("aria-selected", "true");
  });

  it("changes the panel content when the scope changes", async () => {
    const user = userEvent.setup();
    render(<ScopeLens />);

    const panel = screen.getByRole("tabpanel");
    const before = panel.textContent;

    await user.click(screen.getByRole("tab", { name: /energy/i }));

    expect(screen.getByRole("tabpanel").textContent).not.toBe(before);
  });

  it("keeps every tab reachable but only one in the tab order", () => {
    render(<ScopeLens />);
    const tabs = screen.getAllByRole("tab");
    const tabbable = tabs.filter((tab) => tab.getAttribute("tabindex") === "0");
    expect(tabbable.length).toBe(1);
  });
});

describe("WhatBreaksNext", () => {
  it("labels itself as illustrative, not model output", () => {
    render(<WhatBreaksNext />);
    expect(screen.getByText(/illustrative scenario/i)).toBeInTheDocument();
    expect(screen.getByText(/not live model output/i)).toBeInTheDocument();
  });

  it("shows the full propagation structure the brief specifies", () => {
    render(<WhatBreaksNext />);

    for (const heading of [
      /what changed/i,
      /where it propagates/i,
      /affected systems/i,
      /second-order effects/i,
      /third-order effects/i,
      /what to monitor/i,
      /possible intervention points/i,
    ]) {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
  });

  it("swaps scenarios and reports the selected one", async () => {
    const user = userEvent.setup();
    render(<WhatBreaksNext />);

    const target = screen.getByRole("button", { name: /extreme-weather grid event/i });
    await user.click(target);

    expect(target).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/extreme cold event/i)).toBeInTheDocument();
  });

  it("never renders a probability", () => {
    const { container } = render(<WhatBreaksNext />);
    expect(container.textContent).not.toMatch(/\b\d{1,3}%\s*(chance|probability|likely)/i);
  });
});

describe("EvidenceInspector", () => {
  it("renders a button per source, naming the record for a screen reader", () => {
    render(<EvidenceInspector ids={["E-001", "E-005"]} />);

    const first = screen.getByRole("button", { name: /E-001/ });
    expect(first).toBeInTheDocument();
    expect(first).toHaveAccessibleName(/International Monetary Fund/i);
  });

  it("opens a labelled dialog with the source detail", async () => {
    const user = userEvent.setup();
    render(<EvidenceInspector ids={["E-001"]} />);

    await user.click(screen.getByRole("button", { name: /E-001/ }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/supported claim/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/what this does not say/i)).toBeInTheDocument();
  });

  it("announces an unverified record as unverified", () => {
    render(<EvidenceInspector ids={["E-011"]} />);
    expect(screen.getByRole("button", { name: /E-011/ })).toHaveAccessibleName(
      /not yet verified/i,
    );
  });

  it("renders nothing for ids that do not resolve", () => {
    const { container } = render(<EvidenceInspector ids={["E-999"]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("CausalDiagram", () => {
  it("exposes the graph's text alternative to assistive technology", () => {
    render(<CausalDiagram graph={signatureGraphs.uriFeedback} />);

    const figure = screen.getByRole("group", { name: /winter storm uri/i });
    expect(figure).toHaveAccessibleDescription(/reinforcing loop/i);
  });

  it("makes every node a focusable control", () => {
    render(<CausalDiagram graph={signatureGraphs.uriFeedback} />);

    // Scoped to the diagram itself: the evidence buttons in the caption beside
    // it are also role=button, and are not diagram nodes.
    const diagram = screen.getByRole("group", { name: /winter storm uri/i });
    const nodes = within(diagram).getAllByRole("button");

    expect(nodes.length).toBe(signatureGraphs.uriFeedback.nodes.length);
    for (const node of nodes) expect(node).toHaveAttribute("tabindex", "0");
  });

  it("reveals a mechanism when a node is selected by keyboard", async () => {
    const user = userEvent.setup();
    render(<CausalDiagram graph={signatureGraphs.uriFeedback} />);

    const node = screen.getByRole("button", { name: /extreme cold/i });
    node.focus();
    await user.keyboard("{Enter}");

    expect(node).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/freezes/i)).toBeInTheDocument();
  });
});

describe("ContactForm", () => {
  it("gives every visible field a real label", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/3 a\.m\. problem/i)).toBeInTheDocument();
  });

  it("reports validation errors against the offending field", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "A Reader");
    await user.type(screen.getByLabelText(/email/i), "nonsense");
    await user.type(screen.getByLabelText(/3 a\.m\. problem/i), "Too short");
    await user.click(screen.getByRole("button", { name: /send/i }));

    const email = screen.getByLabelText(/email/i);
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription(/does not look like an email/i);
  });

  it("moves focus to the first field with an error", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(screen.getByLabelText(/name/i)).toHaveFocus();
  });

  it("keeps the honeypot out of the tab order and the accessibility tree", () => {
    render(<ContactForm />);

    const honeypot = document.querySelector('input[name="website"]');
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot?.closest("[aria-hidden='true']")).not.toBeNull();
  });
});
