import type { CSSProperties, ReactNode } from "react";
import { DocsSidebar } from "@/components/core/docs-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ComponentsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <div
        className="container mx-auto grid w-full gap-8 px-4 lg:grid-cols-[18rem_minmax(0,1fr)]"
        style={
          {
            "--sidebar-width": "18rem",
          } as CSSProperties
        }
      >
        <div className="hidden lg:block">
          <DocsSidebar />
        </div>

        <main className="min-h-[calc(100vh-4rem)]">
          <div className="py-8 lg:py-10">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
