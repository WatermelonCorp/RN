"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import type { TOCItemType } from "fumadocs-core/toc";
import { TOCItem as FumaTOCItem } from "fumadocs-core/toc";
import {
  TOCProvider as FumaTOCProvider,
  TOCScrollArea,
  useActiveAnchor,
  useTOCItems,
  TocThumb,
} from "fumadocs-ui/components/toc";
import { cn } from "@/lib/utils";
import { useTOC } from "./toc-context";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function getItemOffset(depth: number, compact: boolean) {
  if (depth <= 2) return compact ? 18 : 22;
  if (depth === 3) return compact ? 40 : 46;
  return compact ? 56 : 62;
}

function getLineOffset(depth: number, compact: boolean) {
  if (depth <= 2) return compact ? 8 : 10;
  if (depth === 3) return compact ? 20 : 24;
  return compact ? 32 : 36;
}

function DocsTOCItems({
  compact = false,
  onItemSelect,
}: {
  compact?: boolean;
  onItemSelect?: () => void;
}) {
  const items = useTOCItems();
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<{
    path: string;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || items.length === 0) return;

    const onResize = () => {
      if (container.clientHeight === 0) return;

      let width = 0;
      let height = 0;
      const path: string[] = [];

      for (let i = 0; i < items.length; i += 1) {
        const element = container.querySelector<HTMLAnchorElement>(
          `a[href="#${items[i].url.slice(1)}"]`,
        );
        if (!element) continue;

        const styles = getComputedStyle(element);
        const offset = getLineOffset(items[i].depth, compact) + 1;
        const top = element.offsetTop + parseFloat(styles.paddingTop);
        const bottom =
          element.offsetTop +
          element.clientHeight -
          parseFloat(styles.paddingBottom);

        width = Math.max(width, offset);
        height = Math.max(height, bottom);
        path.push(`${i === 0 ? "M" : "L"}${offset} ${top}`);
        path.push(`L${offset} ${bottom}`);
      }

      setSvg(
        path.length > 0
          ? {
              path: path.join(" "),
              width: width + 1,
              height,
            }
          : null,
      );
    };

    const observer = new ResizeObserver(onResize);
    onResize();
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [compact, items]);

  if (items.length === 0) return null;

  return (
    <TOCScrollArea
      className={cn(
        "mask-none py-0 pr-2",
        compact ? "max-h-[40svh]" : "max-h-[calc(100svh-7rem)]",
      )}
    >
      <div className="relative">
        {svg ? (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute start-0 top-0 rtl:-scale-x-100"
              style={{ width: svg.width, height: svg.height }}
            >
              <svg
                viewBox={`0 0 ${svg.width} ${svg.height}`}
                className="h-full w-full"
                fill="none"
              >
                <path
                  d={svg.path}
                  className="stroke-border/70"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute start-0 top-0 rtl:-scale-x-100"
              style={{
                width: svg.width,
                height: svg.height,
                maskImage: `url("data:image/svg+xml,${encodeURIComponent(
                  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.width} ${svg.height}"><path d="${svg.path}" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" fill="none" /></svg>`,
                )}")`,
                WebkitMaskImage: `url("data:image/svg+xml,${encodeURIComponent(
                  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.width} ${svg.height}"><path d="${svg.path}" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" fill="none" /></svg>`,
                )}")`,
              }}
            >
              <TocThumb
                containerRef={containerRef}
                className="bg-primary absolute top-(--fd-top) h-(--fd-height) w-full rounded-full transition-[top,height] duration-300 ease-out data-[hidden=false]:opacity-100 data-[hidden=true]:opacity-0"
              />
            </div>
          </>
        ) : null}
        <div ref={containerRef} className="relative flex flex-col">
          {items.map((item, index) => {
            const lineOffset = getLineOffset(item.depth, compact);
            const upperOffset = getLineOffset(
              items[index - 1]?.depth ?? item.depth,
              compact,
            );
            return (
              <FumaTOCItem
                key={item.url}
                href={item.url}
                onClick={() => onItemSelect?.()}
                className={cn(
                  "group text-muted-foreground/90 relative block text-sm leading-6 transition-colors duration-200",
                  "hover:text-foreground data-[active=true]:text-primary",
                  compact ? "py-1" : "py-1.5",
                )}
                style={{
                  paddingLeft: `${getItemOffset(item.depth, compact)}px`,
                }}
              >
                {lineOffset !== upperOffset ? (
                  <svg
                    aria-hidden
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    className="pointer-events-none absolute start-0 -top-1 size-4 rtl:-scale-x-100"
                  >
                    <line
                      x1={upperOffset}
                      y1="0"
                      x2={lineOffset}
                      y2="12"
                      className="stroke-border/70"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : null}
                <span
                  aria-hidden
                  className="bg-primary absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 shadow-[0_0_0_2.5px_color-mix(in_oklab,var(--background)_82%,transparent)] transition-opacity duration-200 group-data-[active=true]:opacity-100"
                  style={{ left: `${lineOffset + 1}px` }}
                />
                <span className="block truncate">{item.title}</span>
              </FumaTOCItem>
            );
          })}
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
      className="border-border/60 bg-background/92 supports-backdrop-filter:bg-background/84 overflow-hidden rounded-2xl border shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left">
        <div className="flex min-w-0 items-center gap-3">
          <HugeiconsIcon
            icon={Menu01Icon}
            size={16}
            strokeWidth={2.2}
            className="text-muted-foreground shrink-0"
          />
          <div className="min-w-0">
            <p className="text-muted-foreground text-[10px] tracking-[0.18em] uppercase">
              On this page
            </p>
            <p className="text-foreground truncate text-sm font-medium">
              {activeItem.title}
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

      <CollapsibleContent className="border-border/60 overflow-hidden border-t px-3 pb-4">
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
    <div className="sticky top-20 w-72 py-12 pl-6">
      <div className="text-muted-foreground/70 mb-5 flex items-center gap-2.5">
        <HugeiconsIcon icon={Menu01Icon} size={14} strokeWidth={2.5} />
        <span className="text-sm font-medium">On this page</span>
      </div>
      <DocsTOCItems />
    </div>
  );
}
