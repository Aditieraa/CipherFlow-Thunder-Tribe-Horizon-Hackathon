import { CSSProperties, FormEvent, PointerEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, Star, Zap } from "lucide-react";
import { GameBoard } from "@/components/game/GameBoard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Screen = "landing" | "auth" | "fighters" | "game";
type AuthMode = "login" | "signup";
type FighterId = "VIKI" | "EVA";

type Fighter = {
  id: FighterId;
  name: string;
  image: string;
  scene: string;
  power: number;
  stable: number;
  penetrate: number;
  portable: number;
  stars: number;
  tagline: string;
};

const LANDING_VIDEO_SRC = "/playnest-hero.mp4";
const GAMEPLAY_AUDIO_SRC = "/east-duo-chubina-live.mp3";
const fighters: Record<FighterId, Fighter> = {
  VIKI: {
    id: "VIKI",
    name: "VIKI",
    image: "/viki-avatar.png",
    scene: "https://prod.spline.design/FBB1GC1dZ-xTA6cQ/scene.splinecode",
    power: 75,
    stable: 95,
    penetrate: 30,
    portable: 80,
    stars: 3,
    tagline: "Viki Avatar",
  },
  EVA: {
    id: "EVA",
    name: "EVA",
    image: "/eva-avatar.png",
    scene: "https://prod.spline.design/4cHg6FawFWC5CKdO/scene.splinecode",
    power: 85,
    stable: 90,
    penetrate: 40,
    portable: 70,
    stars: 4,
    tagline: "EVA Avatar",
  },
};

const authPanelCopy = {
  login: {
    title: "Welcome back",
    body: "Pick up your local streak and jump straight back into the next deduction puzzle.",
    cta: "Enter Game",
  },
  signup: {
    title: "Create your profile",
    body: "Set up your CipherFlow identity and carry the same puzzle flow across the full experience.",
    cta: "Create Profile",
  },
};

type LampVars = CSSProperties & {
  "--lamp-glow"?: string;
  "--lamp-glow-dark"?: string;
  "--lamp-on"?: number;
  "--lamp-opening"?: string;
  "--lamp-base-top"?: string;
  "--lamp-base-side"?: string;
  "--lamp-post"?: string;
  "--lamp-top-1"?: string;
  "--lamp-top-2"?: string;
  "--lamp-top-3"?: string;
  "--lamp-body-bg"?: string;
};

function LandingVideoBackdrop() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    void video.play().catch(() => {
      video.muted = true;
      void video.play().catch(() => {});
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-center scale-[1.02]"
        src={LANDING_VIDEO_SRC}
        autoPlay
        loop
        playsInline
        preload="auto"
        muted
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(230_50%_10%/0.06)_0%,hsl(230_50%_8%/0.08)_100%)]" />
    </div>
  );
}

function LandingScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <main className="relative min-h-screen bg-[hsl(233_70%_8%)] text-white">
      <div className="relative min-h-screen overflow-hidden">
        <LandingVideoBackdrop />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,hsl(286_100%_62%),hsl(198_100%_52%),hsl(47_100%_54%))] text-white shadow-[0_12px_28px_hsl(264_100%_55%/0.38)]">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-lg font-black uppercase tracking-[0.2em] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                  CipherFlow
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/76">
                  Arcade Decode Puzzle
                </div>
              </div>
            </div>
          </header>

          <section className="grid flex-1 items-start gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-14">
            <div className="order-2 space-y-6 self-start lg:order-1 lg:pt-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/34 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-white shadow-[0_16px_36px_rgba(0,0,0,0.26)] backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
                CipherFlow Gameplay
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl font-display text-[2.9rem] font-black leading-[0.9] text-white sm:text-[4.4rem] lg:text-[5.6rem]">
                  <span className="block drop-shadow-[0_12px_32px_rgba(0,0,0,0.34)]">REDEFINED</span>
                  <span className="block bg-[linear-gradient(135deg,hsl(292_100%_70%),hsl(188_100%_64%),hsl(111_100%_62%),hsl(46_100%_60%))] bg-clip-text text-transparent drop-shadow-[0_12px_34px_rgba(0,0,0,0.3)]">
                    GAMING
                  </span>
                </h1>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={onContinue}
                  className="h-12 rounded-full border-0 bg-[linear-gradient(135deg,hsl(286_100%_60%),hsl(203_100%_54%),hsl(47_100%_56%))] px-7 font-display text-sm font-black uppercase tracking-[0.22em] text-white shadow-[0_16px_36px_hsl(262_100%_52%/0.42)]"
                >
                  Start Puzzle
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="order-1 flex justify-end lg:order-2">
              <div className="hidden h-72 w-72 lg:block" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function LoopMusic({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let disposed = false;

    const tryPlay = () => {
      if (disposed) return;
      void audio.play().catch(() => {});
    };

    audio.currentTime = 0;
    audio.volume = 0.45;
    tryPlay();

    const resume = () => tryPlay();
    window.addEventListener("pointerdown", resume, { passive: true });
    window.addEventListener("keydown", resume);

    return () => {
      disposed = true;
      audio.pause();
      audio.currentTime = 0;
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
  }, [src]);

  return <audio ref={audioRef} src={src} autoPlay loop preload="auto" className="hidden" />;
}

