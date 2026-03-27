import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type GradientTextProps = {
  children: ReactNode;
  className?: string;
};

export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-[var(--accent)] via-[var(--highlight)] to-[var(--info)] bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
