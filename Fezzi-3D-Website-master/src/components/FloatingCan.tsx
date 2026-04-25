"use client";

import { forwardRef, ReactNode } from "react";
import { Float } from "@react-three/drei";

import { Bubble } from "@/components/Bubble";
import { Group } from "three";

type FloatingBubbleProps = {
  floatSpeed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
  floatingRange?: [number, number];
  children?: ReactNode;
  scale?: number;
};

const FloatingBubble = forwardRef<Group, FloatingBubbleProps>(
  (
    {
      floatSpeed = 1.5,
      rotationIntensity = 1,
      floatIntensity = 1,
      floatingRange = [-0.1, 0.1],
      children,
      scale = 1,
      ...props
    },
    ref,
  ) => {
    return (
      <group ref={ref} {...props}>
        <Float
          speed={floatSpeed}
          rotationIntensity={rotationIntensity}
          floatIntensity={floatIntensity}
          floatingRange={floatingRange}
        >
          {children}
          <Bubble scale={scale} />
        </Float>
      </group>
    );
  },
);

FloatingBubble.displayName = "FloatingBubble";

export default FloatingBubble;
