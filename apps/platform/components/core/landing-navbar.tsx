"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import ThemeToggle from "./theme-toggle";
import { ProgressiveBlur } from "../ui/progressive-blur";

const navLinks = [
  { label: "Components", href: "/components" },
  { label: "Installation", href: "/installation" },
  { label: "CLI", href: "/cli" },
  { label: "Registry", href: "/registry" },
];

export function LandingNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 h-14 overflow-hidden rounded-b-3xl rounded-t-[inherit]">
      <ProgressiveBlur
        direction="top"
        blurLayers={10}
        blurIntensity={4.2}
        className="pointer-events-none absolute inset-0 -bottom-4 rounded-[inherit]"
      />

      <nav className="border-border/70 bg-background/72 relative z-10 mx-auto flex h-14 w-full items-center justify-between gap-4 rounded-[inherit] border px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-1px_0_rgba(15,23,42,0.04),0_10px_24px_rgba(15,23,42,0.05)] supports-backdrop-filter:bg-background/34 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(255,255,255,0.02),0_10px_24px_rgba(0,0,0,0.28)]">
        <div className="flex min-w-0 shrink-0 items-center">
          <Logo />
        </div>

        <nav className="hidden items-center gap-1.5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-muted-foreground hover:text-foreground hover:bg-accent/60 flex h-9 items-center justify-center rounded-lg border border-transparent px-3 text-sm transition-colors",
                pathname === link.href ||
                  (link.href === "/components" && pathname.startsWith("/components"))
                  ? "bg-background text-foreground border-border/70 font-medium shadow-sm"
                  : "",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle className="size-9" />
        </div>
      </nav>
    </header>
  );
}
