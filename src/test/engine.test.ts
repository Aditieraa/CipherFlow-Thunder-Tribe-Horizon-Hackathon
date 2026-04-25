import { describe, expect, it } from "vitest";
import { evaluateGuess } from "@/game/engine";

describe("evaluateGuess", () => {
  it("counts exact matches before partial matches", () => {
    expect(evaluateGuess([1, 2, 3, 4], [1, 4, 2, 0])).toEqual({ black: 1, white: 2 });
  });

  it("does not over-count partial matches when the guess repeats a color", () => {
    expect(evaluateGuess([1, 1, 2, 3], [1, 2, 1, 1])).toEqual({ black: 1, white: 2 });
  });

  it("does not over-count partial matches when the secret repeats a color", () => {
    expect(evaluateGuess([0, 2, 2, 4], [2, 2, 2, 2])).toEqual({ black: 2, white: 0 });
  });

  it("handles fully duplicated codes correctly", () => {
    expect(evaluateGuess([5, 5, 5, 5], [5, 5, 4, 5])).toEqual({ black: 3, white: 0 });
  });

  it("throws when guess length does not match the secret length", () => {
    expect(() => evaluateGuess([1, 2, 3], [1, 2])).toThrow("Guess length must equal secret length");
  });
});
