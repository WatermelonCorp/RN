import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/core/navbar";
import { TOCProvider } from "@/components/core/toc-context";
import { DocsTOC } from "@/components/core/docs-toc";
import {
  getCommandLinks,
  getComponentGroups,
  getGuideLinks,
} from "@/lib/docs-navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
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
  const componentGroups = getComponentGroups().map((group) => ({
    title: group.title,
    url: "#",
    icon: <HugeiconsIcon icon={BookOpen02Icon} strokeWidth={2} />,
    items: group.items.map((item) => ({
      title: item.title,
      url: item.url,
    })),
  }));
  const commandLinks = getCommandLinks();

  return (
    <TOCProvider>
      <SidebarProvider>
        <AppSidebar
          guideGroups={guideGroups}
          componentGroups={componentGroups}
        />
        <SidebarInset className="relative flex min-h-svh flex-col bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(255,255,255,0.95))] dark:bg-[linear-gradient(180deg,rgba(24,24,27,0.98),rgba(24,24,27,0.94))]">
          <main className="z-10 w-full min-w-0 flex-1">
            <Navbar commandLinks={commandLinks} />
            <div className="mx-auto w-full max-w-6xl px-3 py-8 sm:px-4 lg:px-8 lg:py-10 xl:max-w-6xl 2xl:pr-72">
              <div className="sticky top-14 z-10 -mx-3 mb-6 xl:hidden">
                <DocsTOC mobile />
              </div>
              <div className="min-w-0">{children}</div>
            </div>
          </main>
        </SidebarInset>
        <aside className="border-border/40 sticky top-0 hidden h-svh w-72 xl:block">
          <DocsTOC />
        </aside>
      </SidebarProvider>
    </TOCProvider>
  );
}
