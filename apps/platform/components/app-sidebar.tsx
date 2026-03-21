"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ComputerTerminalIcon,
  BookOpen02Icon,
  ChartRingIcon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import { getComponentGroups } from "@/lib/component-index";
import { Logo } from "./core/logo";
import { Socials } from "./core/socials";

const data = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      icon: <HugeiconsIcon icon={ComputerTerminalIcon} strokeWidth={2} />,
      isActive: true,
      items: [
        {
          title: "Introduction",
          url: "/introduction",
        },
        {
          title: "Installation",
          url: "/installation",
        },
        {
          title: "CLI",
          url: "/cli",
        },
        {
          title: "Registry",
          url: "/registry",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: <HugeiconsIcon icon={ChartRingIcon} strokeWidth={2} />,
    },
    {
      title: "Feedback",
      url: "#",
      icon: <HugeiconsIcon icon={SentIcon} strokeWidth={2} />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const componentGroups = getComponentGroups();

  const formattedComponentGroups = componentGroups.map((group) => ({
    title: group.title,
    url: "#",
    icon: <HugeiconsIcon icon={BookOpen02Icon} strokeWidth={2} />,
    items: group.items.map((item) => ({
      title: item.title,
      url: `/components/${item.slug}`,
    })),
  }));

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="relative z-50 flex items-center justify-center gap-2">
              <SidebarMenuButton size="lg" asChild>
                <Logo />
              </SidebarMenuButton>
              <SidebarTrigger />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} label="Platform" />
        <NavMain
          items={formattedComponentGroups}
          label="Components"
          expandAll
        />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <Socials />
      </SidebarFooter>
    </Sidebar>
  );
}
