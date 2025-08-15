import { render, screen, fireEvent } from "@testing-library/react";

import { RightNav } from "../components/templetes";
import { describe, it, expect } from "vitest";

describe("RightNav", () => {
  it("Render RightNav", () => {
    render(<RightNav cta={{ label: "Get Started", href: "#" }} />);
    expect(screen.getByText(/Get Started/)).toBeDefined();
  });
});
