import { describe, expect, it } from "vitest";
import { parseChallengeHash, serializeChallenge } from "@/game/challenge";

describe("challenge hash helpers", () => {
  it("round-trips a valid challenge payload", () => {
    const hash = serializeChallenge({ difficulty: "medium", secret: [0, 1, 2, 3, 4] });
    expect(parseChallengeHash(hash)).toEqual({ difficulty: "medium", secret: [0, 1, 2, 3, 4] });
  });

  it("rejects malformed hashes", () => {
    expect(parseChallengeHash("#cipherflow-challenge=not-valid")).toBeNull();
    expect(parseChallengeHash("#something-else")).toBeNull();
  });

  it("rejects secrets that do not match the difficulty", () => {
    const hash = serializeChallenge({ difficulty: "easy", secret: [0, 1, 2, 3, 4] as never });
    expect(parseChallengeHash(hash)).toBeNull();
  });
});
