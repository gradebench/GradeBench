import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeHeroSection } from "../components/home/HeroSection";

describe("HomeHeroSection", () => {
  it("Render Headlines", () => {
    render(<HomeHeroSection />);
    const headlines = screen.getByTestId("headline");
    expect(headlines).toBeInTheDocument();
  });

  it("Render Sub-Headline", () => {
    render(<HomeHeroSection />);
    const subHeadlines = screen.getByTestId("sub-headline");
    expect(subHeadlines).toBeInTheDocument();
  });

  it("Render Primary CTA", () => {
    render(<HomeHeroSection />);
    const primaryCTA = screen.getByTestId("primary-cta");
    expect(primaryCTA).toBeInTheDocument();
    fireEvent.click(primaryCTA);
  });

  it("Render Secondary CTA", () => {
    render(<HomeHeroSection />);
    const secondaryCTA = screen.getByTestId("secondary-cta");
    expect(secondaryCTA).toBeInTheDocument();
    expect(secondaryCTA).toHaveAttribute("href", "/site/features");
  });
});
