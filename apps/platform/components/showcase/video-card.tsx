"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type CardItem = {
  name: string;
  image: string;
  video: string;
  description: string;
  comingSoon: boolean;
  preload: () => Promise<void>;
  install: string[];
  slug: string;
  category: string;
};

interface CardProps {
  item: CardItem;
  onClick: (item: CardItem) => void;
  trackType?: "Card" | "block";
}

export function CardCard({ item, onClick, trackType = "Card" }: CardProps) {
  const [failedVideoSrc, setFailedVideoSrc] = useState<string | null>(null);
  const showVideo = Boolean(item.video) && failedVideoSrc !== item.video;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        void item.preload?.();
        onClick(item);
      }}
      className={cn(
        "group relative flex flex-col",
        "border-border/70 bg-card/80 rounded-lg border p-1 shadow-sm",
        "transition-all duration-200",
        item.comingSoon
          ? "cursor-default opacity-50"
          : "hover:border-border cursor-pointer hover:shadow-md",
        "focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none",
      )}
    >
      {/* Preview */}
      <div
        className="bg-muted relative min-h-48 w-full overflow-hidden rounded-md sm:min-h-56"
        style={{
          aspectRatio: "16 / 9",
          transform: "translateZ(0)",
          willChange: "transform",
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
        }}
      >
        {showVideo ? (
          <video
            src={item.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={item.image || undefined}
            aria-hidden="true"
            tabIndex={-1}
            className="h-full w-full object-cover"
            onError={() => setFailedVideoSrc(item.video)}
          />
        ) : item.image ? (
          <Image
            src={item.image}
            alt={`${item.name} preview`}
            fill
            sizes="(min-width: 1280px) 32rem, 100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-2 p-4 text-center">
              <div className="text-4xl">
                {trackType === "block" ? "🧩" : "📊"}
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                {item.name}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
