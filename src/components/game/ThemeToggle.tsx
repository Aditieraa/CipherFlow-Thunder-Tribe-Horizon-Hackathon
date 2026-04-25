import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-12 w-12 rounded-2xl border border-white/15 bg-white/60 text-foreground shadow-[0_10px_28px_rgba(15,23,42,0.12)] backdrop-blur-md hover:bg-white/80 dark:bg-black/30 dark:text-white dark:shadow-[0_12px_28px_rgba(0,0,0,0.32)] dark:hover:bg-black/50"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
