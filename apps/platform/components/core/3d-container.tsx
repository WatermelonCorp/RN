"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type GlassContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "soft" | "strong";
};

export function GlassContainer({
  className,
  variant = "strong",
  children,
  ...props
}: GlassContainerProps) {
  return (
    <div
      className={cn(
        // Base layout
        "border-border/40 relative rounded-[24px] border",
        "bg-background/60 backdrop-blur-xl",
        "p-1.5",

        // Outer depth
        "shadow-[0_2px_6px_rgba(0,0,0,0.16)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]",

        // Inner 3D layers
        variant === "default" &&
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-2px_6px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-2px_6px_rgba(0,0,0,0.5)]",

        variant === "soft" &&
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_4px_rgba(0,0,0,0.05)]",

        variant === "strong" &&
          "shadow-[inset_0_2px_0_rgba(255,255,255,0.6),inset_0_-3px_10px_rgba(0,0,0,0.12)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-4px_12px_rgba(0,0,0,0.6)]",

        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
