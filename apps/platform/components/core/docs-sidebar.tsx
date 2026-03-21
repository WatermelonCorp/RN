"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOC_SECTIONS, getComponentGroups } from "@/lib/component-index";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function DocsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const componentGroups = getComponentGroups();

  return (
    <Sidebar collapsible="none" className="h-screen" {...props}>
      <SidebarContent className="no-scrollbar w-full px-4 py-2">
        <div className="h-3 shrink-0" />

        <SidebarGroup className="gap-1 px-0">
          <SidebarGroupLabel className="text-sidebar-accent-foreground px-0 text-[0.7rem] font-medium tracking-[0.18em] uppercase">
            Getting Started
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {DOC_SECTIONS.map(({ name, href }) => (
                <SidebarMenuItem key={name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === href}
                    className="data-[active=true]:border-border/70 data-[active=true]:bg-background h-9 rounded-lg border border-transparent ps-3.5 text-sm hover:bg-transparent active:bg-transparent data-[active=true]:shadow-sm"
                  >
                    <Link href={href}>{name}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {componentGroups.map((group) => (
          <SidebarGroup key={group.title} className="gap-1 px-0">
            <SidebarGroupLabel className="text-sidebar-accent-foreground px-0 text-[0.7rem] font-medium tracking-[0.18em] uppercase">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.items.map((component) => (
                  <SidebarMenuItem key={component.slug}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/components/${component.slug}`}
                      className="data-[active=true]:border-border/70 data-[active=true]:bg-background h-9 rounded-lg border border-transparent ps-3.5 text-sm hover:bg-transparent active:bg-transparent data-[active=true]:shadow-sm"
                    >
                      <Link href={`/components/${component.slug}`}>
                        {component.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
