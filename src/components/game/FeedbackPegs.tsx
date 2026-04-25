import { Feedback } from "@/game/types";
import { cn } from "@/lib/utils";

interface FeedbackPegsProps {
  feedback: Feedback | null;
  slots: number;
  reveal: boolean;
}

/**
 * Renders feedback pegs in a compact grid:
 * black peg = exact match
 * white peg = partial match
 * empty = no match
 * Pegs animate in sequentially using CSS custom delays.
 */
export function FeedbackPegs({ feedback, slots, reveal }: FeedbackPegsProps) {
  const totalPegs = slots;
  const black = feedback?.black ?? 0;
  const white = feedback?.white ?? 0;

  const pegs: ("black" | "white" | "none")[] = [];
  for (let i = 0; i < black; i++) pegs.push("black");
  for (let i = 0; i < white; i++) pegs.push("white");
  while (pegs.length < totalPegs) pegs.push("none");

  const cols = Math.ceil(totalPegs / 2);

  return (
    <div
      className="grid gap-1.5 rounded-lg border border-white/5 bg-black/30 p-2 backdrop-blur-sm preserve-3d sm:gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {pegs.map((peg, index) => (
        <div
          key={index}
          className={cn(
            "h-3 w-3 rounded-full sm:h-3.5 sm:w-3.5",
            reveal ? "animate-peg-pop" : "opacity-0",
            peg === "black" && "bg-black shadow-[0_0_10px_rgba(0,0,0,0.72),inset_0_-1px_2px_rgba(255,255,255,0.12),inset_0_1px_1px_rgba(255,255,255,0.25)]",
            peg === "white" && "bg-white shadow-[0_0_8px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.6)]",
            peg === "none" && "border border-white/10 bg-white/5",
          )}
          style={
            reveal
              ? ({ ["--peg-delay" as string]: `${index * 100 + 80}ms` } as React.CSSProperties)
              : undefined
          }
        />
      ))}
    </div>
  );
}
