import { COLOR_PALETTE } from "@/game/types";
import { cn } from "@/lib/utils";
import { ColorOrb } from "./ColorOrb";

interface ColorPaletteProps {
  available: number;
  onPick: (colorId: number) => void;
  disabled?: boolean;
  hint?: string;
  onDragStart?: (colorId: number) => void;
  onDragEnd?: () => void;
  symbolMode?: boolean;
}

export function ColorPalette({ available, onPick, disabled, hint, onDragStart, onDragEnd, symbolMode = false }: ColorPaletteProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-card shadow-3d p-4 sm:p-5 preserve-3d">
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Color Cipher
        </span>
        {hint && (
          <span className="text-xs text-muted-foreground">{hint}</span>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {COLOR_PALETTE.slice(0, available).map(c => (
          <button
            key={c.id}
            type="button"
            disabled={disabled}
            draggable={!disabled}
            onClick={() => onPick(c.id)}
            onDragStart={(event) => {
              event.dataTransfer.setData("text/plain", String(c.id));
              event.dataTransfer.effectAllowed = "copy";
              onDragStart?.(c.id);
            }}
            onDragEnd={() => onDragEnd?.()}
            className={cn(
              "group relative transition-all duration-300 preserve-3d",
              disabled ? "opacity-40 cursor-not-allowed" : "hover:-translate-y-1 hover:scale-110 cursor-pointer",
            )}
            aria-label={`Select ${c.name}`}
            title={c.name}
          >
            <ColorOrb colorId={c.id} size="lg" symbolMode={symbolMode} />
          </button>
        ))}
      </div>
    </div>
  );
}