let splineViewerLoader: Promise<void> | null = null;

function ensureSplineViewer() {
  if (typeof window === "undefined") return Promise.resolve();
  if (customElements.get("spline-viewer")) return Promise.resolve();
  if (splineViewerLoader) return splineViewerLoader;

  splineViewerLoader = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-spline-viewer="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load spline viewer")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer@1.9.96/build/spline-viewer.js";
    script.dataset.splineViewer = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load spline viewer"));
    document.head.appendChild(script);
  });

  return splineViewerLoader;
}

function FighterModelStage({
  fighter,
  compact = false,
}: {
  fighter: Fighter;
  compact?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [viewerFailed, setViewerFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setViewerFailed(false);

    ensureSplineViewer()
      .then(() => {
        if (cancelled || !hostRef.current) return;
        hostRef.current.innerHTML = "";
        const viewer = document.createElement("spline-viewer");
        viewer.setAttribute("url", fighter.scene);
        viewer.className = "h-full w-full";
        hostRef.current.appendChild(viewer);
      })
      .catch(() => {
        if (!cancelled) setViewerFailed(true);
      });

    return () => {
      cancelled = true;
      if (hostRef.current) hostRef.current.innerHTML = "";
    };
  }, [fighter.scene]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[32px] bg-black",
        compact ? "min-h-[340px] lg:min-h-[360px]" : "min-h-[440px] lg:min-h-[500px]",
      )}
    >
      <div className="pointer-events-none absolute inset-x-10 top-8 h-24 rounded-full bg-white/10 blur-3xl" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[24rem] w-[22rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,235,156,0.5) 0%, rgba(255,220,120,0.22) 42%, rgba(255,220,120,0) 78%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-8 h-[26rem] w-[20rem] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,238,173,0.34) 0%, rgba(255,223,128,0.16) 34%, rgba(255,223,128,0.04) 72%, rgba(255,223,128,0) 100%)",
          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          filter: "blur(18px)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-center">
        <div className={cn(
          "rounded-[50%] bg-[radial-gradient(circle_at_center,rgba(87,54,88,0.78)_0%,rgba(26,18,30,0.95)_58%,rgba(0,0,0,1)_100%)] shadow-[0_16px_32px_rgba(0,0,0,0.55)]",
          compact ? "h-16 w-[72%]" : "h-20 w-[75%]",
        )} />
      </div>
      {viewerFailed ? (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center px-8 pt-8",
          compact ? "pb-8" : "pb-16",
        )}>
          <img src={fighter.image} alt={fighter.tagline} className="max-h-full max-w-full object-contain" />
        </div>
      ) : (
        <div ref={hostRef} className={cn("absolute inset-0", compact ? "pb-4" : "pb-10")} />
      )}
    </div>
  );
}

function FighterBars({ fighter }: { fighter: Fighter }) {
  const rows = [
    ["Power", fighter.power],
    ["Stable", fighter.stable],
    ["Panetrate", fighter.penetrate],
    ["Portable", fighter.portable],
  ] as const;

  return (
    <div className="space-y-3">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-center gap-3">
          <span className="w-24 text-left text-sm text-white/58">{label}</span>
          <div className="h-4 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,hsl(286_100%_60%),hsl(197_90%_58%),hsl(46_100%_60%))]"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="w-8 text-right text-sm text-white">{value}</span>
        </div>
      ))}
    </div>
  );
}

