"use client";

import { cn } from "@/lib/utils";
import { CopyButton } from "../animate-ui/components/buttons/copy";
import { AnimatePresence, motion } from "motion/react";
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

export interface InstallationItem {
  install: string[];
  slug: string;
  name: string;
  category: string;
}

export const InstallationCmd = ({
  activePackageManager,
  setActivePackageManager,
  item,
  trackingContext,
}: {
  activePackageManager: PackageManager;
  setActivePackageManager: (pm: PackageManager) => void;
  item: InstallationItem;
  trackingContext?: InstallTrackingContext;
}) => {
  void trackingContext;

  const getInstallCommand = (pm: PackageManager, baseCommand: string) => {
    // Check if it's a shadcn add command
    if (
      baseCommand.startsWith("npx shadcn") ||
      baseCommand.includes("shadcn@latest add")
    ) {
      const parts = baseCommand.split(" ");
      const componentName = parts[parts.length - 1];
      switch (pm) {
        case "npm":
          return `npx shadcn@latest add ${componentName}`;
        case "yarn":
          return `npx shadcn@latest add ${componentName}`;
        case "pnpm":
          return `pnpm dlx shadcn@latest add ${componentName}`;
        case "bun":
          return `bunx --bun shadcn@latest add ${componentName}`;
        default:
          return baseCommand;
      }
    }
    // For npm install commands
    if (
      baseCommand.startsWith("npm install") ||
      baseCommand.startsWith("npm i ")
    ) {
      const packages = baseCommand.replace(/^npm (install|i) /, "");
      switch (pm) {
        case "npm":
          return `npm install ${packages}`;
        case "yarn":
          return `yarn add ${packages}`;
        case "pnpm":
          return `pnpm add ${packages}`;
        case "bun":
          return `bun add ${packages}`;
        default:
          return baseCommand;
      }
    }
    return baseCommand;
  };

  return (
    <div className="space-y-2">
      {/* Package Manager Tabs */}
      <div className="relative w-fit">
        <GlassContainer variant="strong" className="rounded-2xl p-0.5">
          <div className="bg-muted/38 border-border/60 relative flex w-fit items-center gap-1 rounded-[calc(1rem-2px)] border p-1">
            {PM_LIST.map((pm) => {
              const isActive = activePackageManager === pm;

              return (
                <button
                  key={pm}
                  onClick={() => {
                    setActivePackageManager(pm);
                  }}
                  className={cn(
                    "relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {/* Active pill */}
                  {isActive && (
                    <motion.span
                      layoutId="pm-active-pill"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      className="bg-primary absolute inset-0 rounded-md"
                    />
                  )}

                  {/* Label */}
                  <span className="relative z-10">{pm}</span>
                </button>
              );
            })}
          </div>
        </GlassContainer>
      </div>

      {/* Install Commands */}
      <div className="space-y-3">
        {item.install.map((cmd: string, idx: number) => {
          const command = getInstallCommand(activePackageManager, cmd);

          return (
            <div key={idx} className="group relative">
              <GlassContainer variant="strong" className="rounded-2xl p-0.5">
                <div className="bg-muted/38 border-border/60 overflow-x-auto rounded-[calc(1rem-2px)] border p-4 pr-12 font-mono text-sm whitespace-nowrap">
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
                className="absolute top-2 right-2"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
