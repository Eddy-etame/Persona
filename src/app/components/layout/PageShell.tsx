import type { ReactNode } from "react";
import { cn } from "../ui/utils";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  variant?: "default" | "hero";
}

export function PageShell({
  children,
  className,
  contentClassName,
  variant = "default",
}: PageShellProps) {
  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        variant === "hero"
          ? "bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-900"
          : "bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900",
        className,
      )}
    >
      <div className={cn("mx-auto w-full", contentClassName)}>{children}</div>
    </div>
  );
}