function FighterBadge({ fighter, selected }: { fighter: Fighter; selected: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "group relative overflow-hidden rounded-[24px] border p-4 text-left transition-all duration-300",
        selected
          ? "border-[hsl(42_100%_62%/0.55)] bg-[linear-gradient(180deg,hsl(232_42%_18%/0.95),hsl(232_42%_11%/0.95))] shadow-[0_0_28px_hsl(42_100%_55%/0.2)]"
          : "border-white/12 bg-[rgba(18,25,33,0.72)] hover:border-white/24 hover:bg-[rgba(18,25,33,0.86)]",
      )}
      aria-pressed={selected}
    >
      <div className="flex items-center gap-3">
        <img
          src={fighter.image}
          alt={fighter.tagline}
          className="h-16 w-16 rounded-2xl object-contain bg-black/20 p-1"
        />
        <div className="min-w-0 flex-1">
          <div className="font-display text-xl font-black tracking-[0.18em] text-white">{fighter.name}</div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-white/55">{fighter.tagline}</div>
        </div>
        <div className="flex gap-1 text-[hsl(42_100%_62%)]">
          {Array.from({ length: fighter.stars }).map((_, index) => (
            <Star key={index} className="h-4 w-4 fill-current" />
          ))}
        </div>
      </div>
    </button>
  );
}

function FighterSummary({
  fighter,
  onContinue,
}: {
  fighter: Fighter;
  onContinue: () => void;
}) {
  return (
    <aside className="rounded-[28px] border border-white/12 bg-[rgba(18,25,33,0.9)] p-5 shadow-[0_28px_80px_hsl(232_60%_3%/0.45)] backdrop-blur-xl">
      <div className="rounded-[26px] border border-white/8 bg-black/18 p-4">
        <div className="flex items-center gap-4">
          <div className="grid h-28 w-28 shrink-0 place-items-center rounded-[26px] bg-[linear-gradient(180deg,hsl(232_30%_14%),hsl(232_22%_9%))] p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
            <img
              src={fighter.image}
              alt={fighter.tagline}
              className="h-full w-full object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.35)]"
            />
          </div>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.3em] text-white/50">Selected Fighter</div>
            <h3 className="mt-2 font-display text-3xl font-black tracking-[0.18em] text-white">{fighter.name}</h3>
            <div className="mt-1 text-sm text-white/68">{fighter.tagline}</div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <FighterBars fighter={fighter} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/78">
          <div className="text-[10px] uppercase tracking-[0.28em] text-white/45">Mode</div>
          <div className="mt-1 font-display text-lg tracking-[0.12em]">CipherFlow Support</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/78">
          <div className="text-[10px] uppercase tracking-[0.28em] text-white/45">Role</div>
          <div className="mt-1 font-display text-lg tracking-[0.12em]">Fighter</div>
        </div>
      </div>

      <div className="mt-5">
        <Button
          onClick={onContinue}
          className="h-12 rounded-full border-0 bg-[linear-gradient(135deg,hsl(286_100%_60%),hsl(203_100%_54%),hsl(47_100%_56%))] px-7 font-display text-sm font-black uppercase tracking-[0.22em] text-white shadow-[0_16px_36px_hsl(262_100%_52%/0.42)]"
        >
          Enter CipherFlow
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}

