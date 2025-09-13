import { describe, expect, it } from "vitest";
import { ProductsHero } from "../components/products/Hero";
import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";


describe("Features Hero Section", () => {
  it("Renders Headline", () => {
    render(<ProductsHero />);
    const headline = screen.getByTestId("headline");
    expect(headline).toBeInTheDocument();
  });
  it("Renders Text", () => {
    render(<ProductsHero />);
    const text = screen.getByTestId("text");
    expect(text).toBeInTheDocument();
  });
});