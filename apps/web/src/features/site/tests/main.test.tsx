import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RightNav } from "../components/templetes";
import { siteConfig } from "../configs/site";

// Mock next/link so Vitest doesn't break
vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--mock-geist" }),
  Geist_Mono: () => ({ variable: "--mock-geist-mono" }),
}));

vi.mock("next/link", () => {
  return {
    default: ({ href, children }: any) => <a href={href}>{children}</a>,
  };
});

// Example CTA mock
const mockCTA = {
  href: "/get-started",
  label: "Get Started",
};

describe("RightNav", () => {
  it("renders the CTA button with correct label and link", () => {
    render(<RightNav cta={mockCTA} />);
    const ctaLink = screen.getByRole("link", { name: /get started/i });

    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute("href", "/get-started");
  });

  it("renders the menu button for mobile", () => {
    render(<RightNav cta={mockCTA} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it("uses default CTA if none is passed", () => {
    // Spy on siteConfig to check usage
    render(<RightNav />);
    expect(
      screen.getByRole("link", { name: siteConfig.header.CTA.label }),
    ).toBeInTheDocument();
  });
});
