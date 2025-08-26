import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeHeroSection } from "../components/home/HeroSection";
import { ProblemSection } from "../components/home/ProblemSection";
import { SolutionSection } from "../components/home/SolutionSection";
import { SocialProof } from "../components/home/SocialProof";
import { FinalCTA } from "../components/home/FinalCTA";

describe("Home Hero Section", () => {
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

describe("Home Problem Section", () => {
  it("Render Headline", () => {
    render(<ProblemSection />);
    const headline = screen.getByTestId("headline");
    expect(headline).toBeInTheDocument();
  });

  it("Render Text", () => {
    render(<ProblemSection />);
    const text = screen.getByTestId("text");
    expect(text).toBeInTheDocument();
  });

  it("Render Cards", () => {
    render(<ProblemSection />);
    const card = screen.getAllByTestId("card");
    expect(card.length).toBe(3);
  });
});

describe("Home Solution Section", () => {
  it("Render Headline", () => {
    render(<SolutionSection />);
    const headline = screen.getByTestId("headline");
    expect(headline).toBeInTheDocument();
  });

  it("Render Text", () => {
    render(<SolutionSection />);
    const text = screen.getByTestId("text");
    expect(text).toBeInTheDocument();
  });

  it("Render Cards", () => {
    render(<SolutionSection />);
    const card = screen.getAllByTestId("card");
    expect(card.length).toBe(5);
  });
});

describe("Home Social Proof", () => {
  it("Render Headline", () => {
    render(<SocialProof />);
    const headline = screen.getByTestId("headline");
    expect(headline).toBeInTheDocument();
  });

  it("Render Text", () => {
    render(<SocialProof />);
    const text = screen.getByTestId("text");
    expect(text).toBeInTheDocument();
  });
});

describe("Home Final CTA", () => {
  it("Render CTA", () => {
    render(<FinalCTA />);
    const headline = screen.getByTestId("headline");
    expect(headline).toBeInTheDocument();
  });

  it("Render Text", () => {
    render(<FinalCTA />);
    const text = screen.getByTestId("text");
    expect(text).toBeInTheDocument();
  });

  it("Render CTA", () => {
    render(<FinalCTA />);
    const primaryCTA = screen.getByTestId("cta");
    expect(primaryCTA).toBeInTheDocument();
    fireEvent.click(primaryCTA);
  });
});
