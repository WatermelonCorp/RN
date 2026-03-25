"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CommandMenu } from "./command-pallete";
import { Logo } from "./logo";
import ThemeToggle from "./theme-toggle";
import { ProgressiveBlur } from "../ui/progressive-blur";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import type { CommandLink } from "@/lib/docs-navigation";

const navLinks = [
  { label: "Components", href: "/components" },
  { label: "Installation", href: "/installation" },
  { label: "CLI", href: "/cli" },
  { label: "Registry", href: "/registry" },
];

// ─── Navbar ──────────────────────────────────────────────────────────────────

export function Navbar({
  commandLinks,
}: {
  commandLinks: {
    guides: CommandLink[];
    components: CommandLink[];
  };
}) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isOpen = state === "expanded";
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-20 h-14">
      {/* Progressive blur effect - fades from top (blurry) to bottom (clear) */}
      <ProgressiveBlur
        direction="top"
        blurLayers={10}
        blurIntensity={4.2}
        className="pointer-events-none absolute inset-0 -bottom-4 rounded-t-xl"
      />

      {/* Navbar content */}
      <nav className="border-border/70 relative z-10 container mx-auto flex h-14 items-center justify-between gap-2 px-4">
        <div className="flex min-w-0 shrink-0 items-center">
          <div
            className={cn(
              "flex items-center gap-2 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap",
              !isOpen || isMobile
                ? "w-auto translate-x-0 opacity-100 mr-3"
                : "w-0 -translate-x-full opacity-0 pointer-events-none mr-0",
            )}
          >
            <SidebarTrigger />
            <div className="bg-border/70 mx-1 hidden h-4 w-px md:block" />
            <Logo />
          </div>
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-muted-foreground hover:text-foreground hover:bg-accent/60 flex h-9 items-center justify-center rounded-lg border border-transparent px-3 text-sm transition-colors",
                  pathname === link.href ||
                    (pathname === "/" && link.href === "/#overview") ||
                    (link.href === "/components" &&
                      pathname.startsWith("/components"))
                    ? "bg-background text-foreground border-border/70 font-medium shadow-sm"
                    : "",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2 px-2">
          <div className="w-full flex-1 sm:max-w-xs md:w-auto md:flex-none">
            <CommandMenu links={commandLinks} />
          </div>
          <div className="flex shrink-0 items-center">
            <ThemeToggle className="size-9" />
          </div>
        </div>
      </nav>
    </header>
  );
}
