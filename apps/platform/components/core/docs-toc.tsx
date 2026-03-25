"use client";

import { useRef, useState } from "react";
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

function getPadding(depth: number, compact: boolean) {
  if (depth <= 2) return compact ? 14 : 16;
  if (depth === 3) return compact ? 28 : 32;
  return compact ? 40 : 44;
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

  if (items.length === 0) return null;

  return (
    <TOCScrollArea
      className={cn(
        "mask-none py-0 pr-2",
        compact ? "max-h-[40svh]" : "max-h-[calc(100svh-7rem)]",
      )}
    >
      <div className="relative">
        <TocThumb
          containerRef={containerRef}
          className="bg-primary absolute top-(--fd-top) left-0 h-(--fd-height) w-[2px] rounded-r-sm transition-all duration-300 ease-linear data-[hidden=false]:opacity-100 data-[hidden=true]:opacity-0"
        />
        <div
          ref={containerRef}
          className={cn(
            "border-border flex flex-col border-l",
            compact ? "gap-1" : "gap-1.5",
          )}
        >
          {items.map((item) => (
            <FumaTOCItem
              key={item.url}
              href={item.url}
              onClick={() => onItemSelect?.()}
              className={cn(
                "data-[active=true]:text-primary relative block py-1 text-sm transition-colors data-[active=true]:font-semibold",
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
