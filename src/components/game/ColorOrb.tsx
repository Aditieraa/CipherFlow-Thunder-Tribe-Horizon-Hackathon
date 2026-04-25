import { COLOR_PALETTE } from "@/game/types";
import { cn } from "@/lib/utils";

interface ColorOrbProps {
  colorId: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  glow?: boolean;
  empty?: boolean;
  symbolMode?: boolean;
}

const SIZE_MAP = {
  sm: "h-8 w-8",
  md: "h-12 w-12 sm:h-14 sm:w-14",
  lg: "h-14 w-14 sm:h-16 sm:w-16",
};

const SYMBOL_MAP = ["+", "X", "O", "=", "▲", "◆", "■", "★"];

export function ColorOrb({ colorId, size = "md", className, glow = true, empty = false, symbolMode = false }: ColorOrbProps) {
  const token = colorId !== null ? COLOR_PALETTE[colorId] : null;

  if (!token || empty) {
    return (
      <div className={cn("relative rounded-full preserve-3d", SIZE_MAP[size], className)}>
        <div
          aria-hidden
          className="absolute inset-0 rounded-full -z-10 blur-md"
          style={{
            background:
              "radial-gradient(circle, hsl(271 96% 68% / 0.5) 0%, hsl(257 92% 64% / 0.28) 46%, transparent 76%)",
            opacity: 0.95,
          }}
        />
        <div
          className="absolute inset-0 rounded-full border border-[hsl(266_80%_72%/0.35)]"
          style={{
            background:
              "radial-gradient(circle at 50% 78%, hsl(277 96% 56%) 0%, hsl(266 85% 40%) 26%, hsl(252 52% 18%) 58%, hsl(235 44% 8%) 100%)",
            boxShadow:
              "inset 0 -5px 10px hsl(0 0% 0% / 0.55), inset 0 3px 5px hsl(0 0% 100% / 0.18), 0 0 24px hsl(268 94% 62% / 0.4)",
          }}
        />
        <div
          aria-hidden
          className="absolute left-[18%] top-[12%] h-[24%] w-[30%] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(0 0% 100% / 0.78), transparent 72%)" }}
        />
        <div
          aria-hidden
          className="absolute right-[14%] top-[16%] h-[18%] w-[18%] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(0 0% 100% / 0.42), transparent 74%)" }}
        />
        <div
          aria-hidden
          className="absolute inset-x-[20%] bottom-[18%] h-[26%] rounded-full blur-[2px]"
          style={{ background: "radial-gradient(circle, hsl(284 100% 64% / 0.85), transparent 72%)" }}
        />
      </div>
    );
  }

  return (
    <div className={cn("relative rounded-full preserve-3d", SIZE_MAP[size], className)}>
      {glow && (
        <div
          aria-hidden
          className="absolute inset-0 rounded-full -z-10 blur-md"
          style={{ background: token.glow, opacity: 0.9 }}
        />
      )}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 25%, hsl(0 0% 100% / 0.55), ${token.base} 45%, hsl(0 0% 0% / 0.5) 100%)`,
          boxShadow: `inset 0 -3px 6px hsl(0 0% 0% / 0.45), inset 0 2px 3px hsl(0 0% 100% / 0.35), 0 6px 16px ${token.glow}`,
        }}
      />
      <div
        aria-hidden
        className="absolute top-[12%] left-[22%] h-[28%] w-[34%] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(0 0% 100% / 0.65), transparent 70%)" }}
      />
      {symbolMode && colorId !== null && (
        <div className="absolute inset-0 flex items-center justify-center font-display text-lg font-black text-white/95 [text-shadow:0_1px_8px_rgba(0,0,0,0.65)] sm:text-xl">
          {SYMBOL_MAP[colorId]}
        </div>
      )}
    </div>
  );
}
