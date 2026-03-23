"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, FileCodeCornerIcon } from "@hugeicons/core-free-icons";
import { CodeBlock } from "../showcase/code-block";
import { GlassContainer } from "../core/3d-container";

interface ComponentPreviewProps {
  children?: React.ReactNode;
  code?: string;
  className?: string;
  video?: string;
  poster?: string;
}

export function ComponentPreview({
  children,
  code,
  className,
  video,
  poster,
}: ComponentPreviewProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  return (
    <GlassContainer>
      <div
        className={cn(
          "bg-background relative w-full max-w-full min-w-0 overflow-hidden rounded-[18px] border",
          className,
        )}
      >
        {/* Header with tabs and actions */}
        <div className="flex flex-col gap-3 px-2 py-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-1">
            {/* Preview Tab */}
            <button
              onClick={() => setActiveTab("preview")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
                activeTab === "preview"
                  ? "bg-background text-foreground border shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              <HugeiconsIcon icon={ViewIcon} size={14} />
              Preview
            </button>

            {/* Code Tab */}
            {code && (
              <button
                onClick={() => setActiveTab("code")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
                  activeTab === "code"
                    ? "bg-background text-foreground border shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                <HugeiconsIcon icon={FileCodeCornerIcon} size={14} />
                Code
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          {/* Preview Panel */}
          {activeTab === "preview" && (
            <div className="from-muted/50 flex min-h-[280px] w-full min-w-0 items-center justify-center">
              <div className="relative w-full min-w-0">
                <React.Suspense
                  fallback={
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Loading...
                    </div>
                  }
                >
                  {video ? (
                    <div className="border-border/70 bg-card/90 mx-auto w-full max-w-full overflow-hidden rounded-b-xl border shadow-sm sm:max-w-4xl">
                      <video
                        src={video}
                        poster={poster}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="max-h-[560px] w-full bg-black object-contain"
                      />
                    </div>
                  ) : (
                    children
                  )}
                </React.Suspense>
              </div>
            </div>
          )}

          {/* Code Panel */}
          {activeTab === "code" && code && (
            <div className="max-h-[400px] w-full min-w-0 overflow-auto">
              <CodeBlock showLineNumbers={true} className="rounded-none">
                {code}
              </CodeBlock>
            </div>
          )}
        </div>
      </div>
    </GlassContainer>
  );
}

// Export a simpler version for MDX usage
export function CompPreview(props: ComponentPreviewProps) {
  return <ComponentPreview {...props} />;
}
