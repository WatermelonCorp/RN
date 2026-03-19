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
    <Sidebar
      collapsible="none"
      className="border-border/70 bg-card/80 text-sidebar-foreground sticky top-20 hidden h-[calc(100svh-6rem)] w-full shrink-0 overflow-hidden rounded-sm border shadow-sm [--sidebar-menu-width:100%] lg:flex"
      {...props}
    >
      <SidebarContent className="no-scrollbar w-full overflow-x-hidden px-4 py-2">
        <SidebarGroup className="gap-2 px-0">
          <SidebarGroupLabel className="text-muted-foreground px-3 text-[0.65rem] font-medium tracking-[0.22em] uppercase">
            Getting Started
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {DOC_SECTIONS.map(({ name, href }) => (
                <SidebarMenuItem key={name}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      href === "/components"
                        ? pathname === href
                        : pathname.startsWith(href)
                    }
                    className="h-9 rounded-xl px-3 text-sm"
                  >
                    <Link href={href}>{name}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {componentGroups.map((group) => (
          <SidebarGroup key={group.title} className="px-0">
            <SidebarGroupLabel className="text-muted-foreground px-3 text-[0.65rem] font-medium tracking-[0.22em] uppercase">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((component) => (
                  <SidebarMenuItem key={component.slug}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/components/${component.slug}`}
                      className="h-9 rounded-xl px-3 text-sm"
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
