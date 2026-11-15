import { describe, expect, it } from "vite-plus/test";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { business, enquiryMessage, generalEnquiryHref, topics, whatsappHref } from "./content";

describe("Navodhai enquiries", () => {
  it("starts with a blouse enquiry and updates it when the visitor changes their garment choice", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole("button", { name: "Blouse" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
    expect(
      new URL((screen.getByTestId("hero-whatsapp") as HTMLAnchorElement).href).searchParams.get(
        "text",
      ),
    ).toBe(enquiryMessage(topics[0]));
    await user.click(screen.getByRole("button", { name: /^Dress$/ }));
    expect(screen.getByTestId("hero-whatsapp").textContent).toBe("Enquire");
    expect(
      new URL((screen.getByTestId("hero-whatsapp") as HTMLAnchorElement).href).searchParams.get(
        "text",
      ),
    ).toBe(enquiryMessage(topics[1]));
    await user.click(screen.getByRole("button", { name: "Customise" }));
    expect(screen.getByRole("button", { name: "Customise" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
    expect(
      new URL((screen.getByTestId("hero-whatsapp") as HTMLAnchorElement).href).searchParams.get(
        "text",
      ),
    ).toBe(enquiryMessage(topics[2]));
    expect(screen.getByRole("button", { name: "Dress" }).getAttribute("aria-pressed")).toBe(
      "false",
    );
  });

  it("toggles and persists the appearance using an accessible icon button", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Switch to light mode" }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("navodhai-theme")).toBe("light");
    await user.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("navodhai-theme")).toBe("dark");
  });

  it("restores a previously chosen appearance", () => {
    localStorage.setItem("navodhai-theme", "light");
    render(<App />);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(screen.getByRole("button", { name: "Switch to dark mode" })).toBeDefined();
  });

  it("keeps the latest theme choice when a page transition is interrupted", async () => {
    const originalMedia = window.matchMedia;
    const originalTransition = Object.getOwnPropertyDescriptor(document, "startViewTransition");
    const updates: Array<() => void> = [];
    const finishers: Array<() => void> = [];
    let skips = 0;
    window.matchMedia = (query) => {
      const media = originalMedia(query);
      if (query.includes("prefers-reduced-motion")) {
        Object.defineProperty(media, "matches", { value: false });
      }
      return media;
    };
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: (update: () => void) => {
        updates.push(update);
        return {
          ready: Promise.resolve(),
          finished: new Promise<void>((resolve) => finishers.push(resolve)),
          skipTransition: () => {
            skips += 1;
          },
        };
      },
    });
    try {
      const user = userEvent.setup();
      render(<App />);
      const control = screen.getByRole("button", { name: "Switch to light mode" });
      await user.click(control);
      await user.click(control);
      expect(updates).toHaveLength(2);
      expect(skips).toBe(1);
      act(() => {
        updates[1]();
        updates[0]();
      });
      expect(document.documentElement.dataset.theme).toBe("dark");
      expect(localStorage.getItem("navodhai-theme")).toBe("dark");
      expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeDefined();
      await act(async () => {
        for (const finish of finishers) finish();
      });
    } finally {
      window.matchMedia = originalMedia;
      if (originalTransition)
        Object.defineProperty(document, "startViewTransition", originalTransition);
      else Reflect.deleteProperty(document, "startViewTransition");
    }
  });

  it("defaults to dark regardless of device appearance and preserves a manual choice", async () => {
    const originalMatchMedia = window.matchMedia;
    const media = Object.assign(new EventTarget(), {
      matches: false,
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addListener() {},
      removeListener() {},
    });
    window.matchMedia = (query) =>
      query.includes("prefers-color-scheme") ? media : originalMatchMedia(query);

    try {
      const user = userEvent.setup();
      render(<App />);
      expect(document.documentElement.dataset.theme).toBe("dark");
      act(() => {
        media.matches = true;
        media.dispatchEvent(new Event("change"));
      });
      expect(document.documentElement.dataset.theme).toBe("dark");

      expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeDefined();
      await user.click(screen.getByRole("button", { name: "Switch to light mode" }));
      act(() => {
        media.dispatchEvent(new Event("change"));
      });
      expect(document.documentElement.dataset.theme).toBe("light");

      act(() => {
        media.matches = false;
        media.dispatchEvent(new Event("change"));
      });
      expect(document.documentElement.dataset.theme).toBe("light");
      expect(localStorage.getItem("navodhai-theme")).toBe("light");
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  it.each([
    { topic: topics[0], button: "Blouse" },
    { topic: topics[1], button: "Dress" },
    { topic: topics[2], button: "Customise" },
  ])("prepares a matching WhatsApp message for $button", async ({ topic, button }) => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: button }));
    const link = screen.getByTestId("hero-whatsapp") as HTMLAnchorElement;
    const url = new URL(link.href);
    expect(url.hostname).toBe("wa.me");
    expect(url.pathname).toBe(`/${business.whatsappNumber}`);
    expect(url.searchParams.get("text")).toBe(enquiryMessage(topic));
  });

  it("supports garment choices with the keyboard", async () => {
    const user = userEvent.setup();
    render(<App />);
    screen.getByRole("button", { name: "Dress" }).focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Dress" }).getAttribute("aria-pressed")).toBe("true");
    await user.keyboard("{Tab} ");
    expect(screen.getByRole("button", { name: "Customise" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
    expect(
      new URL((screen.getByTestId("hero-whatsapp") as HTMLAnchorElement).href).searchParams.get(
        "text",
      ),
    ).toBe(enquiryMessage(topics[2]));
  });

  it("keeps a general contact route independent of the default blouse enquiry", () => {
    render(<App />);
    const generalContact = screen
      .getAllByRole("link", { name: "Enquire on WhatsApp" })
      .find((link) => link.closest("footer"));
    expect(generalContact?.getAttribute("href")).toBe(generalEnquiryHref);
    expect(screen.getByRole("link", { name: business.email }).getAttribute("href")).toBe(
      `mailto:${business.email}`,
    );
    expect(screen.getByRole("link", { name: business.phone }).getAttribute("href")).toBe(
      business.phoneHref,
    );
    expect(document.querySelector("form")).toBeNull();
  });

  it("shows floating top navigation only after scrolling down", () => {
    const initialScroll = window.scrollY;
    try {
      Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
      render(<App />);
      expect(screen.queryByRole("link", { name: "Back to top" })).toBeNull();
      act(() => {
        Object.defineProperty(window, "scrollY", { configurable: true, value: 800 });
        window.dispatchEvent(new Event("scroll"));
      });
      expect(screen.getByRole("link", { name: "Back to top" }).getAttribute("href")).toBe("#top");
      act(() => {
        Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
        window.dispatchEvent(new Event("scroll"));
      });
      expect(screen.queryByRole("link", { name: "Back to top" })).toBeNull();
    } finally {
      Object.defineProperty(window, "scrollY", { configurable: true, value: initialScroll });
    }
  });

  it("respects reduced-motion preference without disabling enquiries", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    expect(container.querySelector("[data-motion]")?.getAttribute("data-motion")).toBe("reduced");
    await user.click(screen.getByRole("button", { name: "Dress" }));
    expect(
      new URL((screen.getByTestId("hero-whatsapp") as HTMLAnchorElement).href).searchParams.get(
        "text",
      ),
    ).toBe(enquiryMessage(topics[1]));
    const originalTransition = Object.getOwnPropertyDescriptor(document, "startViewTransition");
    let transitions = 0;
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: () => {
        transitions += 1;
      },
    });
    try {
      await user.click(screen.getByRole("button", { name: "Switch to light mode" }));
      expect(document.documentElement.dataset.theme).toBe("light");
      expect(transitions).toBe(0);
    } finally {
      if (originalTransition)
        Object.defineProperty(document, "startViewTransition", originalTransition);
      else Reflect.deleteProperty(document, "startViewTransition");
    }
  });

  it("prerenders the editorial section and direct contact without client JavaScript", () => {
    const markup = renderToString(<App />);
    const page = new DOMParser().parseFromString(markup, "text/html");
    expect(page.querySelector("h1")?.textContent).toBe("Be a princess.");
    expect(page.querySelector(".opening-description")?.textContent).toBe("Blouse & dress making.");
    expect(page.querySelector("header nav")).toBeNull();
    // The complete enquiry layout is present before hydration, so enabling it cannot shift it.
    expect(page.querySelector(".opening-picker")?.hasAttribute("hidden")).toBe(false);
    expect(page.querySelectorAll(".piece-choice")).toHaveLength(3);
    for (const button of page.querySelectorAll(".piece-choice")) {
      expect(button.hasAttribute("disabled")).toBe(true);
    }
    expect(page.querySelector('.piece-choice[aria-pressed="true"]')?.textContent).toBe("Blouse");
    expect(page.querySelector(".theme-control")?.hasAttribute("hidden")).toBe(false);
    expect(page.querySelector(".theme-control")?.hasAttribute("disabled")).toBe(true);
    expect(page.querySelector(".opening-art img")?.getAttribute("src")).toContain(
      "textile-study-cutout",
    );
    const editorial = page.querySelector("#services");
    expect(editorial?.textContent).toContain("Made around your idea.");
    expect(editorial?.textContent).toContain("Customisation");
    expect(page.querySelector("#ordering-title")?.textContent).toBe("Start with a conversation.");
    expect(page.querySelectorAll(".ordering-steps li")).toHaveLength(3);
    expect(editorial?.querySelector("button, input, a, [hidden]")).toBeNull();
    expect(page.querySelector('[data-testid="hero-whatsapp"]')?.getAttribute("href")).toBe(
      whatsappHref(enquiryMessage(topics[0])),
    );
    expect(page.querySelectorAll("details")).toHaveLength(0);
    expect(page.querySelectorAll("footer")).toHaveLength(1);
    expect(page.querySelector("footer#contact")?.textContent).toContain(business.email);
    expect(page.body.textContent).toContain(business.serviceArea);
    expect(page.body.textContent).toContain(business.email);
  });
});
