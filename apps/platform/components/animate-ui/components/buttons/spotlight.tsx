"use client";

import * as React from "react";
import { type HTMLMotionProps, motion } from "motion/react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const spotlightButtonVariants = cva(
  "group relative inline-flex items-center justify-center overflow-hidden rounded-2xl border px-5 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-primary/20 bg-primary text-primary-foreground shadow-[0_20px_60px_-24px_hsl(var(--primary)/0.8)]",
        neutral:
          "border-border bg-card text-foreground shadow-sm hover:bg-muted transition-colors",
      },
      size: {
        default: "min-h-12 gap-2.5 px-5",
        lg: "min-h-14 gap-3 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type SpotlightButtonProps =
  HTMLMotionProps<"button"> &
    VariantProps<typeof spotlightButtonVariants> & {
      badge?: string;
    };

export function SpotlightButton({
  className,
  children,
  badge = "New",
  variant,
  size,
  ...props
}: SpotlightButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 340, damping: 22 }}
      className={cn(spotlightButtonVariants({ variant, size }), className)}
      {...props}
    >
      <motion.span
        aria-hidden
        className="absolute -inset-x-10 bottom-0 h-8 rounded-full bg-primary-foreground/10 blur-2xl"
        animate={{
          opacity: [0.1, 0.3, 0.1],
          scale: [0.96, 1.06, 0.96],
        }}
        transition={{
          duration: 3.2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <span className="relative z-10 inline-flex items-center gap-2.5">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-[0.2em] uppercase",
            variant === "neutral"
              ? "border border-slate-300/90 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
              : "border border-white/30 bg-white/15 text-white/90",
          )}
        >
          {badge}
        </span>
        <motion.span>{children}</motion.span>
        <motion.span
          className="inline-flex"
          initial={false}
          whileHover={{ x: 3 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        >
          <ArrowRightIcon className="size-4" />
        </motion.span>
      </span>
    </motion.button>
  );
}

export { spotlightButtonVariants };
