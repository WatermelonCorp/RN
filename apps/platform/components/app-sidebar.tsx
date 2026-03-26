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
import { ChartRingIcon, SentIcon } from "@hugeicons/core-free-icons";
import { Logo } from "./core/logo";
import { Socials } from "./core/socials";

const navSecondary = [
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
];

type NavGroup = {
  title: string;
  url: string;
  icon: React.ReactNode;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};

export function AppSidebar({
  guideGroups = [],
  componentGroups = [],
  animatedComponentGroups = [],
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  guideGroups?: NavGroup[];
  componentGroups?: NavGroup[];
  animatedComponentGroups?: NavGroup[];
}) {
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
        <NavMain items={guideGroups} label="Platform" />
        <NavMain items={componentGroups} label="Components" labelUrl="/components" expandAll />
        <NavMain
          items={animatedComponentGroups}
          label="Animated Components"
          labelUrl="/animated-components"
          expandAll
        />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <Socials />
      </SidebarFooter>
    </Sidebar>
  );
}
