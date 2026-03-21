"use client";

import { cn } from "@/lib/utils";
import { GlassContainer } from "../core/3d-container";

export function DocsSteps({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-8", className)}>{children}</div>;
}

export function DocsStep({
  index,
  title,
  description,
  children,
  isLast = false,
  className,
}: {
  index: number;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  isLast?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative grid grid-cols-[3rem_minmax(0,1fr)] gap-4 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-6",
        className,
      )}
    >
      <div className="relative flex justify-center">
        <GlassContainer
          variant="strong"
          className="relative z-10 h-fit rounded-full p-1"
        >
          <div className="bg-background text-foreground relative flex size-9 items-center justify-center rounded-full border border-border/70 text-base font-medium sm:size-10 sm:text-lg">
            {index}
          </div>
        </GlassContainer>
        {!isLast ? (
          <div className="bg-border/70 absolute top-[2.9rem] bottom-[-2rem] left-1/2 w-px -translate-x-1/2 sm:top-[3.1rem]" />
        ) : null}
      </div>

      <div className="min-w-0 space-y-4 pb-8">
        <div className="space-y-2 pt-1">
          <h3 className="text-lg font-medium tracking-tight sm:text-xl">
            {title}
          </h3>
          {description ? (
            <div className="text-muted-foreground text-sm leading-7 sm:text-base">
              {description}
            </div>
          ) : null}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
