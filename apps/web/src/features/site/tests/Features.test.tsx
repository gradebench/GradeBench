import { describe, expect, it } from "vitest";
import { FeaturesHero } from "../components/features/Hero";
import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { FeatureDetails } from "../components/features/Details";

describe("Features Hero Section", () => {
  it("Renders Headline", () => {
    render(<FeaturesHero />);
    const headline = screen.getByTestId("headline");
    expect(headline).toBeInTheDocument();
  });
  it("Renders Text", () => {
    render(<FeaturesHero />);
    const text = screen.getByTestId("text");
    expect(text).toBeInTheDocument();
  });
});

describe("Detailed Features Section", () => {
  it("Renders cards", () => {
    render(<FeatureDetails />);
    const cards = screen.getAllByTestId("card");
    expect(cards.length).toBe(5);
  });
});
