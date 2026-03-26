"use client";

import { useState } from "react";
import { SpotlightButton } from "@/components/animate-ui/components/buttons/spotlight";

export function SpotlightButtonDemo() {
  const [count, setCount] = useState(0);

  return (
    <div className="grid min-h-[300px] gap-4 rounded-b-xl border-x border-b bg-card p-5 sm:p-6">
      <div className="flex items-center justify-center rounded-[1.25rem] border bg-muted/50 p-6">
        <SpotlightButton
          size="lg"
          badge="Beta"
          onClick={() => setCount((value) => value + 1)}
        >
          {count === 0
            ? "Launch animation"
            : `Launched ${count} time${count === 1 ? "" : "s"}`}
        </SpotlightButton>
      </div>
      <div className="border-border/70 flex items-center justify-center rounded-[1.25rem] border bg-muted/30 p-6">
        <SpotlightButton variant="neutral" badge="Update">
          View release notes
        </SpotlightButton>
      </div>
      <p className="text-muted-foreground mx-auto max-w-md text-center text-sm leading-6">
        This preview is live. Click the primary button to verify the motion,
        hover, and pressed states instead of relying on a prerecorded video.
      </p>
    </div>
  );
}

export function SpotlightButtonInlineDemo() {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-b-xl border-x border-b bg-muted/20 p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <SpotlightButton
          badge={clicked ? "Live" : "Launch"}
          onClick={() => setClicked((value) => !value)}
        >
          {clicked ? "Preview running" : "Open preview build"}
        </SpotlightButton>
        <p className="text-muted-foreground text-sm">
          Tap again to toggle the label state.
        </p>
      </div>
    </div>
  );
}
