import { Difficulty, LeaderboardEntry } from "./types";

const KEY = "cipherflow:leaderboard:v2";
const MOCK_NAMES = [
  "Aditi", "Isha", "Reyansh", "Kavya", "Vihaan",
  "Anaya", "Arjun", "Mira", "Rohan", "Zoya",
  "Aarav", "Siya", "Kabir", "Myra", "Dev",
];

function createMockEntries(): LeaderboardEntry[] {
  const today = new Date();
  const baseDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0, 0).getTime();
  const configs: Record<Difficulty, { attempts: number[]; times: number[]; scores: number[] }> = {
    easy: {
      attempts: [3, 4, 4, 5, 5, 6],
      times: [82, 95, 103, 116, 128, 141],
      scores: [1760, 1680, 1620, 1540, 1490, 1410],
    },
    medium: {
      attempts: [4, 5, 5, 6, 6, 7],
      times: [121, 128, 146, 165, 179, 193],
      scores: [1720, 1650, 1545, 1495, 1425, 1360],
    },
    hard: {
      attempts: [5, 6, 6, 7, 8, 8],
      times: [171, 184, 202, 219, 241, 258],
      scores: [1590, 1515, 1450, 1370, 1285, 1210],
    },
  };

  let nameIndex = 0;
  const entries: LeaderboardEntry[] = [];
  (Object.keys(configs) as Difficulty[]).forEach((difficulty, difficultyIndex) => {
    const config = configs[difficulty];
    config.attempts.forEach((attempts, i) => {
      entries.push({
        name: MOCK_NAMES[nameIndex % MOCK_NAMES.length],
        fighter: (i + difficultyIndex) % 2 === 0 ? "VIKI" : "EVA",
        attempts,
        timeTaken: config.times[i],
        score: config.scores[i],
        hintsUsed: i % 3 === 0 ? 1 : 0,
        difficulty,
        date: baseDay - (difficultyIndex * 6 + i) * 60_000,
      });
      nameIndex += 1;
    });
  });

  return entries;
}

function read(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const seeded = createMockEntries();
      write(seeded);
      return seeded;
    }
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr) || arr.length === 0) {
      const seeded = createMockEntries();
      write(seeded);
      return seeded;
    }
    return arr as LeaderboardEntry[];
  } catch {
    return createMockEntries();
  }
}

function write(entries: LeaderboardEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries));
}

function startOfLocalDay(timestamp: number) {
  const day = new Date(timestamp);
  day.setHours(0, 0, 0, 0);
  return day.getTime();
}

function sortEntries(entries: LeaderboardEntry[]) {
  return [...entries].sort((a, b) =>
    a.attempts !== b.attempts ? a.attempts - b.attempts : a.timeTaken - b.timeTaken
  );
}

export function getLeaderboard(difficulty?: Difficulty, day = Date.now()): LeaderboardEntry[] {
  const targetDay = startOfLocalDay(day);
  const all = read();
  const filtered = all.filter((entry) => {
    const sameDifficulty = difficulty ? entry.difficulty === difficulty : true;
    return sameDifficulty && startOfLocalDay(entry.date) === targetDay;
  });

  return sortEntries(filtered);
}

export function addEntry(entry: LeaderboardEntry) {
  const all = read();
  all.push(entry);

  const grouped: Record<string, LeaderboardEntry[]> = {};
  for (const current of all) {
    const bucket = `${current.difficulty}:${startOfLocalDay(current.date)}`;
    grouped[bucket] ??= [];
    grouped[bucket].push(current);
  }

  const trimmed: LeaderboardEntry[] = [];
  for (const bucket of Object.keys(grouped)) {
    trimmed.push(...sortEntries(grouped[bucket]).slice(0, 10));
  }

  write(trimmed.sort((a, b) => b.date - a.date));
}
