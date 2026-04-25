"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
  {
    icon: "🫧",
    title: "Start Small",
    desc: "You begin as a tiny, vulnerable bubble.",
  },
  {
    icon: "👆",
    title: "Hold to Grow",
    desc: "Press and hold the screen to increase your size.",
  },
  {
    icon: "🖱️",
    title: "Navigate Paths",
    desc: "Move your pointer carefully through the narrow maze.",
  },
  {
    icon: "💥",
    title: "Avoid Danger",
    desc: "Don't touch the spikes and don't grow beyond your max size!",
  },
  {
    icon: "✨",
    title: "Safe Growth",
    desc: "Collect glowing tiny bubbles to grow safely without bursting.",
  },
  {
    icon: "🎯",
    title: "Reach the Goal",
    desc: "Arrive at the finish circle with the target size to win!",
  },
];

export default function GameInstructions() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".step-card", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.5)",
      });
      
      gsap.from(".instructions-header", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
      });

      // Continuous floating animation for the bubbles
      gsap.to(".number-bubble", {
        y: -15,
        duration: 2.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: {
          each: 0.2,
          from: "random"
        }
      });
    },
    { scope: container }
  );

  return (
    <div ref={container} className="relative z-[90] w-full max-w-6xl mx-auto mt-40 mb-16 px-4">
      <div className="instructions-header text-center mb-12">
        <h2 className="text-5xl md:text-7xl font-black uppercase text-orange-500 mb-4 drop-shadow-sm">
          How to Play
        </h2>
        <p className="text-xl md:text-2xl text-sky-950 max-w-2xl mx-auto font-medium">
          Master the physics of the bubble and conquer the maze. Here are the rules of engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="step-card bg-white/30 backdrop-blur-lg border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] rounded-3xl p-8 flex flex-col items-center text-center transform transition-transform duration-300"
          >
            <div className="number-bubble relative w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-rose-300 via-pink-400 to-rose-600 shadow-[0_0_30px_rgba(244,63,94,0.5)]">
              {/* Glossy bubble highlights */}
              <div className="absolute top-2 left-3 w-8 h-4 bg-white/60 rounded-full rotate-[-45deg] blur-[2px]"></div>
              <div className="absolute bottom-2 right-3 w-6 h-3 bg-white/30 rounded-full rotate-[-45deg] blur-[2px]"></div>
              <span className="text-5xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] relative z-10">
                {index + 1}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-sky-950 mb-3">{step.title}</h3>
            <p className="text-sky-900 font-medium text-lg leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
