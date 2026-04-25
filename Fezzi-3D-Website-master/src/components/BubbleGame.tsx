"use client";

import React, { useRef, useEffect, useState } from "react";

export default function BubbleGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"start" | "playing" | "won" | "lost">("start");
  const [message, setMessage] = useState("Click to Start");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isMouseDown = false;
    let mouseX = 100;
    let mouseY = 300;

    // Game state variables
    let player = { x: 100, y: 300, radius: 15, maxRadius: 60 };
    let targetSize = 45;
    let particles: any[] = [];
    
    // Level elements
    const finishCircle = { x: 730, y: 300, radius: 45 };
    
    // A proper maze with narrow paths
    const spikes = [
      // Top and bottom boundaries
      { x: 0, y: 0, width: 800, height: 20 },
      { x: 0, y: 580, width: 800, height: 20 },
      { x: 0, y: 20, width: 20, height: 560 }, // Left wall
      { x: 780, y: 20, width: 20, height: 560 }, // Right wall

      // Obstacle 1
      { x: 200, y: 20, width: 40, height: 350 },
      
      // Obstacle 2
      { x: 400, y: 220, width: 40, height: 360 },
      
      // Obstacle 3 (Narrow passage to finish)
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
      tinyBubbles.forEach(b => b.collected = false);
      particles = [];
      setGameState("playing");
      setMessage("");
    };

    const burst = () => {
      setGameState("lost");
      setMessage("You burst! 💥 Click to restart.");
      // Create particles
      for (let i = 0; i < 20; i++) {
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

    const handlePointerDown = (e: PointerEvent) => {
      if (gameState === "start" || gameState === "won" || gameState === "lost") {
        resetGame();
        return;
      }
      isMouseDown = true;
      updateMousePos(e);
    };

    const handlePointerUp = () => {
      isMouseDown = false;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (gameState === "playing") {
        updateMousePos(e);
      }
    };

    const updateMousePos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mouseX = (e.clientX - rect.left) * scaleX;
      mouseY = (e.clientY - rect.top) * scaleY;
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointermove", handlePointerMove);

    const checkCollisionRectangle = (circle: any, rect: any) => {
      let testX = circle.x;
      let testY = circle.y;

      if (circle.x < rect.x) testX = rect.x;
      else if (circle.x > rect.x + rect.width) testX = rect.x + rect.width;

      if (circle.y < rect.y) testY = rect.y;
      else if (circle.y > rect.y + rect.height) testY = rect.y + rect.height;

      const distX = circle.x - testX;
      const distY = circle.y - testY;
      const distance = Math.sqrt((distX * distX) + (distY * distY));

      return distance <= circle.radius;
    };

    const checkCollisionCircle = (c1: any, c2: any) => {
      const dx = c1.x - c2.x;
      const dy = c1.y - c2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < c1.radius + c2.radius;
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // No solid background, letting the glassmorphism CSS shine through

      if (gameState === "playing") {
        // Move player towards mouse with a strict speed limit to prevent wall skipping
        const dx = mouseX - player.x;
        const dy = mouseY - player.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist > 0) {
          const speed = 4; // max pixels per frame
          const moveDist = Math.min(speed, dist);
          player.x += (dx / dist) * moveDist;
          player.y += (dy / dist) * moveDist;
        }

        // Grow player
        if (isMouseDown) {
          player.radius += 0.2;
          if (player.radius > player.maxRadius) {
            burst(); // Burst if too big
          }
        }
      }

      // Draw finish circle
      ctx.beginPath();
      ctx.arc(finishCircle.x, finishCircle.y, finishCircle.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(34, 197, 94, 0.2)";
      ctx.shadowColor = "#4ade80";
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.strokeStyle = "#4ade80";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow
      ctx.fillStyle = "#166534";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Target Size: ${targetSize}`, finishCircle.x, finishCircle.y - 70);

      // Draw spikes
      spikes.forEach(spike => {
        const spikeGrad = ctx.createLinearGradient(spike.x, spike.y, spike.x + spike.width, spike.y + spike.height);
        spikeGrad.addColorStop(0, "#f97316"); // orange
        spikeGrad.addColorStop(1, "#be123c"); // rose
        ctx.fillStyle = spikeGrad;
        ctx.shadowColor = "rgba(249, 115, 22, 0.6)";
        ctx.shadowBlur = 15;
        
        // Draw rounded rectangle for spikes
        const r = 10; // corner radius
        ctx.beginPath();
        ctx.moveTo(spike.x + r, spike.y);
        ctx.lineTo(spike.x + spike.width - r, spike.y);
        ctx.quadraticCurveTo(spike.x + spike.width, spike.y, spike.x + spike.width, spike.y + r);
        ctx.lineTo(spike.x + spike.width, spike.y + spike.height - r);
        ctx.quadraticCurveTo(spike.x + spike.width, spike.y + spike.height, spike.x + spike.width - r, spike.y + spike.height);
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

      // Draw tiny bubbles
      tinyBubbles.forEach(tb => {
        if (!tb.collected) {
          ctx.beginPath();
          ctx.arc(tb.x, tb.y, tb.radius, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;

          if (gameState === "playing" && checkCollisionCircle(player, tb)) {
            tb.collected = true;
            // safely grow: clamp to maxRadius so it never bursts from a tiny bubble
            player.radius = Math.min(player.maxRadius, player.radius + 6);
          }
        }
      });

      // Check win condition
      if (gameState === "playing" && checkCollisionCircle(player, finishCircle)) {
        // The center of player must be inside the finish circle to win
        const dist = Math.hypot(player.x - finishCircle.x, player.y - finishCircle.y);
        if (dist < 20) {
          if (player.radius >= targetSize) {
            setGameState("won");
            setMessage("You Won! 🎉 Click to replay.");
          } else {
            setGameState("lost");
            setMessage(`Too small! Need size ${targetSize}. Click to restart.`);
            burst();
          }
        }
      }

      // Draw particles
      if (particles.length > 0) {
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.02;
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${p.life})`;
          ctx.fill();
        }
      }

      // Draw player
      if (gameState === "playing" || gameState === "start" || gameState === "won") {
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        
        // Gradient for player bubble
        const grad = ctx.createRadialGradient(
          player.x - player.radius * 0.3, 
          player.y - player.radius * 0.3, 
          player.radius * 0.1, 
          player.x, 
          player.y, 
          player.radius
        );
        grad.addColorStop(0, "#fff1f2"); // very light rose
        grad.addColorStop(0.4, "#f43f5e"); // vibrant rose
        grad.addColorStop(1, "#be123c"); // dark rose
        
        ctx.fillStyle = grad;
        ctx.shadowColor = "rgba(244, 63, 94, 0.6)";
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw size indicator and warning if close to burst
        ctx.fillStyle = player.radius > player.maxRadius - 5 ? "#fef08a" : "#fff";
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 4;
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        
        if (player.radius > player.maxRadius - 5) {
           ctx.fillText("⚠️ MAX!", player.x, player.y - player.radius - 10);
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
  }, [gameState]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-12 relative" id="game-section">
      <h2 className="text-4xl font-black uppercase text-orange-500 mb-4 text-center">Bubble Grow</h2>
      <p className="text-sky-950 mb-8 text-center max-w-2xl px-4">
        Hold to grow. Collect tiny bubbles to grow faster. Avoid spikes and don't get too big! Reach the finish circle with at least size 45 to win.
      </p>
      
      <div className="relative rounded-3xl overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/40 bg-white/20 backdrop-blur-md">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full max-w-[800px] h-auto aspect-[4/3] touch-none cursor-crosshair"
        />
        
        {message && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm pointer-events-none">
            <div className="text-center p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl transform transition-all">
              <h3 className="text-3xl font-black uppercase text-sky-950 mb-2">{message}</h3>
              {gameState === 'start' && (
                <div className="text-sky-900 mt-4 space-y-2 text-sm text-left font-medium">
                  <p>👆 <strong>Hold tap</strong> to grow</p>
                  <p>🖱️ <strong>Move pointer</strong> to navigate</p>
                  <p>💥 <strong>Avoid spikes</strong> & getting too big</p>
                  <p>🫧 <strong>Collect small bubbles</strong> for bonus size</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
