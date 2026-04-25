import { CSSProperties, useMemo, useState } from "react";
import { ArrowDown, ArrowLeft, ExternalLink, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FezziBubbleGame } from "./FezziBubbleGame";

const steps = [
  {
    title: "Start Small",
    desc: "You begin as a tiny, vulnerable bubble with only a little room to grow.",
  },
  {
    title: "Hold to Grow",
    desc: "Press and hold to inflate, but stop before the shell becomes unstable.",
  },
  {
    title: "Navigate the Maze",
    desc: "Move carefully through the narrow paths and line yourself up with the finish ring.",
  },
  {
    title: "Avoid the Spikes",
    desc: "The orange spike walls burst you immediately, so every movement needs control.",
  },
  {
    title: "Collect Bonus Bubbles",
    desc: "Pick up the tiny glowing bubbles to gain safe size without overfilling too fast.",
  },
  {
    title: "Finish at Size 45+",
    desc: "Reach the target ring with enough size to clear the level and claim the win.",
  },
];

function BubbleField() {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => ({
        id: index,
        size: 20 + ((index * 17) % 62),
        left: `${(index * 13) % 100}%`,
        top: `${(index * 19) % 100}%`,
        delay: `${(index % 7) * 0.55}s`,
        duration: `${9 + (index % 5) * 1.8}s`,
      })),
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {bubbles.map((bubble) => (
        <span
          key={bubble.id}
          className="absolute rounded-full border border-white/35 bg-white/18 blur-[0.2px] animate-[float-orb_var(--float-duration)_ease-in-out_infinite]"
          style={
            {
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: bubble.left,
              top: bubble.top,
              animationDelay: bubble.delay,
              ["--float-duration" as string]: bubble.duration,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function FezziExperience({ onBack }: { onBack: () => void }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const openStandalone = () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}${window.location.pathname}#fezzi`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const reloadExperience = () => {
    setRefreshKey((value) => value + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#fee45b_0%,#fce774_26%,#fff7cf_60%,#fffef6_100%)] text-[#0a2b57]">
      <BubbleField />

      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-between gap-3 p-4 sm:p-6">
        <div className="pointer-events-auto">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-black/35 bg-white/68 font-display tracking-widest text-black shadow-[0_18px_48px_rgba(0,0,0,0.16)] backdrop-blur-md hover:bg-white/85"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>

        <div className="pointer-events-auto flex gap-2">
          <Button
            variant="outline"
            onClick={reloadExperience}
            className="border-black/35 bg-white/68 font-display tracking-widest text-black shadow-[0_18px_48px_rgba(0,0,0,0.16)] backdrop-blur-md hover:bg-white/85"
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Reload
          </Button>
          <Button
            variant="outline"
            onClick={openStandalone}
            className="border-black/35 bg-white/68 font-display tracking-widest text-black shadow-[0_18px_48px_rgba(0,0,0,0.16)] backdrop-blur-md hover:bg-white/85"
          >
            <ExternalLink className="mr-2 h-4 w-4" /> Open
          </Button>
        </div>
      </div>

      <section key={refreshKey} className="relative isolate">
        <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col items-center justify-center px-6 pb-24 pt-28 text-center sm:px-8">
          <div className="max-w-6xl">
            <div className="font-display text-xl font-black uppercase tracking-[0.34em] text-[#0a2b57] sm:text-2xl">
              Battle Bubbles
            </div>
            <h1 className="mt-6 font-display text-[4.4rem] font-black uppercase leading-[0.84] tracking-[0.02em] text-[#ff6a13] sm:text-[7rem] lg:text-[10rem]">
              Battle
              <span className="block">Bubbles</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#29496e] sm:text-2xl sm:leading-10">
              Pop your way to the top in this immersive bubble-run challenge. Grow, steer, survive the maze, and finish at the winning size.
            </p>

            <div className="mt-10 flex justify-center">
              <Button
                size="lg"
                className="h-14 rounded-full border-0 bg-[#0a2b57] px-8 font-display text-sm font-black uppercase tracking-[0.22em] text-white shadow-[0_18px_48px_rgba(10,43,87,0.26)] hover:bg-[#102f5f]"
                onClick={() => {
                  const element = document.getElementById("fezzi-game");
                  element?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Join the Battle
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="font-display text-5xl font-black uppercase tracking-[0.08em] text-[#0a2b57] sm:text-6xl">
              How to Play
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-[#28496d] sm:text-xl">
              Master the bubble physics, stay alive through the spike corridors, and hit the finish ring without popping early.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className={cn(
                  "rounded-[30px] border border-white/70 bg-white/42 p-7 shadow-[0_20px_70px_rgba(0,0,0,0.10)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1",
                )}
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fb7185,#f97316,#facc15)] font-display text-2xl font-black text-white shadow-[0_12px_30px_rgba(249,115,22,0.32)]">
                  {index + 1}
                </div>
                <h3 className="font-display text-2xl font-black uppercase tracking-[0.08em] text-[#0a2b57]">
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-[#35557c]">{step.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <FezziBubbleGame refreshKey={refreshKey} />
      </section>
    </main>
  );
}