function FightersScreen({
  selectedFighter,
  onSelectFighter,
  onContinue,
  onBack,
}: {
  selectedFighter: FighterId;
  onSelectFighter: (fighter: FighterId) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const activeFighter = fighters[selectedFighter];

  return (
     <main className="relative min-h-screen bg-[hsl(233_70%_8%)] text-white">
      <LoopMusic src={GAMEPLAY_AUDIO_SRC} />
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-white/15 bg-black/30 font-display tracking-widest hover:bg-black/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={onContinue}
            className="border-0 bg-[linear-gradient(135deg,hsl(286_100%_60%),hsl(203_100%_54%),hsl(47_100%_56%))] font-display tracking-widest text-white shadow-[0_16px_36px_hsl(262_100%_52%/0.42)]"
          >
            <ArrowRight className="mr-2 h-4 w-4" /> Next
          </Button>
        </div>
        <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-5">
            <FighterSummary fighter={activeFighter} onContinue={onContinue} />

            <div className="grid gap-4 md:grid-cols-2">
            {Object.values(fighters).map((fighter) => (
              <button
                key={fighter.id}
                type="button"
                onClick={() => onSelectFighter(fighter.id)}
                className="block w-full text-left"
              >
                <div
                  className={cn(
                    "h-full rounded-[30px] border p-5 shadow-[0_18px_48px_rgba(0,0,0,0.28)] transition-all duration-300 sm:p-6",
                    selectedFighter === fighter.id
                      ? "border-[hsl(42_100%_62%/0.55)] bg-[rgba(18,25,33,0.92)]"
                      : "border-white/10 bg-[rgba(18,25,33,0.72)] hover:border-white/20 hover:bg-[rgba(18,25,33,0.86)]",
                  )}
                >
                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={fighter.image}
                        alt={fighter.tagline}
                        className="h-28 w-28 rounded-[28px] bg-black/20 p-2 object-contain shadow-[0_16px_36px_rgba(0,0,0,0.28)]"
                      />
                      <div className="min-w-0">
                        <div className="font-display text-3xl font-black tracking-[0.18em] text-white">{fighter.name}</div>
                        <div className="mt-1 text-sm text-white/65">{fighter.tagline}</div>
                      </div>
                    </div>
                    <FighterBars fighter={fighter} />
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] uppercase tracking-[0.28em] text-white/50">
                        {selectedFighter === fighter.id ? "Selected" : "Tap to select"}
                      </div>
                      <div className="flex gap-1 text-[hsl(42_100%_62%)]">
                        {Array.from({ length: fighter.stars }).map((_, index) => (
                          <Star key={index} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
            </div>
          </div>

          <div className="xl:sticky xl:top-6 xl:self-start">
            <FighterModelStage fighter={activeFighter} />
          </div>
        </div>
      </div>
    </main>
  );
}

function AuthLamp({
  active,
  onToggle,
  glow,
}: {
  active: boolean;
  onToggle: () => void;
  glow: string;
}) {
  const [pullOffset, setPullOffset] = useState(0);
  const dragStartY = useRef<number | null>(null);
  const lampStyle: LampVars = {
    "--lamp-glow": glow,
    "--lamp-glow-dark": glow.replace("58%)", "44%)"),
    "--lamp-on": active ? 1 : 0,
    "--lamp-opening": active ? "hsl(48 100% 74%)" : "hsl(42 18% 24%)",
    "--lamp-base-top": active ? "hsl(0 0% 72%)" : "hsl(0 0% 38%)",
    "--lamp-base-side": active ? "hsl(0 0% 46%)" : "hsl(0 0% 22%)",
    "--lamp-post": active ? "hsl(0 0% 48%)" : "hsl(0 0% 18%)",
    "--lamp-top-1": active ? "hsl(315 40% 58%)" : "hsl(315 14% 22%)",
    "--lamp-top-2": active ? "hsl(315 30% 42%)" : "hsl(315 10% 18%)",
    "--lamp-top-3": active ? "hsl(315 24% 28%)" : "hsl(315 8% 12%)",
    "--lamp-body-bg": active ? "rgba(16, 20, 28, 0.78)" : "rgba(16, 20, 28, 0.58)",
  };
  const handleY = 347 + pullOffset;
  const ropeCurveY = 348 + pullOffset;

  function beginPull(event: PointerEvent<SVGCircleElement>) {
    dragStartY.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function continuePull(event: PointerEvent<SVGCircleElement>) {
    if (dragStartY.current === null) return;
    const delta = Math.max(0, Math.min(90, event.clientY - dragStartY.current));
    setPullOffset(delta);
  }

  function endPull() {
    if (dragStartY.current !== null && pullOffset > 42) {
      onToggle();
    }
    dragStartY.current = null;
    setPullOffset(0);
  }

  return (
    <div style={lampStyle} className="relative mx-auto flex w-full max-w-[31rem] flex-col items-center">
      <div className="pointer-events-none absolute inset-x-8 top-16 h-64 rounded-full opacity-90 blur-3xl transition-all duration-500"
        style={{
          background: `radial-gradient(circle, color-mix(in srgb, var(--lamp-glow) 55%, transparent) 0%, transparent 68%)`,
          opacity: active ? 0.9 : 0.18,
        }}
      />

      <svg
        viewBox="0 0 333 484"
        className="h-[26rem] w-auto max-w-full drop-shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="165" cy="220" rx="130" ry="20" fill="var(--lamp-opening)" />
        <path
          d="M165 464c44.183 0 80-8.954 80-20v-14h-22.869c-14.519-3.703-34.752-6-57.131-6-22.379 0-42.612 2.297-57.131 6H85v14c0 11.046 35.817 20 80 20z"
          fill="var(--lamp-base-side)"
        />
        <ellipse cx="165" cy="430" rx="80" ry="20" fill="var(--lamp-base-top)" />
        <path
          d="M180 142h-30v286c0 3.866 6.716 7 15 7 8.284 0 15-3.134 15-7V142z"
          fill="var(--lamp-post)"
        />
        <path
          d="M290.5 193H39L0 463.5c0 11.046 75.478 20 165.5 20s167-11.954 167-23l-42-267.5z"
          fill={`url(#lampLight${active ? "On" : "Off"})`}
          opacity={active ? 0.92 : 0.16}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M164.859 0c55.229 0 100 8.954 100 20l29.859 199.06C291.529 208.451 234.609 200 164.859 200S38.189 208.451 35 219.06L64.859 20c0-11.046 44.772-20 100-20z"
          fill="var(--lamp-top-3)"
        />
        <path
          d="M165 178c19.882 0 36-16.118 36-36h-72c0 19.882 16.118 36 36 36z"
          fill="#141414"
          opacity={active ? 1 : 0.2}
        />
        <circle cx="179.4" cy="172.6" r="18" fill="#e06952" opacity={active ? 1 : 0.2} />
        <path
          d="M115 135c0-5.523-5.82-10-13-10s-13 4.477-13 10"
          stroke="#0a0a0a"
          strokeWidth="4"
          strokeLinecap="round"
          transform={active ? undefined : "rotate(180 102 135)"}
        />
        <path
          d="M241 135c0-5.523-5.82-10-13-10s-13 4.477-13 10"
          stroke="#0a0a0a"
          strokeWidth="4"
          strokeLinecap="round"
          transform={active ? undefined : "rotate(180 228 135)"}
        />
        <path d="M124 187V348" stroke="#6f6f6f" strokeWidth="6" strokeLinecap="round" />
        <path
          d={`M124 ${ropeCurveY}c0 0 16-12 16-28 0-18-16-24-16-40`}
          stroke="#6f6f6f"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle
          cx="124"
          cy={handleY}
          r="14"
          fill="#949494"
          stroke="#c9c9c9"
          strokeWidth="2"
          className="cursor-grab active:cursor-grabbing"
          onPointerDown={beginPull}
          onPointerMove={continuePull}
          onPointerUp={endPull}
          onPointerCancel={endPull}
        />
        <defs>
          <linearGradient id="lampLightOn" x1="166" y1="193" x2="166" y2="483" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(255,240,178,0.9)" />
            <stop offset="1" stopColor="rgba(255,240,178,0)" />
          </linearGradient>
          <linearGradient id="lampLightOff" x1="166" y1="193" x2="166" y2="483" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(255,255,255,0.18)" />
            <stop offset="1" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function AuthScreen({ onContinue, onBack }: { onContinue: () => void; onBack: () => void }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [lampOn, setLampOn] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const copy = authPanelCopy[mode];
  const lampGlow = mode === "login" ? "hsl(320 42% 58%)" : "hsl(197 90% 58%)";
  const lampGlowDark = lampGlow.replace("58%)", "42%)");
  const lampGlowSoft = lampGlow.replace(")", " / 0.24)");
  const authCardShadow = lampOn
    ? `0 0 15px rgba(255,255,255,0.08), 0 0 34px ${lampGlow}, inset 0 0 18px rgba(255,255,255,0.04)`
    : "0 18px 60px rgba(0,0,0,0.34)";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onContinue();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#121921] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(222_34%_18%)_0%,hsl(216_28%_12%)_38%,hsl(215_26%_9%)_100%)]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        aria-hidden
        className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full blur-3xl transition-all duration-500"
        style={{ background: `radial-gradient(circle, ${lampGlowSoft}, transparent 70%)` }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <AuthLamp active={lampOn} onToggle={() => setLampOn((value) => !value)} glow={lampGlow} />

          <div
            className={cn(
              "rounded-[28px] border p-6 transition-all duration-500 sm:p-8",
              lampOn
                ? "border-white/18 bg-[rgba(18,25,33,0.9)]"
                : "border-white/8 bg-[rgba(18,25,33,0.68)] shadow-[0_18px_60px_rgba(0,0,0,0.34)] opacity-90",
            )}
            style={{ boxShadow: authCardShadow }}
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white/72 transition hover:border-white/24 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
              <div className="inline-flex rounded-full border border-white/10 bg-black/25 p-1">
                {(["login", "signup"] as AuthMode[]).map((entry) => (
                  <button
                    key={entry}
                    type="button"
                    onClick={() => setMode(entry)}
                    className={cn(
                      "rounded-full px-5 py-2 font-display text-xs uppercase tracking-[0.24em] transition-all",
                      mode === entry
                        ? "text-white shadow-[0_12px_24px_rgba(0,0,0,0.28)]"
                        : "text-white/65",
                    )}
                    style={
                      mode === entry
                        ? { background: `linear-gradient(135deg, ${lampGlow}, ${lampGlowDark})` }
                        : undefined
                    }
                  >
                    {entry}
                  </button>
                ))}
              </div>
            </div>

            <div className={cn("transition-all duration-500", lampOn ? "opacity-100 translate-y-0" : "opacity-40 translate-y-2")}>
              <h2 className="text-center font-display text-3xl font-black uppercase tracking-[0.08em] text-white"
                style={{ textShadow: `0 0 10px ${lampGlow}` }}>
                {copy.title}
              </h2>
              <p className="mx-auto mt-4 max-w-md text-center text-sm leading-7 text-white/72">{copy.body}</p>

              <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
                {mode === "signup" && (
                  <label className="grid gap-2">
                    <span className="text-sm text-[#b8b8b8]">Codename</span>
                    <Input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your codename"
                      className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-0"
                    />
                  </label>
                )}
                <label className="grid gap-2">
                  <span className="text-sm text-[#b8b8b8]">Email</span>
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-0"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm text-[#b8b8b8]">Password</span>
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-0"
                  />
                </label>

                <Button
                  type="submit"
                  className="mt-1 h-12 rounded-xl border-0 text-base font-semibold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${lampGlow}, ${lampGlowDark})`,
                    boxShadow: lampOn ? `0 0 20px ${lampGlow}` : "0 10px 24px rgba(0,0,0,0.24)",
                  }}
                >
                  {copy.cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <div className="pt-2 text-center">
                  <button type="button" className="text-sm text-white/55 transition hover:text-white/85">
                    Forgot Password?
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function GameScreen({ fighter, onBackToFighters }: { fighter: Fighter; onBackToFighters: () => void }) {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <LoopMusic src={GAMEPLAY_AUDIO_SRC} />
      <div aria-hidden className="absolute inset-0 bg-grid pointer-events-none" />
      <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 h-[640px] w-[1100px] rounded-full bg-accent/10 blur-[160px] pointer-events-none" />
      <div aria-hidden className="absolute bottom-0 right-0 h-[480px] w-[760px] rounded-full bg-[hsl(var(--accent-blue))]/10 blur-[160px] pointer-events-none" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col items-center justify-start px-4 pt-4 pb-8 sm:pt-5 sm:pb-10">
        <h2 className="sr-only">CipherFlow 3D Mastermind code-breaker game</h2>
        <div className="grid w-full gap-5 xl:grid-cols-[340px_minmax(0,1fr)] xl:items-start">
          <div className="xl:sticky xl:top-4 xl:self-start">
            <FighterModelStage key={fighter.id} fighter={fighter} compact />
          </div>

          <GameBoard onBackToFighters={onBackToFighters} />
        </div>
      </div>
    </main>
  );
}

const Index = () => {
  const [screen, setScreen] = useState<Screen>("landing");
  const [selectedFighter, setSelectedFighter] = useState<FighterId>("VIKI");

  if (screen === "landing") {
    return <LandingScreen onContinue={() => setScreen("auth")} />;
  }

  if (screen === "auth") {
    return <AuthScreen onContinue={() => setScreen("fighters")} onBack={() => setScreen("landing")} />;
  }

  if (screen === "fighters") {
    return (
      <FightersScreen
        selectedFighter={selectedFighter}
        onSelectFighter={setSelectedFighter}
        onBack={() => setScreen("auth")}
        onContinue={() => setScreen("game")}
      />
    );
  }

  return (
    <GameScreen
      key={selectedFighter}
      fighter={fighters[selectedFighter]}
      onBackToFighters={() => setScreen("fighters")}
    />
  );
};

export default Index;
