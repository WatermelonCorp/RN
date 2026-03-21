"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { CopyButton } from "../animate-ui/components/buttons/copy";
import { ScrollFadeEffect } from "../scroll-fade-effect/scroll-fade-effect";
import { GlassContainer } from "../core/3d-container";

type PackageManager = "npm" | "pnpm" | "yarn" | "bun";
const PM_LIST = ["npm", "pnpm", "yarn", "bun"] as PackageManager[];

type InstallTrackingContext = {
  component_slug?: string;
  component_name?: string;
  category?: string;
  source?: string;
};

export function ManualInstallationCmd({
  activePackageManager,
  setActivePackageManager,
  dependencies,
  trackingContext,
}: {
  activePackageManager: PackageManager;
  setActivePackageManager: (pm: PackageManager) => void;
  dependencies?: string[];
  trackingContext?: InstallTrackingContext;
}) {
  if (!dependencies || dependencies.length === 0) return null;
  void trackingContext;

  const getCommand = (pm: PackageManager) => {
    const pkgs = dependencies.join(" ");
    switch (pm) {
      case "npm":
        return `npm install ${pkgs}`;
      case "yarn":
        return `yarn add ${pkgs}`;
      case "pnpm":
        return `pnpm add ${pkgs}`;
      case "bun":
        return `bun add ${pkgs}`;
    }
  };

  const command = getCommand(activePackageManager);

  return (
    <div className="space-y-3">
      {/* PM Switcher */}
      <div className="relative w-fit">
        <GlassContainer variant="strong" className="rounded-2xl p-0.5">
          <div className="bg-muted/38 border-border/60 flex items-center gap-1 rounded-[calc(1rem-2px)] border p-1">
            {PM_LIST.map((pm) => {
              const isActive = pm === activePackageManager;

              return (
                <button
                  key={pm}
                  onClick={() => {
                    setActivePackageManager(pm);
                  }}
                  className={cn(
                    "relative rounded-md px-3 py-1.5 text-sm font-medium",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId={`pm-manual-pill`}
                      className="bg-primary absolute inset-0 rounded-md"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{pm}</span>
                </button>
              );
            })}
          </div>
        </GlassContainer>
      </div>

      {/* Command */}
      <div className="group relative">
        <GlassContainer variant="strong" className="rounded-2xl p-0.5">
          <div className="bg-muted/38 border-border/60 max-w-full overflow-x-auto rounded-[calc(1rem-2px)] border p-4 pr-12 font-mono text-sm">
            <ScrollFadeEffect orientation="horizontal">
              <AnimatePresence mode="wait">
                <motion.code
                  key={activePackageManager}
                  initial={{ opacity: 0, filter: "blur(6px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(6px)" }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  className="whitespace-nowrap"
                >
                  {command}
                </motion.code>
              </AnimatePresence>
            </ScrollFadeEffect>
          </div>
        </GlassContainer>

        <CopyButton
          variant="secondary"
          size="xs"
          content={command}
          onCopiedChange={() => {
            if (!command) return;
          }}
          className="absolute top-2 right-2"
        />
      </div>
    </div>
  );
}
