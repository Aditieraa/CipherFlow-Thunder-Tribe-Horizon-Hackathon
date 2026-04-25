import { PointerEvent, useEffect, useRef, useState } from "react";

type GameState = "start" | "playing" | "won" | "lost";

export function FezziBubbleGame({ refreshKey }: { refreshKey: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("start");
  const [message, setMessage] = useState("Click to Start");

  useEffect(() => {
    setGameState("start");
    setMessage("Click to Start");
  }, [refreshKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let isMouseDown = false;
    let mouseX = 100;
    let mouseY = 300;

    let player = { x: 100, y: 300, radius: 15, maxRadius: 60 };
    const targetSize = 45;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; life: number }> = [];

    const finishCircle = { x: 730, y: 300, radius: 45 };

    const spikes = [
      { x: 0, y: 0, width: 800, height: 20 },
      { x: 0, y: 580, width: 800, height: 20 },
      { x: 0, y: 20, width: 20, height: 560 },
      { x: 780, y: 20, width: 20, height: 560 },
      { x: 200, y: 20, width: 40, height: 350 },
      { x: 400, y: 220, width: 40, height: 360 },
      { x: 600, y: 20, width: 40, height: 200 },
      { x: 600, y: 380, width: 40, height: 200 },
    ];

    const tinyBubbles = [
      { x: 150, y: 450, radius: 6, collected: false },
      { x: 300, y: 100, radius: 6, collected: false },
      { x: 500, y: 500, radius: 6, collected: false },
      { x: 620, y: 300, radius: 6, collected: false },
      { x: 500, y: 100, radius: 6, collected: false },
    ];

    const resetGame = () => {
      player = { x: 100, y: 300, radius: 15, maxRadius: 60 };
      tinyBubbles.forEach((bubble) => {
        bubble.collected = false;
      });
      particles.length = 0;
      setGameState("playing");
      setMessage("");
    };

    const burst = () => {
      setGameState("lost");
      setMessage("You burst! Click to restart.");
      for (let i = 0; i < 20; i += 1) {
        particles.push({
          x: player.x,
          y: player.y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          radius: Math.random() * 5 + 2,
          life: 1,
        });
      }
    };

    const updateMousePos = (event: PointerEvent<HTMLCanvasElement> | globalThis.PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mouseX = (event.clientX - rect.left) * scaleX;
      mouseY = (event.clientY - rect.top) * scaleY;
    };

    const handlePointerDown = (event: globalThis.PointerEvent) => {
      if (gameState === "start" || gameState === "won" || gameState === "lost") {
        resetGame();
        return;
      }
      isMouseDown = true;
      updateMousePos(event);
    };

    const handlePointerUp = () => {
      isMouseDown = false;
    };

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      if (gameState === "playing") {
        updateMousePos(event);
      }
    };

    const checkCollisionRectangle = (
      circle: { x: number; y: number; radius: number },
      rect: { x: number; y: number; width: number; height: number },
    ) => {
      let testX = circle.x;
      let testY = circle.y;

      if (circle.x < rect.x) testX = rect.x;
      else if (circle.x > rect.x + rect.width) testX = rect.x + rect.width;

      if (circle.y < rect.y) testY = rect.y;
      else if (circle.y > rect.y + rect.height) testY = rect.y + rect.height;

      const distX = circle.x - testX;
      const distY = circle.y - testY;
      return Math.sqrt(distX * distX + distY * distY) <= circle.radius;
    };

    const checkCollisionCircle = (
      c1: { x: number; y: number; radius: number },
      c2: { x: number; y: number; radius: number },
    ) => {
      const dx = c1.x - c2.x;
      const dy = c1.y - c2.y;
      return Math.sqrt(dx * dx + dy * dy) < c1.radius + c2.radius;
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointermove", handlePointerMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bg = ctx.createLinearGradient(0, 0, 800, 600);
      bg.addColorStop(0, "#fff6c2");
      bg.addColorStop(1, "#fffef4");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 32; i += 1) {
        const x = (i * 137) % canvas.width;
        const y = (i * 73) % canvas.height;
        const radius = 8 + (i % 6) * 6;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.fill();
      }

      if (gameState === "playing") {
        const dx = mouseX - player.x;
        const dy = mouseY - player.y;
        const distance = Math.hypot(dx, dy);

        if (distance > 0) {
          const speed = 4;
          const moveDistance = Math.min(speed, distance);
          player.x += (dx / distance) * moveDistance;
          player.y += (dy / distance) * moveDistance;
        }

        if (isMouseDown) {
          player.radius += 0.2;
          if (player.radius > player.maxRadius) {
            burst();
          }
        }
      }

      ctx.beginPath();
      ctx.arc(finishCircle.x, finishCircle.y, finishCircle.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(34, 197, 94, 0.18)";
      ctx.shadowColor = "#4ade80";
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.strokeStyle = "#15803d";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#14532d";
      ctx.font = "bold 16px Rajdhani, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Target Size: ${targetSize}`, finishCircle.x, finishCircle.y - 68);

      spikes.forEach((spike) => {
        const gradient = ctx.createLinearGradient(spike.x, spike.y, spike.x + spike.width, spike.y + spike.height);
        gradient.addColorStop(0, "#f97316");
        gradient.addColorStop(1, "#be123c");
        ctx.fillStyle = gradient;
        ctx.shadowColor = "rgba(249, 115, 22, 0.35)";
        ctx.shadowBlur = 12;

        const r = 10;
        ctx.beginPath();
        ctx.moveTo(spike.x + r, spike.y);
        ctx.lineTo(spike.x + spike.width - r, spike.y);
        ctx.quadraticCurveTo(spike.x + spike.width, spike.y, spike.x + spike.width, spike.y + r);
        ctx.lineTo(spike.x + spike.width, spike.y + spike.height - r);
        ctx.quadraticCurveTo(
          spike.x + spike.width,
          spike.y + spike.height,
          spike.x + spike.width - r,
          spike.y + spike.height,
        );
        ctx.lineTo(spike.x + r, spike.y + spike.height);
        ctx.quadraticCurveTo(spike.x, spike.y + spike.height, spike.x, spike.y + spike.height - r);
        ctx.lineTo(spike.x, spike.y + r);
        ctx.quadraticCurveTo(spike.x, spike.y, spike.x + r, spike.y);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (gameState === "playing" && checkCollisionRectangle(player, spike)) {
          burst();
        }
      });

      tinyBubbles.forEach((bubble) => {
        if (bubble.collected) return;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(255,255,255,0.85)";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (gameState === "playing" && checkCollisionCircle(player, bubble)) {
          bubble.collected = true;
          player.radius = Math.min(player.maxRadius, player.radius + 6);
        }
      });

      if (gameState === "playing" && checkCollisionCircle(player, finishCircle)) {
        const distance = Math.hypot(player.x - finishCircle.x, player.y - finishCircle.y);
        if (distance < 20) {
          if (player.radius >= targetSize) {
            setGameState("won");
            setMessage("You won! Click to replay.");
          } else {
            setGameState("lost");
            setMessage(`Too small. Reach size ${targetSize} and try again.`);
            burst();
          }
        }
      }

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;
        if (particle.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${particle.life})`;
        ctx.fill();
      }

      if (gameState === "playing" || gameState === "start" || gameState === "won") {
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);

        const gradient = ctx.createRadialGradient(
          player.x - player.radius * 0.3,
          player.y - player.radius * 0.3,
          player.radius * 0.1,
          player.x,
          player.y,
          player.radius,
        );
        gradient.addColorStop(0, "#fff1f2");
        gradient.addColorStop(0.35, "#22d3ee");
        gradient.addColorStop(0.65, "#f43f5e");
        gradient.addColorStop(1, "#7c3aed");

        ctx.fillStyle = gradient;
        ctx.shadowColor = "rgba(244, 63, 94, 0.35)";
        ctx.shadowBlur = 24;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255,255,255,0.75)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = player.radius > player.maxRadius - 5 ? "#7c2d12" : "#ffffff";
        ctx.shadowColor = "rgba(0,0,0,0.35)";
        ctx.shadowBlur = 6;
        ctx.font = "bold 14px Rajdhani, sans-serif";
        ctx.textAlign = "center";
        if (player.radius > player.maxRadius - 5) {
          ctx.fillText("MAX!", player.x, player.y - player.radius - 12);
        }
        ctx.fillText(`${Math.floor(player.radius)}`, player.x, player.y + 5);
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointermove", handlePointerMove);
    };
  }, [gameState, refreshKey]);

  return (
    <section id="fezzi-game" className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h2 className="font-display text-5xl font-black uppercase tracking-[0.08em] text-[#ff6a13] sm:text-6xl">
          Bubble Grow
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-[#27405f] sm:text-xl">
          Hold to grow, collect the micro-bubbles, avoid the spike maze, and cross the finish ring at size 45 or more.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/45 p-4 shadow-[0_30px_90px_rgba(125,88,0,0.18)] backdrop-blur-md sm:p-6">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full rounded-[24px] border border-white/70 bg-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] touch-none"
        />

        {message && (
          <div className="pointer-events-none absolute inset-4 flex items-center justify-center px-6 sm:inset-6">
            <div className="max-w-md rounded-[28px] border border-white/80 bg-white/72 p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur-md">
              <h3 className="font-display text-3xl font-black uppercase tracking-[0.06em] text-[#17365d]">
                {message}
              </h3>
              {gameState === "start" && (
                <div className="mt-5 space-y-2 text-left text-sm font-semibold text-[#28496d]">
                  <p>Hold click to grow.</p>
                  <p>Move the pointer to guide the bubble.</p>
                  <p>Collect tiny bubbles for safer growth.</p>
                  <p>Avoid spikes and don&apos;t exceed the max size.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
