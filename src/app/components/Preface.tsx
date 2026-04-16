import { useEffect, useMemo, useState } from "react";
import { GraduationCap } from "lucide-react";

interface PrefaceProps {
  onDone: () => void;
  minDurationMs?: number;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function nextPaint() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

function idleOrTimeout(timeoutMs: number) {
  return new Promise<void>((resolve) => {
    const w = window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void };
    if (w.requestIdleCallback) w.requestIdleCallback(() => resolve(), { timeout: timeoutMs });
    else setTimeout(() => resolve(), Math.min(timeoutMs, 250));
  });
}

export function Preface({ onDone, minDurationMs = 650 }: PrefaceProps) {
  const [phase, setPhase] = useState<"enter" | "exit">("enter");
  const startedAt = useMemo(() => performance.now(), []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Let layout settle before any exit transition.
      await nextPaint();
      await nextPaint();

      // Give time for initial async chunks + animations to stabilize.
      await idleOrTimeout(800);

      const elapsed = performance.now() - startedAt;
      if (elapsed < minDurationMs) await wait(minDurationMs - elapsed);
      if (cancelled) return;

      setPhase("exit");
      await wait(260); // match CSS duration
      if (cancelled) return;
      onDone();
    };

    run();
    return () => { cancelled = true; };
  }, [minDurationMs, onDone, startedAt]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-900 px-4">
      <div
        className={[
          "w-full max-w-md rounded-2xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur p-8 shadow-xl",
          "transition-all duration-300 ease-in-out",
          phase === "enter" ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-[0.98]",
        ].join(" ")}
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 dark:bg-white/10 flex items-center justify-center border border-blue-500/20 dark:border-white/10">
            <GraduationCap className="w-7 h-7 text-blue-700 dark:text-blue-200" />
          </div>

          <div>
            <div className="font-bold text-2xl text-foreground leading-tight">
              EduSystem<span className="text-blue-600 dark:text-blue-400">Design</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Concevez des systèmes de gestion modernes pour l’enseignement supérieur.
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse [animation-delay:120ms]" />
            <div className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse [animation-delay:240ms]" />
          </div>

          <div className="text-xs text-muted-foreground">
            Chargement… préparation de l’expérience.
          </div>
        </div>
      </div>
    </div>
  );
}

