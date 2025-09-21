import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SolutionHero } from "../components/solutions/Hero";
import { SolutionRoadmap } from "../components/solutions/Roadmap";
import { SolutionTargeted } from "../components/solutions/TargetedSolution";

describe("Solution Hero Section", () => {
	it("Renders Headline", () => {
		render(<SolutionHero />);
		const headline = screen.getByTestId("headline");
		expect(headline).toBeInTheDocument();
	});

	it("Renders Text", () => {
		render(<SolutionHero />);
		const text = screen.getByTestId("text");
		expect(text).toBeInTheDocument();
	});
});

describe("Targeted Solutions Section", () => {
	it("Render Headline", () => {
		render(<SolutionTargeted />);
		const headline = screen.getByTestId("headline");
		expect(headline).toBeInTheDocument();
	});

	it("Render Challenge", () => {
		render(<SolutionTargeted />);
		const challenge = screen.getByTestId("challenge");
		expect(challenge).toBeInTheDocument();
	});

	it("Render Solution", () => {
		render(<SolutionTargeted />);
		const solution = screen.getByTestId("solution");
		expect(solution).toBeInTheDocument();
	});
});

describe("Solution Roadmap Section", () => {
	it("Render Headline", () => {
		render(<SolutionRoadmap />);
		const headline = screen.getByTestId("headline");
		expect(headline).toBeInTheDocument();
	});

	it("Render Text", () => {
		render(<SolutionRoadmap />);
		const text = screen.getByTestId("text");
		expect(text).toBeInTheDocument();
	});

	it("Render Cards", () => {
		render(<SolutionRoadmap />);
		const card = screen.getAllByTestId("card");
		expect(card.length).toBe(3);
	});
});
