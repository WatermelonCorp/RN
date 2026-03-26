import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/core/navbar";
import { TOCProvider } from "@/components/core/toc-context";
import { DocsTOC } from "@/components/core/docs-toc";
import {
  getAnimatedComponentEntries,
  getComponentEntries,
  getCommandLinks,
  getGuideLinks,
} from "@/lib/docs-navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Atom02Icon,
  BookOpen02Icon,
  ComputerTerminalIcon,
} from "@hugeicons/core-free-icons";

export default function ComponentsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const guideGroups = [
    {
      title: "Getting Started",
      url: "#",
      icon: <HugeiconsIcon icon={ComputerTerminalIcon} strokeWidth={2} />,
      isActive: true,
      items: getGuideLinks().map((item) => ({
        title: item.title,
        url: item.url,
      })),
    },
  ];
  const componentGroups = getComponentEntries().map((item) => ({
    title: item.title,
    url: item.url,
    icon: <HugeiconsIcon icon={BookOpen02Icon} strokeWidth={2} />,
  }));
  const animatedComponentGroups = getAnimatedComponentEntries().map((item) => ({
    title: item.title,
    url: item.url,
    icon: <HugeiconsIcon icon={Atom02Icon} strokeWidth={2} />,
  }));
  const commandLinks = getCommandLinks();

  return (
    <TOCProvider>
      <SidebarProvider>
        <AppSidebar
          guideGroups={guideGroups}
          componentGroups={componentGroups}
          animatedComponentGroups={animatedComponentGroups}
        />
        <SidebarInset className="relative flex min-h-svh flex-col bg-neutral-100 p-2 pb-4 md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:border-none md:peer-data-[variant=inset]:before:hidden md:peer-data-[variant=inset]:after:hidden dark:bg-black">
          <div className="bg-background/90 border-border/40 relative flex min-h-full flex-col rounded-[1.5rem] border shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
            <Navbar commandLinks={commandLinks} />
            <main className="z-10 w-full min-w-0 flex-1">
              <div className="mx-auto w-full max-w-6xl px-3 py-8 sm:px-4 lg:px-8 lg:py-10 xl:max-w-6xl 2xl:pr-72">
                <div className="sticky top-[64px] z-10 -mx-3 mb-6 xl:hidden">
                  <DocsTOC mobile />
                </div>
                <div className="min-w-0">{children}</div>
              </div>
            </main>
          </div>
        </SidebarInset>
        <aside className="border-border/40 sticky top-0 hidden h-svh w-72 xl:block">
          <DocsTOC />
        </aside>
      </SidebarProvider>
    </TOCProvider>
  );
}
