import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutHero } from "../components/about/Hero";
import { AboutTeam } from "../components/about/Team";
import { AboutVision } from "../components/about/Vision";

describe("About Hero Section", () => {
	it("Render Headline", () => {
		render(<AboutHero />);
		const headline = screen.getByTestId("headline");
		expect(headline).toBeInTheDocument();
	});

	it("Render Text", () => {
		render(<AboutHero />);
		const text = screen.getByTestId("text");
		expect(text).toBeInTheDocument();
	});
});

describe("About Vision Section", () => {
	it("Render Headline", () => {
		render(<AboutVision />);
		const headline = screen.getByTestId("headline");
		expect(headline).toBeInTheDocument();
	});

	it("Render Text", () => {
		render(<AboutVision />);
		const text = screen.getByTestId("text");
		expect(text).toBeInTheDocument();
	});
});

describe("About Team Section", () => {
	it("Render Headline", () => {
		render(<AboutTeam />);
		const headline = screen.getByTestId("headline");
		expect(headline).toBeInTheDocument();
	});

	it("Render Cards", () => {
		render(<AboutTeam />);
		const card = screen.getAllByTestId("card");
		expect(card.length).toBe(3);
	});
});
