"use client";

import * as THREE from "three";
import { useRef, useMemo } from "react";

export function Bubble({ scale = 1, ...props }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Create a gradient similar to the reference image
      // Colors: Red, Purple, Blue, Cyan, Green, Yellow
      const gradient = ctx.createConicGradient(Math.PI, 256, 256);
      gradient.addColorStop(0, "#ff0000"); // Red
      gradient.addColorStop(0.16, "#ff00ff"); // Purple
      gradient.addColorStop(0.33, "#0000ff"); // Blue
      gradient.addColorStop(0.5, "#00ffff"); // Cyan
      gradient.addColorStop(0.66, "#00ff00"); // Green
      gradient.addColorStop(0.83, "#ffff00"); // Yellow
      gradient.addColorStop(1, "#ff0000"); // Red

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      // Add a bit of white glow in the center to mimic the highlight
      const radialGradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      radialGradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
      radialGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, 512, 512);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  return (
    <mesh ref={meshRef} scale={scale} {...props}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.1}
        metalness={0.1}
      />
    </mesh>
  );
}
