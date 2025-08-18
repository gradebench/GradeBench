import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeHeroSection } from "../components/home/HeroSection";

describe("HomeHeroSection", () => {
  it("Render Headlines", () => {
    render(<HomeHeroSection />);
    const headlines = screen.getByTestId("hero-headline");
    expect(headlines).toBeInTheDocument();
  });

  it("Render Sub-Headline", () => {
    render(<HomeHeroSection />);
    const subHeadlines = screen.getByTestId("hero-sub-headline");
    expect(subHeadlines).toBeInTheDocument();
  });

  it("Render Primary CTA", () => {
    render(<HomeHeroSection />);
    const primaryCTA = screen.getByTestId("hero-primary-cta");
    expect(primaryCTA).toBeInTheDocument();
  });

  it("Render Secondary CTA", () => {
    render(<HomeHeroSection />);
    const primaryCTA = screen.getByTestId("hero-secondary-cta");
    expect(primaryCTA).toBeInTheDocument();
  });
});
