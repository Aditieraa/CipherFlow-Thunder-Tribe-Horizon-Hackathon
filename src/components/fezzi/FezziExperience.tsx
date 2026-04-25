import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ExternalLink, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FezziBubbleGame } from "./FezziBubbleGame";

const steps = [
  {
    title: "Start Small",
    desc: "You begin as a tiny, vulnerable bubble with only a little room to survive the maze.",
  },
  {
    title: "Hold to Grow",
    desc: "Press and hold to inflate, but keep your timing tight so you do not overfill and burst.",
  },
  {
    title: "Steer the Run",
    desc: "Guide the bubble through narrow corridors and stay clean through every squeeze point.",
  },
  {
    title: "Avoid the Spikes",
    desc: "The orange barriers pop you instantly, so every movement needs control and patience.",
  },
  {
    title: "Collect Boosts",
    desc: "Pick up the tiny glowing bubbles for safer growth without wasting your max size too early.",
  },
  {
    title: "Finish Big",
    desc: "Reach the end ring at size 45 or more and clear the level with the win intact.",
  },
];

const orbPalette = [
  ["#f97316", "#fb7185", "#60a5fa"],
  ["#60a5fa", "#22d3ee", "#c084fc"],
  ["#f43f5e", "#fb7185", "#facc15"],
  ["#a855f7", "#60a5fa", "#22d3ee"],
  ["#facc15", "#f97316", "#fb7185"],
  ["#60a5fa", "#f97316", "#fb7185"],
];

function FloatingBackgroundBubbles() {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) => ({
        id: index,
        size: 18 + ((index * 23) % 74),
        left: `${(index * 17) % 100}%`,
        top: `${(index * 29) % 120}%`,
        duration: 9 + (index % 6) * 1.3,
        delay: (index % 8) * 0.45,
        opacity: 0.1 + (index % 5) * 0.05,
      })),
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {bubbles.map((bubble) => (
        <motion.span
          key={bubble.id}
          className="absolute rounded-full border border-white/40 bg-white/15"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.left,
            top: bubble.top,
            opacity: bubble.opacity,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 18px 48px rgba(255,207,79,0.08)",
            backdropFilter: "blur(2px)",
          }}
          animate={{
            y: [0, -26, 0],
            x: [0, bubble.id % 2 === 0 ? 8 : -8, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: bubble.delay,
          }}
        />
      ))}
    </div>
  );
}

function HeroOrbCluster() {
  const orbs = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => ({
        id: index,
        size: index === 0 ? 188 : 90 + index * 16,
        x: index === 0 ? 0 : Math.cos((index / 5) * Math.PI * 2) * 150,
        y: index === 0 ? 0 : Math.sin((index / 5) * Math.PI * 2) * 80,
        z: index === 0 ? 0 : (index % 3) * 20 - 10,
        palette: orbPalette[index % orbPalette.length],
      })),
    [],
  );

  return (
    <div className="relative h-[420px] w-full scene-3d sm:h-[520px] lg:h-[620px]">
      <motion.div
        className="absolute inset-0 preserve-3d"
        animate={{ rotateZ: [0, 7, 0], rotateY: [0, 14, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        {orbs.map((orb, index) => (
          <motion.div
            key={orb.id}
            className="absolute left-1/2 top-1/2 preserve-3d"
            style={{
              width: orb.size,
              height: orb.size,
              transform: `translate3d(calc(-50% + ${orb.x}px), calc(-50% + ${orb.y}px), ${orb.z}px)`,
            }}
            animate={{
              y: [0, -20 - index * 3, 0],
              rotate: [0, index % 2 === 0 ? 16 : -16, 0],
            }}
            transition={{
              duration: 6 + index,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.15,
            }}
          >
            <div
              className="relative h-full w-full rounded-full"
              style={{
                background: `radial-gradient(circle at 30% 26%, rgba(255,255,255,0.95) 0%, ${orb.palette[0]} 18%, ${orb.palette[1]} 52%, ${orb.palette[2]} 100%)`,
                boxShadow:
                  "inset -20px -28px 36px rgba(0,0,0,0.18), inset 16px 18px 28px rgba(255,255,255,0.45), 0 36px 80px rgba(255,167,38,0.24)",
              }}
            >
              <div className="absolute left-[18%] top-[14%] h-[24%] w-[36%] rounded-full bg-white/70 blur-[2px]" />
              <div className="absolute bottom-[16%] right-[18%] h-[18%] w-[24%] rounded-full bg-white/25 blur-[4px]" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function HowToPlay() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="font-display text-5xl font-black uppercase tracking-[0.08em] text-[#0a2b57] sm:text-6xl">
          How to Play
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-[#28496d] sm:text-xl">
          Master the bubble physics, stay alive through the spike corridors, and hit the finish ring without popping early.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((step, index) => (
          <motion.article
            key={step.title}
            className="rounded-[30px] border border-white/70 bg-white/42 p-7 shadow-[0_20px_70px_rgba(0,0,0,0.10)] backdrop-blur-md"
            initial={{ opacity: 0, y: 38, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.06 }}
          >
            <motion.div
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fb7185,#f97316,#facc15)] font-display text-2xl font-black text-white shadow-[0_12px_30px_rgba(249,115,22,0.32)]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.12 }}
            >
              {index + 1}
            </motion.div>
            <h3 className="font-display text-2xl font-black uppercase tracking-[0.08em] text-[#0a2b57]">
              {step.title}
            </h3>
            <p className="mt-3 text-base leading-7 text-[#35557c]">{step.desc}</p>
          </motion.article>
        ))}
      </div>
    </section>
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
      <FloatingBackgroundBubbles />

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

      <section key={refreshKey} className="relative">
        <div className="relative mx-auto max-w-[1600px] px-6 pb-20 pt-28 sm:px-8 lg:px-12">
          <div className="grid min-h-screen items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative z-10 text-center lg:text-left">
              <motion.div
                className="font-display text-2xl font-black uppercase tracking-[0.34em] text-[#0a2b57]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                Battle Bubbles
              </motion.div>

              <div className="mt-8 space-y-2">
                <motion.div
                  className="font-display text-[4.2rem] font-black uppercase leading-[0.84] tracking-[0.02em] text-[#ff6a13] sm:text-[6.4rem] lg:text-[8.8rem]"
                  initial={{ opacity: 0, scale: 1.12 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  BATTLE
                </motion.div>
                <motion.div
                  className="font-display text-[4.2rem] font-black uppercase leading-[0.84] tracking-[0.02em] text-[#ff6a13] sm:text-[6.4rem] lg:text-[8.8rem]"
                  initial={{ opacity: 0, scale: 0.92, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  BUBBLES
                </motion.div>
              </div>

              <motion.p
                className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#29496e] sm:text-2xl sm:leading-10 lg:mx-0"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              >
                Pop your way to the top in this immersive bubble-run challenge. Grow, steer, survive the maze, and finish at the winning size.
              </motion.p>

              <motion.div
                className="mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
              >
                <Button
                  size="lg"
                  className="h-16 rounded-full border-0 bg-[#0a2b57] px-10 font-display text-base font-black uppercase tracking-[0.22em] text-white shadow-[0_18px_48px_rgba(10,43,87,0.26)] hover:bg-[#102f5f]"
                  onClick={() => {
                    const element = document.getElementById("fezzi-game");
                    element?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  Join the Battle
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>

            <div className="relative z-10">
              <HeroOrbCluster />
            </div>
          </div>
        </div>

        <HowToPlay />
        <FezziBubbleGame refreshKey={refreshKey} />
      </section>
    </main>
  );
}
