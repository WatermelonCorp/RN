"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { useTOC } from "./toc-context";
import type { TocItem } from "./toc-context";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type ItemPosition = {
  top: number;
  depth: number;
};

type ActivePosition = {
  x: number;
  y: number;
};

function getX(depth?: number) {
  const level = depth === 3 ? 1 : 0;
  return level * 16 + 4;
}

function getScrollContainer(element?: HTMLElement | null) {
  return (
    element?.closest('[data-slot="sidebar-inset"]') ??
    document.querySelector<HTMLElement>('[data-slot="sidebar-inset"]')
  );
}

function DocsTOCNav({
  items,
  activeId,
  itemPositions,
  activePos,
  containerRef,
  compact = false,
  onItemSelect,
}: {
  items: TocItem[];
  activeId: string | null;
  itemPositions: Record<string, ItemPosition>;
  activePos: ActivePosition | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  compact?: boolean;
  onItemSelect?: () => void;
}) {
  const svgPath = useMemo(() => {
    if (items.length < 2) return "";

    let path = "";

    items.forEach((item, index) => {
      const pos = itemPositions[item.id];
      if (!pos) return;

      const x = getX(item.depth);
      const y = pos.top + 0.5;

      if (index === 0) {
        path += `M ${x} ${y}`;
        return;
      }

      const prev = items[index - 1];
      const prevPos = itemPositions[prev.id];
      if (!prevPos) return;

      const prevX = getX(prev.depth);
      const prevY = prevPos.top + 0.5;

      if (x === prevX) {
        path += ` L ${x} ${y}`;
        return;
      }

      const midY = prevY + (y - prevY) / 2;
      path += ` L ${prevX} ${midY - 4} L ${x} ${midY + 4} L ${x} ${y}`;
    });

    return path;
  }, [items, itemPositions]);

  return (
    <div className="relative overflow-visible" ref={containerRef}>
      <svg className="pointer-events-none absolute top-0 left-0 h-full w-full">
        <motion.path
          d={svgPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-border/40"
          initial={false}
          animate={{ d: svgPath }}
          transition={{ type: "spring", stiffness: 250, damping: 30 }}
        />
      </svg>

      <AnimatePresence>
        {activePos ? (
          <motion.div
            layoutId={`toc-diamond-${compact ? "mobile" : "desktop"}`}
            className="absolute z-10 size-1.5"
            style={{
              left: activePos.x - 3,
              top: activePos.y - 3,
              rotate: 45,
            }}
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="bg-foreground size-full shadow-sm" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <nav className={cn("flex flex-col pr-4", compact ? "gap-1" : "gap-1.5")}>
        {items.map((item) => {
          const isActive = activeId === item.id;
          const xOffset = getX(item.depth) - 4 + 16;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-toc-id={item.id}
              data-depth={item.depth ?? 1}
              onClick={(event) => {
                event.preventDefault();
                const element = document.getElementById(item.id);
                if (!element) return;

                const scrollToTarget = () => {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    inline: "nearest",
                  });
                };

                if (compact && onItemSelect) {
                  onItemSelect();
                  requestAnimationFrame(() => {
                    requestAnimationFrame(scrollToTarget);
                  });
                } else {
                  scrollToTarget();
                }
              }}
              className={cn(
                "relative block transition-all duration-200",
                compact ? "py-1 text-sm" : "py-1.5",
                isActive
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground/60 hover:text-foreground",
              )}
              style={{ paddingLeft: `${xOffset}px` }}
            >
              {item.title}
            </a>
          );
        })}
      </nav>
    </div>
  );
}

export function DocsTOC({ mobile = false }: { mobile?: boolean }) {
  const { items, activeId, setActiveId } = useTOC();
  const observer = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [itemPositions, setItemPositions] = useState<
    Record<string, ItemPosition>
  >({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];
    const scrollContainer = getScrollContainer(headings[0]);

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              left.boundingClientRect.top - right.boundingClientRect.top,
          );

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        root: scrollContainer,
        rootMargin: "-80px 0px -60% 0px",
        threshold: [0, 1],
      },
    );

    headings.forEach((heading) => observer.current?.observe(heading));

    return () => observer.current?.disconnect();
  }, [items, setActiveId]);

  useEffect(() => {
    const scrollContainer = getScrollContainer(containerRef.current);

    const update = () => {
      if (!containerRef.current) return;

      const positions: Record<string, ItemPosition> = {};
      const links = containerRef.current.querySelectorAll("a[data-toc-id]");

      links.forEach((link) => {
        const id = link.getAttribute("data-toc-id");
        if (!id) return;

        const depth = Number.parseInt(
          link.getAttribute("data-depth") || "1",
          10,
        );
        const rect = link.getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();

        positions[id] = {
          top: rect.top - containerRect.top + rect.height / 2,
          depth,
        };
      });

      setItemPositions(positions);
    };

    update();
    scrollContainer?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      scrollContainer?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  const activePos = useMemo<ActivePosition | null>(() => {
    if (!activeId || !itemPositions[activeId]) return null;
    const pos = itemPositions[activeId];

    return {
      x: getX(pos.depth),
      y: pos.top,
    };
  }, [activeId, itemPositions]);

  if (items.length === 0) return null;

  if (mobile) {
    const activeItem = items.find((item) => item.id === activeId) ?? items[0];

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
              <p className="truncate text-sm font-medium">
                {activeItem?.title}
              </p>
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
            <DocsTOCNav
              items={items}
              activeId={activeId}
              itemPositions={itemPositions}
              activePos={activePos}
              containerRef={containerRef}
              compact
              onItemSelect={() => setOpen(false)}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div className="sticky top-20 w-64 py-12 pl-8">
      <div className="text-muted-foreground/55 mb-10 flex items-center gap-2.5">
        <HugeiconsIcon icon={Menu01Icon} size={14} strokeWidth={2.5} />
        <span className="text-[10px] font-semibold tracking-[0.22em] uppercase">
          On this page
        </span>
      </div>
      <DocsTOCNav
        items={items}
        activeId={activeId}
        itemPositions={itemPositions}
        activePos={activePos}
        containerRef={containerRef}
      />
    </div>
  );
}
