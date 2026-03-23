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
import type { CommandLink } from "@/lib/docs-navigation";

const ROOT_LINKS = [
  {
    label: "Home",
    href: "/",
    keywords: ["landing", "overview", "start"],
  },
];

export function CommandMenu({
  links,
}: {
  links: {
    guides: CommandLink[];
    components: CommandLink[];
  };
}) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const navigationLinks = React.useMemo(
    () => [...ROOT_LINKS, ...links.guides],
    [links.guides],
  );
  const componentGroups = React.useMemo(
    () =>
      Array.from(
        links.components.reduce<Map<string, CommandLink[]>>((acc, item) => {
          const key = item.group ?? "Components";
          const bucket = acc.get(key) ?? [];
          bucket.push(item);
          acc.set(key, bucket);
          return acc;
        }, new Map()),
      ),
    [links.components],
  );

  React.useEffect(() => {
    [...navigationLinks, ...links.components].forEach(({ href }) =>
      router.prefetch(href),
    );
  }, [router, navigationLinks, links.components]);

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
              {navigationLinks.map((item) => (
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

            {componentGroups.map(([group, items]) => {
              return (
                <CommandGroup key={group} heading={group}>
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
