import type { ReactNode } from "react";
import { cn } from "../ui/utils";

interface TopActionsProps {
  children: ReactNode;
  className?: string;
}

export function TopActions({ children, className }: TopActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
