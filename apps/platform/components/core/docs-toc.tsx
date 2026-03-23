"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import type { TOCItemType } from "fumadocs-core/toc";
import { TOCItem as FumaTOCItem } from "fumadocs-core/toc";
import {
  TOCProvider as FumaTOCProvider,
  TOCScrollArea,
  useActiveAnchor,
  useActiveAnchors,
  useTOCItems,
} from "fumadocs-ui/components/toc";
import { cn } from "@/lib/utils";
import { useTOC } from "./toc-context";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function getPadding(depth: number, compact: boolean) {
  if (depth <= 2) return compact ? 14 : 16;
  if (depth === 3) return compact ? 28 : 32;
  return compact ? 40 : 44;
}

function getPathX(depth: number, compact: boolean) {
  return getPadding(depth, compact) - (compact ? 6 : 8);
}

function createPath(
  items: TOCItemType[],
  positions: Record<string, { x: number; y: number }>,
) {
  if (items.length === 0) return "";

  let path = "";

  items.forEach((item, index) => {
    const id = item.url.replace(/^#/, "");
    const current = positions[id];
    if (!current) return;

    if (index === 0) {
      path += `M ${current.x} ${current.y}`;
      return;
    }

    const previousId = items[index - 1]?.url.replace(/^#/, "");
    const previous = previousId ? positions[previousId] : null;
    if (!previous) return;

    if (previous.x === current.x) {
      path += ` L ${current.x} ${current.y}`;
      return;
    }

    const midY = previous.y + (current.y - previous.y) / 2;
    path += ` L ${previous.x} ${midY}`;
    path += ` Q ${previous.x} ${midY} ${current.x} ${midY + 8}`;
    path += ` L ${current.x} ${current.y}`;
  });

  return path;
}

function DocsTOCItems({
  compact = false,
  onItemSelect,
}: {
  compact?: boolean;
  onItemSelect?: () => void;
}) {
  const items = useTOCItems();
  const activeAnchors = useActiveAnchors();
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    const updatePositions = () => {
      const container = containerRef.current;
      if (!container) return;

      const nextPositions: Record<string, { x: number; y: number }> = {};

      items.forEach((item) => {
        const id = item.url.replace(/^#/, "");
        const anchor = container.querySelector<HTMLAnchorElement>(
          `a[href="${item.url}"]`,
        );

        if (!anchor) return;

        nextPositions[id] = {
          x: getPathX(item.depth, compact),
          y: anchor.offsetTop + anchor.offsetHeight / 2,
        };
      });

      setPositions(nextPositions);
    };

    updatePositions();

    const resizeObserver = new ResizeObserver(updatePositions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener("resize", updatePositions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePositions);
    };
  }, [compact, items]);

  const activeItems = useMemo(
    () =>
      items.filter((item) => activeAnchors.includes(item.url.replace(/^#/, ""))),
    [activeAnchors, items],
  );

  const activePath = useMemo(
    () => createPath(activeItems, positions),
    [activeItems, positions],
  );

  return (
    <TOCScrollArea
      className={cn(
        "mask-none py-0 pr-2",
        compact ? "max-h-[40svh]" : "max-h-[calc(100svh-7rem)]",
      )}
    >
      <div className="relative">
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          <motion.path
            d={activePath}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
            initial={false}
            animate={{ d: activePath }}
            transition={{
              duration: 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </svg>
        <div
          ref={containerRef}
          className={cn(
            "flex flex-col",
            compact ? "gap-1" : "gap-1.5",
          )}
        >
          {items.map((item) => (
            <FumaTOCItem
              key={item.url}
              href={item.url}
              onClick={() => onItemSelect?.()}
              className={cn(
                "relative block py-1 text-sm transition-colors data-[active=true]:font-semibold data-[active=true]:text-primary",
                "text-muted-foreground/65 hover:text-foreground",
                !compact && "py-1.5",
              )}
              style={{ paddingLeft: `${getPadding(item.depth, compact)}px` }}
            >
              {item.title}
            </FumaTOCItem>
          ))}
        </div>
      </div>
    </TOCScrollArea>
  );
}

export function DocsTOC({ mobile = false }: { mobile?: boolean }) {
  const { items } = useTOC();

  if (items.length === 0) return null;

  return (
    <FumaTOCProvider toc={items}>
      <DocsTOCInner mobile={mobile} />
    </FumaTOCProvider>
  );
}

function MobileTOC({ activeItem }: { activeItem: TOCItemType }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="bg-background/92 supports-backdrop-filter:bg-background/84 backdrop-blur"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 px-2 py-1 text-left">
        <div className="flex min-w-0 items-center gap-3">
          <HugeiconsIcon
            icon={Menu01Icon}
            size={16}
            strokeWidth={2.2}
            className="text-muted-foreground"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{activeItem.title}</p>
            <p className="text-muted-foreground text-[8px] tracking-[0.18em] uppercase">
              On this page
            </p>
          </div>
        </div>
        <HugeiconsIcon
          icon={ArrowUp01Icon}
          className={cn(
            "text-muted-foreground transition-transform duration-200",
            !open && "rotate-180",
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="border-border/60 overflow-hidden border-t px-4 pb-4">
        <div className="pt-3">
          <DocsTOCItems compact onItemSelect={() => setOpen(false)} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function DocsTOCInner({ mobile = false }: { mobile?: boolean }) {
  const items = useTOCItems();
  const activeId = useActiveAnchor();

  if (items.length === 0) return null;

  const activeItem =
    items.find((item) => item.url === `#${activeId}`) ?? items[0];

  if (mobile) {
    return <MobileTOC activeItem={activeItem} />;
  }

  return (
    <div className="sticky top-20 w-64 py-12 pl-8">
      <div className="text-muted-foreground/55 mb-10 flex items-center gap-2.5">
        <HugeiconsIcon icon={Menu01Icon} size={14} strokeWidth={2.5} />
        <span className="text-[10px] font-semibold tracking-[0.22em] uppercase">
          On this page
        </span>
      </div>
      <DocsTOCItems />
    </div>
  );
}
