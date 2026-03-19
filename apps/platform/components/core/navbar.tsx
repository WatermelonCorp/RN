"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CommandMenu } from "./command-pallete";
import { Logo } from "./logo";
import ThemeToggle from "./theme-toggle";

const navLinks = [
  { label: "Components", href: "/components" },
  { label: "Installation", href: "/installation" },
  { label: "CLI", href: "/cli" },
];

// ─── Navbar ──────────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-14 items-center gap-4">
        {/* Logo */}
        <Logo />

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex h-10 items-center justify-center rounded-md px-3 text-sm transition-colors",
                pathname === link.href ||
                  (pathname === "/" && link.href === "/#overview") ||
                  (link.href === "/components" &&
                    pathname.startsWith("/components"))
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Command menu */}
        <CommandMenu />

        <ThemeToggle />

        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 md:hidden"
              aria-label="Open menu"
            >
              <HugeiconsIcon
                icon={mobileOpen ? Cancel01Icon : Menu01Icon}
                className="h-4 w-4"
              />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 pt-10">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition-colors",
                    pathname === link.href ||
                      (pathname === "/" && link.href === "/#overview") ||
                      (link.href === "/components" &&
                        pathname.startsWith("/components"))
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
