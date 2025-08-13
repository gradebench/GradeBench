import { describe, expect, it } from "vitest";
import { add } from "./add";

describe("add", () => {
  it("adds two numbers", () => {
    expect(add(1, 2)).toEqual(3);
  });

  it("adds two negative numbers", () => {
    expect(add(-1, -2)).toEqual(-3);
  });

  it("adds two decimal numbers", () => {
    expect(add(1.5, 2.5)).toEqual(4);
  });

  it("adds a positive and a negative number", () => {
    expect(add(1, -2)).toEqual(-1);
  });
});
