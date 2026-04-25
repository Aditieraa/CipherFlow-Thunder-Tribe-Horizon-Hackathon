import { useEffect, useRef, useState } from "react";
import { useGame } from "@/game/useGame";
import { Button } from "@/components/ui/button";
import { ColorPalette } from "./ColorPalette";
import { GuessRow } from "./GuessRow";
import { TimerArc } from "./TimerArc";
import { DifficultyPicker } from "./DifficultyPicker";
import { Leaderboard } from "./Leaderboard";
import { EndGameModal } from "./EndGameModal";
import { Confetti } from "./Confetti";
import { TerminalLog } from "./TerminalLog";
import { ThemeToggle } from "./ThemeToggle";
import { getLeaderboard } from "@/game/leaderboard";
import { DIFFICULTIES, Difficulty, LeaderboardEntry } from "@/game/types";
import { buildChallengeUrl, ChallengePayload, parseChallengeHash } from "@/game/challenge";
import { COLOR_PALETTE } from "@/game/types";
import { ColorOrb } from "./ColorOrb";
import { ArrowLeft, ArrowRight, Copy, Eraser, Lightbulb, RotateCcw, Send, Shapes, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import orbLogo from "@/assets/cipher-orb-logo.png";
import gridBg from "@/assets/cipher-grid-bg.jpg";

const BUBBLE_VIDEO_SRC = "/bubble-backdrop.mp4";

interface GameBoardProps {
  onBackToFighters?: () => void;
}

export function GameBoard({ onBackToFighters }: GameBoardProps) {
  const game = useGame("medium");
  const [pickerDiff, setPickerDiff] = useState<Difficulty>("medium");
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [showLB, setShowLB] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [computingRow, setComputingRow] = useState<number | null>(null);
  const [glowRow, setGlowRow] = useState<{ index: number; color: "green" | "red" } | null>(null);
  const [draggedColorId, setDraggedColorId] = useState<number | null>(null);
  const [breach, setBreach] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: 50, y: 50 });
  const [symbolMode, setSymbolMode] = useState(false);
  const [challengeDraft, setChallengeDraft] = useState<number[]>(() => Array.from({ length: DIFFICULTIES.medium.slots }, () => 0));
  const [activeChallenge, setActiveChallenge] = useState<ChallengePayload | null>(null);
  const [copiedChallenge, setCopiedChallenge] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    if (game.status === "won" || game.status === "lost") {
      const t = setTimeout(() => setShowEnd(true), 700);
      return () => clearTimeout(t);
    }
  }, [game.status]);

  useEffect(() => {
    if (game.status === "won") {
      setBreach(true);
      const t = setTimeout(() => setBreach(false), 1500);
      return () => clearTimeout(t);
    }
  }, [game.status]);

  useEffect(() => {
    setChallengeDraft((prev) =>
      Array.from({ length: DIFFICULTIES[pickerDiff].slots }, (_, index) => {
        const current = prev[index] ?? 0;
        return current % DIFFICULTIES[pickerDiff].colors;
      }),
    );
  }, [pickerDiff]);

  useEffect(() => {
    function syncChallengeFromHash() {
      const parsed = parseChallengeHash(window.location.hash);
      setActiveChallenge(parsed);
      if (parsed) {
        setPickerDiff(parsed.difficulty);
      }
    }

    syncChallengeFromHash();
    window.addEventListener("hashchange", syncChallengeFromHash);
    return () => window.removeEventListener("hashchange", syncChallengeFromHash);
  }, []);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = boardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 6, ry: x * 6 });
    setLaserPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  function handleLeave() {
    setTilt({ rx: 0, ry: 0 });
  }

  const activeRow = game.rows[game.activeRow];
  const canSubmit = game.status === "playing" && activeRow && activeRow.guess.every((c) => c !== null);

  function handlePick(colorId: number) {
    if (game.status !== "playing") return;
    const slot = selectedSlot;
    game.setSlot(slot, colorId);
    const next = (slot + 1) % game.config.slots;
    setSelectedSlot(next);
  }

  function handleCycle(slotIndex: number) {
    if (game.status !== "playing") return;
    const current = activeRow?.guess[slotIndex] ?? null;

    if (current === null) {
      game.setSlot(slotIndex, 0);
      setSelectedSlot((slotIndex + 1) % game.config.slots);
      return;
    }

    const nextColor = current + 1;
    if (nextColor >= game.config.colors) {
      game.clearSlot(slotIndex);
      setSelectedSlot(slotIndex);
      return;
    }

    game.setSlot(slotIndex, nextColor);
    setSelectedSlot((slotIndex + 1) % game.config.slots);
  }

  function handleDropColor(slotIndex: number, colorId: number) {
    if (game.status !== "playing") return;
    game.setSlot(slotIndex, colorId);
    setSelectedSlot((slotIndex + 1) % game.config.slots);
    setDraggedColorId(null);
  }

  function handleClearRow() {
    if (!activeRow) return;
    for (let i = 0; i < game.config.slots; i++) game.clearSlot(i);
    setSelectedSlot(0);
  }

  function handleSubmit() {
    if (!canSubmit) return;
    const submittedIndex = game.activeRow;
    const fbBefore = game.rows[submittedIndex];
    setComputingRow(submittedIndex);
    game.submitRow();

    const guess = fbBefore?.guess ?? [];
    const secret = game.secret;
    let black = 0;
    let white = 0;
    const sUsed = Array(secret.length).fill(false);
    const gUsed = Array(guess.length).fill(false);

    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === secret[i]) {
        black++;
        sUsed[i] = true;
        gUsed[i] = true;
      }
    }

    for (let i = 0; i < guess.length; i++) {
      if (gUsed[i]) continue;
      for (let j = 0; j < secret.length; j++) {
        if (sUsed[j]) continue;
        if (guess[i] === secret[j]) {
          white++;
          sUsed[j] = true;
          break;
        }
      }
    }

    const anyMatch = black + white > 0;
    setGlowRow({ index: submittedIndex, color: anyMatch ? "green" : "red" });
    setTimeout(() => setComputingRow(null), 520);
    setTimeout(() => setGlowRow(null), 1200);
  }

  function handleUseHint() {
    game.useHint();
  }

  function handleCycleChallengeSlot(slotIndex: number) {
    setChallengeDraft((prev) =>
      prev.map((value, index) =>
        index === slotIndex ? (value + 1) % DIFFICULTIES[pickerDiff].colors : value,
      ),
    );
  }

  async function handleCopyChallenge() {
    const url = buildChallengeUrl({ difficulty: pickerDiff, secret: challengeDraft });
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
    setCopiedChallenge(true);
    window.setTimeout(() => setCopiedChallenge(false), 1800);
  }

  if (game.status === "idle") {
    return (
      <IdleScreen
        diff={pickerDiff}
        setDiff={setPickerDiff}
        onStart={() => game.start(pickerDiff)}
        onStartChallenge={activeChallenge ? () => game.startWithSecret(activeChallenge.difficulty, activeChallenge.secret) : undefined}
        activeChallenge={activeChallenge}
        challengeDraft={challengeDraft}
        onCycleChallengeSlot={handleCycleChallengeSlot}
        onCopyChallenge={handleCopyChallenge}
        copiedChallenge={copiedChallenge}
        leaderboardEntries={getLeaderboard(pickerDiff)}
        showLeaderboard={showLB}
        onLeaderboard={() => setShowLB((prev) => !prev)}
        symbolMode={symbolMode}
        onToggleSymbols={() => setSymbolMode((prev) => !prev)}
        onBack={onBackToFighters}
      />
    );
  }

  return (
    <div className="relative w-full scene-3d">
      {game.status === "won" && <Confetti />}
      {breach && <div aria-hidden className="pointer-events-none fixed inset-0 z-40 animate-breach-flash" />}

      <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-gradient-card px-4 py-3 shadow-3d preserve-3d sm:px-5">
        <div className="flex items-center gap-3">
          <img
            src={orbLogo}
            alt="CipherFlow orb logo"
            width={48}
            height={48}
            className="h-11 w-11 animate-float-orb drop-shadow-[0_0_18px_hsl(258_90%_66%/0.8)]"
          />
          <div>
            <div className="font-display text-base font-bold tracking-widest text-foreground sm:text-lg">
              CIPHER<span className="text-accent text-glow-purple">FLOW</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {game.config.label} · {game.config.slots} slots · {game.config.colors} colors
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowEnd(false);
                game.reset();
                setSelectedSlot(0);
              }}
              className="border-white/15 bg-black/30 hover:bg-black/50"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Modes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowEnd(false);
                game.start(game.difficulty);
                setSelectedSlot(0);
              }}
              className="border-white/15 bg-black/30 hover:bg-black/50"
            >
              <ArrowRight className="mr-1.5 h-4 w-4" /> Restart
            </Button>
          </div>
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSymbolMode((prev) => !prev)}
            className="border-white/15 bg-black/30 hover:bg-black/50"
          >
            <Shapes className="mr-1.5 h-4 w-4" /> {symbolMode ? "Colors" : "Symbols"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUseHint}
            disabled={game.hintedSlots.every((slot) => slot !== null)}
            className="border-white/15 bg-black/30 hover:bg-black/50"
          >
            <Lightbulb className="mr-1.5 h-4 w-4" /> Hint
          </Button>
          <div className="hidden flex-col items-end sm:flex">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Attempts</div>
            <div className="font-display text-lg text-foreground">
              <span className="text-accent text-glow-purple">{game.config.attempts - game.activeRow}</span>
              <span className="text-sm text-muted-foreground"> / {game.config.attempts}</span>
            </div>
          </div>
          <TimerArc total={game.config.time} remaining={game.timeLeft} size={72} />
        </div>
      </div>

      <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_auto]">
        <div className="rounded-2xl border border-white/10 bg-gradient-card px-4 py-3 shadow-3d">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="font-display text-xs uppercase tracking-[0.28em] text-muted-foreground">Intel</div>
            <div className="text-xs text-muted-foreground">
              Score: <span className="font-display text-foreground">{game.score}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {game.hintedSlots.map((value, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <ColorOrb colorId={value} size="md" symbolMode={symbolMode} empty={value === null} />
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-gradient-card px-4 py-3 shadow-3d">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Hint Cost</div>
          <div className="mt-2 font-display text-2xl text-foreground">-150</div>
          <div className="text-xs text-muted-foreground">per revealed position</div>
        </div>
      </div>

      <div
        ref={boardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={cn(
          "relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-card p-3 shadow-3d preserve-3d transition-transform duration-300 sm:p-4",
          game.status === "won" && "animate-win-zoom",
        )}
        style={{
          transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-screen opacity-[0.18]"
          style={{
            backgroundImage: `url(${gridBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl animate-float-orb" />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-[hsl(var(--accent-blue))]/20 blur-3xl animate-float-orb"
          style={{ animationDelay: "1.4s" }}
        />

        <div
          aria-hidden
          className="laser-grid"
          style={{
            ["--laser-x" as string]: `${laserPos.x}%`,
            ["--laser-y" as string]: `${laserPos.y}%`,
          }}
        />

        <div className="relative space-y-2 preserve-3d sm:space-y-2.5">
          {game.rows.map((row, i) => (
            <GuessRow
              key={i}
              row={row}
              index={i}
              isActive={i === game.activeRow && game.status === "playing"}
              slots={game.config.slots}
              availableColors={game.config.colors}
              onSlotClick={(slot) => setSelectedSlot(slot)}
              onSlotClear={(slot) => game.clearSlot(slot)}
              onSlotCycle={handleCycle}
              onSlotDropColor={handleDropColor}
              selectedSlot={i === game.activeRow ? selectedSlot : undefined}
              onSelectSlot={setSelectedSlot}
              computing={computingRow === i}
              resultGlow={glowRow?.index === i ? glowRow.color : null}
              draggedColorId={draggedColorId}
              symbolMode={symbolMode}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearRow}
            disabled={game.status !== "playing"}
            className="border-white/15 bg-black/30 hover:bg-black/50"
          >
            <Eraser className="mr-1.5 h-4 w-4" /> Clear
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => game.reset()}
            className="border-white/15 bg-black/30 hover:bg-black/50"
          >
            <RotateCcw className="mr-1.5 h-4 w-4" /> New Game
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLB(true)}
            className="border-white/15 bg-black/30 hover:bg-black/50"
          >
            <Trophy className="mr-1.5 h-4 w-4" /> Ranks
          </Button>
        </div>
        <Button
          size="lg"
          disabled={!canSubmit}
          onClick={handleSubmit}
          className={cn(
            "border-0 bg-gradient-accent px-6 font-display tracking-widest",
            canSubmit && "shadow-[0_0_28px_hsl(258_90%_66%/0.6)]",
          )}
        >
          <Send className="mr-2 h-4 w-4" /> Submit
        </Button>
      </div>

      <div className="mt-4 preserve-3d">
        <ColorPalette
          available={game.config.colors}
          onPick={handlePick}
          disabled={game.status !== "playing"}
          hint={`Slot ${selectedSlot + 1} of ${game.config.slots}`}
          onDragStart={setDraggedColorId}
          onDragEnd={() => setDraggedColorId(null)}
          symbolMode={symbolMode}
        />
      </div>

      <div className="mt-4">
        <TerminalLog active={game.status === "playing"} />
      </div>

      <Leaderboard open={showLB} onOpenChange={setShowLB} initialDifficulty={game.difficulty} />
      <EndGameModal
        open={showEnd}
        status={game.status === "lost" ? "lost" : "won"}
        secret={game.secret}
        attemptsUsed={game.rows.filter((r) => r.submitted).length}
        timeTaken={game.elapsed}
        score={game.score}
        hintsUsed={game.hintsUsed}
        symbolMode={symbolMode}
        difficulty={game.difficulty}
        onClose={() => setShowEnd(false)}
        onShowLeaderboard={() => {
          setShowEnd(false);
          setShowLB(true);
        }}
        onPlayAgain={() => {
          setShowEnd(false);
          game.start(game.difficulty);
          setSelectedSlot(0);
        }}
      />
    </div>
  );
}

function IdleScreen({
  diff,
  setDiff,
  onStart,
  onStartChallenge,
  activeChallenge,
  challengeDraft,
  onCycleChallengeSlot,
  onCopyChallenge,
  copiedChallenge,
  leaderboardEntries,
  showLeaderboard,
  onLeaderboard,
  symbolMode,
  onToggleSymbols,
  onBack,
}: {
  diff: Difficulty;
  setDiff: (d: Difficulty) => void;
  onStart: () => void;
  onStartChallenge?: () => void;
  activeChallenge: ChallengePayload | null;
  challengeDraft: number[];
  onCycleChallengeSlot: (slotIndex: number) => void;
  onCopyChallenge: () => void;
  copiedChallenge: boolean;
  leaderboardEntries: LeaderboardEntry[];
  showLeaderboard: boolean;
  onLeaderboard: () => void;
  symbolMode: boolean;
  onToggleSymbols: () => void;
  onBack?: () => void;
}) {
  return (
    <div className="relative w-full scene-3d">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-card text-center shadow-3d preserve-3d">
        <div className="relative h-52 w-full overflow-hidden sm:h-72">
          <video
            src={BUBBLE_VIDEO_SRC}
            className="absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, hsl(222 50% 4% / 0.08) 0%, hsl(222 50% 4% / 0.4) 68%, hsl(222 50% 4% / 0.72) 100%)",
            }}
          />
        </div>

        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/30 blur-3xl animate-float-orb" />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-[hsl(var(--accent-blue))]/25 blur-3xl animate-float-orb"
          style={{ animationDelay: "1.2s" }}
        />

        <div className="relative -mt-2 px-8 pb-7 pt-0 sm:px-12 sm:pb-9">
          <div className="relative mt-1">
            <div className="absolute left-0 top-2 flex items-center gap-2">
              {onBack && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBack}
                  className="border-white/15 bg-black/30 hover:bg-black/50"
                >
                  <ArrowLeft className="mr-1.5 h-4 w-4" /> Fighters
                </Button>
              )}
            </div>
            <div className="absolute right-0 top-2 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleSymbols}
                className="border-white/15 bg-black/30 hover:bg-black/50"
              >
                <Shapes className="mr-1.5 h-4 w-4" /> {symbolMode ? "Colors" : "Symbols"}
              </Button>
              <ThemeToggle />
            </div>
            <h1 className="text-center font-display text-4xl font-black tracking-tight text-foreground sm:text-6xl">
              CIPHER<span className="text-accent text-glow-purple">FLOW</span>
            </h1>
          </div>
          <div className="mt-8">
            <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Select Protocol</div>
            <DifficultyPicker value={diff} onChange={setDiff} />
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {onBack && (
              <Button
                variant="outline"
                size="lg"
                onClick={onBack}
                className="border-white/15 bg-black/30 font-display tracking-widest hover:bg-black/50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
            <Button
              size="lg"
              onClick={onStart}
              className="border-0 bg-gradient-accent px-8 font-display tracking-widest shadow-[0_0_30px_hsl(258_90%_66%/0.55)] hover:shadow-[0_0_44px_hsl(258_90%_66%/0.75)]"
            >
              <ArrowRight className="mr-2 h-4 w-4" /> Initiate Decode
            </Button>
            {onStartChallenge && activeChallenge && (
              <Button
                variant="outline"
                size="lg"
                onClick={onStartChallenge}
                className="border-primary/40 bg-primary/10 font-display tracking-widest text-primary hover:bg-primary/20"
              >
                <Lightbulb className="mr-2 h-4 w-4" /> Accept Challenge
              </Button>
            )}
              <Button
                variant="outline"
                size="lg"
                onClick={onLeaderboard}
                className="relative z-10 border-[hsl(42_95%_52%/0.5)] bg-[linear-gradient(135deg,hsl(42_100%_56%/0.22),hsl(35_100%_44%/0.14))] font-display tracking-widest text-[hsl(42_96%_56%)] shadow-[0_0_24px_hsl(42_100%_52%/0.18)] hover:bg-[linear-gradient(135deg,hsl(42_100%_56%/0.3),hsl(35_100%_44%/0.22))] hover:text-[hsl(44_100%_68%)]"
              >
                <Trophy className="mr-2 h-4 w-4" /> {showLeaderboard ? "Hide Leaderboard" : "Leaderboard"}
              </Button>
          </div>

          {showLeaderboard && (
            <div className="mt-8 rounded-2xl border border-[hsl(42_95%_52%/0.28)] bg-[linear-gradient(180deg,hsl(223_36%_12%/0.96),hsl(223_36%_10%/0.96))] p-4 text-left shadow-[0_0_32px_hsl(42_100%_52%/0.12)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="font-display text-xs uppercase tracking-[0.28em] text-[hsl(42_96%_56%)]">Today&apos;s Leaderboard</div>
                  <div className="mt-1 text-sm text-muted-foreground">{DIFFICULTIES[diff].label} tier mock standings</div>
                </div>
                <div className="rounded-full border border-[hsl(42_95%_52%/0.24)] bg-[hsl(42_100%_52%/0.08)] px-3 py-1 text-[10px] font-display uppercase tracking-[0.22em] text-[hsl(42_96%_56%)]">
                  Top 10
                </div>
              </div>

              <div className="space-y-2">
                {leaderboardEntries.map((entry, index) => (
                  <div
                    key={`${entry.name}-${index}`}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-3 py-2.5",
                      index === 0
                        ? "border-[hsl(42_95%_52%/0.35)] bg-[hsl(42_100%_52%/0.09)]"
                        : "border-white/8 bg-black/20",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg font-display text-sm",
                        index === 0 ? "bg-[hsl(42_96%_56%)] text-black" : "bg-white/6 text-white/70",
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-display text-sm text-white">{entry.name}</span>
                        {entry.fighter && (
                          <span
                            className={cn(
                              "rounded-full border px-2 py-0.5 text-[10px] font-display uppercase tracking-[0.2em]",
                              entry.fighter === "VIKI"
                                ? "border-fuchsia-400/35 bg-fuchsia-500/10 text-fuchsia-300"
                                : "border-cyan-400/35 bg-cyan-500/10 text-cyan-300",
                            )}
                          >
                            {entry.fighter}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-sm text-white">{entry.attempts} guesses</div>
                      <div className="text-[11px] text-white/55">
                        {Math.floor(entry.timeTaken / 60).toString().padStart(2, "0")}:
                        {(entry.timeTaken % 60).toString().padStart(2, "0")}
                        {typeof entry.score === "number" ? ` · ${entry.score}` : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/25 p-4 text-left">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="font-display text-xs uppercase tracking-[0.28em] text-muted-foreground">Challenge Builder</div>
                <div className="mt-1 text-sm text-muted-foreground">Set a code, copy the hash link, and let someone else solve it.</div>
              </div>
              <Button variant="outline" size="sm" onClick={onCopyChallenge} className="border-white/15 bg-black/30 hover:bg-black/50">
                <Copy className="mr-1.5 h-4 w-4" /> {copiedChallenge ? "Copied" : "Copy URL"}
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {challengeDraft.map((colorId, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onCycleChallengeSlot(index)}
                  className="flex flex-col items-center gap-1"
                  title={`Challenge slot ${index + 1}`}
                >
                  <ColorOrb colorId={colorId} size="md" symbolMode={symbolMode} />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{index + 1}</span>
                </button>
              ))}
            </div>

            {activeChallenge && (
              <div className="mt-3 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary">
                Incoming challenge detected for {activeChallenge.difficulty}.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
