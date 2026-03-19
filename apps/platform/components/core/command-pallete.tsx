"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CommandIcon,
  Search01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { Kbd } from "../ui/kbd";
import { usePathname, useRouter } from "next/navigation";
import { DOC_SECTIONS, getComponentGroups } from "@/lib/component-index";

const ROOT_LINKS = [
  {
    label: "Home",
    href: "/",
    keywords: ["landing", "overview", "start"],
  },
  ...DOC_SECTIONS.map((section) => ({
    label: section.name,
    href: section.href,
    keywords: ["docs", "components", section.name.toLowerCase()],
  })),
];

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const componentGroups = React.useMemo(() => getComponentGroups(), []);

  const componentLinks = React.useMemo(
    () =>
      componentGroups.flatMap((group) =>
        group.items.map((component) => ({
          label: component.title,
          href: `/components/${component.slug}`,
          keywords: [
            component.slug,
            component.category.toLowerCase(),
            ...component.description.toLowerCase().split(/\s+/).slice(0, 6),
          ],
          group: group.title,
        })),
      ),
    [componentGroups],
  );

  React.useEffect(() => {
    [...ROOT_LINKS, ...componentLinks].forEach(({ href }) => router.prefetch(href));
  }, [router, componentLinks]);

  React.useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <div className="flex flex-col gap-4">
      <InputGroup
        onClick={() => setOpen(true)}
        className="bg-muted/40 hover:bg-muted/60 flex cursor-pointer items-center justify-center transition-colors md:w-48 lg:w-64"
      >
        <InputGroupAddon>
          <HugeiconsIcon
            icon={Search01Icon}
            className="text-muted-foreground h-4 w-4"
          />
        </InputGroupAddon>
        <InputGroupInput
          readOnly
          placeholder="Search..."
          className="hidden cursor-pointer bg-transparent focus-visible:ring-0 sm:block"
        />
        <InputGroupAddon align="inline-end">
          <Kbd>
            <HugeiconsIcon icon={CommandIcon} size={12} />K
          </Kbd>
        </InputGroupAddon>
      </InputGroup>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="sm:max-w-2xl"
      >
        <>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No matching pages or components.</CommandEmpty>

            <CommandGroup heading="Navigation">
              {ROOT_LINKS.map((item) => (
                <CommandItem
                  key={item.href}
                  value={`${item.label} ${item.keywords.join(" ")}`}
                  onSelect={() => runCommand(item.href)}
                >
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="h-4 w-4 text-muted-foreground"
                  />
                  <span>{item.label}</span>
                  {pathname === item.href ? (
                    <CommandShortcut>Current</CommandShortcut>
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            {componentGroups.map((group) => {
              const items = componentLinks.filter(
                (item) => item.group === group.title,
              );

              return (
                <CommandGroup key={group.title} heading={group.title}>
                  {items.map((item) => (
                    <CommandItem
                      key={item.href}
                      value={`${item.label} ${item.keywords.join(" ")}`}
                      onSelect={() => runCommand(item.href)}
                    >
                      <span>{item.label}</span>
                      <CommandShortcut>Open</CommandShortcut>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </>
      </CommandDialog>
    </div>
  );
}
