import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "../components/Footer";
import { SiteHeader } from "../components/Header";
import { SitePage } from "../components/Page";
import { LeftNav, RightNav } from "../components/TopNav";
import {
  HeaderCTAType,
  NavigationIndexType,
  NavigationMenuType,
} from "../types/nav";

describe("SiteFooter", () => {
  it("renders correctly", () => {
    render(<SiteFooter />);
    expect(screen.getByText("This is Footer")).toBeTruthy();
  });
});

describe("SiteHeader", () => {
  it("renders correctly", () => {
    const { container } = render(<SiteHeader />);
    expect(container).toMatchSnapshot();
  });
});

describe("SitePage", () => {
  it("renders correctly", () => {
    const { container } = render(<SitePage>Site Page</SitePage>);
    expect(container).toMatchSnapshot();
  });
});

describe("RightNav", () => {
  const defaultCTA: HeaderCTAType = {
    href: "/default",
    label: "Default CTA",
  };

  it("renders the CTA button with correct href and label", () => {
    const { getByText } = render(<RightNav cta={defaultCTA} />);
    const ctaButton = getByText(defaultCTA.label).closest("a");
    expect(ctaButton?.getAttribute("href")).toBe(defaultCTA.href);
  });

  it("renders the mobile menu button", () => {
    const { container } = render(<RightNav />);
    const menuButton = container.querySelector("button.md\\:hidden");
    expect(menuButton).toBeTruthy();
  });
});

describe("LeftNav", () => {
  const defaultIndex: NavigationIndexType = {
    href: "/default-index",
    element: <span>Default Index</span>,
  };

  const defaultMenu: NavigationMenuType = {
    items: [
      { label: "Default Item 1", href: "/default-item-1" },
      { label: "Default Item 2", href: "/default-item-2" },
    ],
  };

  it("renders index link with correct href and element", () => {
    const { getByText } = render(<LeftNav index={defaultIndex} />);
    const indexLink = getByText("Default Index").closest("a");
    expect(indexLink?.getAttribute("href")).toBe(defaultIndex.href);
  });

  it("renders navigation menu items with correct href and label", () => {
    const { getByText } = render(<LeftNav menu={defaultMenu} />);
    defaultMenu.items.forEach((item) => {
      const menuItemLink = getByText(item.label).closest("a");
      expect(menuItemLink?.getAttribute("href")).toBe(item.href);
    });
  });

  it("does not render navigation menu on small screens", () => {
    const { container } = render(<LeftNav menu={defaultMenu} />);
    const navigationMenu = container.querySelector(".max-md\\:hidden");
    expect(navigationMenu).toBeTruthy();
  });
});
