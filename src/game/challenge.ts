import { DIFFICULTIES, Difficulty } from "./types";

export interface ChallengePayload {
  difficulty: Difficulty;
  secret: number[];
}

const PREFIX = "#cipherflow-challenge=";

function toBase64Url(text: string) {
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    return window.btoa(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }
  return Buffer.from(text, "utf8").toString("base64url");
}

function fromBase64Url(text: string) {
  if (typeof window !== "undefined" && typeof window.atob === "function") {
    const normalized = text.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
    return window.atob(padded);
  }
  return Buffer.from(text, "base64url").toString("utf8");
}

export function serializeChallenge(payload: ChallengePayload) {
  return `${PREFIX}${toBase64Url(JSON.stringify(payload))}`;
}

export function parseChallengeHash(hash: string): ChallengePayload | null {
  if (!hash.startsWith(PREFIX)) return null;

  try {
    const raw = JSON.parse(fromBase64Url(hash.slice(PREFIX.length))) as Partial<ChallengePayload>;
    if (!raw || typeof raw !== "object") return null;
    if (!raw.difficulty || !(raw.difficulty in DIFFICULTIES)) return null;
    if (!Array.isArray(raw.secret)) return null;

    const config = DIFFICULTIES[raw.difficulty as Difficulty];
    const normalized = raw.secret.map(Number);
    const valid =
      normalized.length === config.slots &&
      normalized.every((value) => Number.isInteger(value) && value >= 0 && value < config.colors);

    if (!valid) return null;

    return {
      difficulty: raw.difficulty as Difficulty,
      secret: normalized,
    };
  } catch {
    return null;
  }
}

export function buildChallengeUrl(payload: ChallengePayload, locationLike = window.location) {
  return `${locationLike.origin}${locationLike.pathname}${serializeChallenge(payload)}`;
}
