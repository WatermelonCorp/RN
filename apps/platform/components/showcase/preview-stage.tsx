import { cn } from "@/lib/utils";

interface PreviewStageProps {
  kind: "button" | "text";
}

export function PreviewStage({ kind }: PreviewStageProps) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-[linear-gradient(180deg,rgba(8,145,178,0.06),rgba(255,255,255,0.7))] p-4 dark:bg-[linear-gradient(180deg,rgba(8,145,178,0.16),rgba(24,24,27,0.92))]">
      <div className="absolute inset-x-8 top-3 h-6 rounded-full bg-black/95" />
      <div className="mx-auto flex min-h-[27rem] w-full max-w-[18rem] rounded-[2.2rem] border border-black/10 bg-white p-5 shadow-[0_30px_80px_rgba(8,145,178,0.15)] dark:border-white/10 dark:bg-zinc-950">
        {kind === "button" ? <ButtonPreview /> : <TextPreview />}
      </div>
    </div>
  );
}

function ButtonPreview() {
  return (
    <div className="flex w-full flex-col justify-center gap-4">
      <PreviewButton className="bg-black text-white dark:bg-white dark:text-black">
        Primary
      </PreviewButton>
      <PreviewButton className="bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
        Secondary
      </PreviewButton>
      <PreviewButton className="border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
        Outline
      </PreviewButton>
      <button className="min-h-11 rounded-full bg-transparent text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Ghost
      </button>
      <PreviewButton className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black">
        Strong
      </PreviewButton>
      <PreviewButton className="bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
        Soft
      </PreviewButton>
    </div>
  );
}

function TextPreview() {
  return (
    <div className="flex w-full flex-col justify-center gap-3 text-left">
      <span className="font-[family:var(--font-display)] text-4xl leading-none font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        Native copy, but with hierarchy.
      </span>
      <span className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
        Build headings, long-form paragraphs, muted helper text, and inline code
        from a single composable primitive.
      </span>
      <span className="w-fit rounded-md bg-zinc-100 px-2 py-1 font-mono text-xs font-semibold text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
        {"<Text variant=\"code\" />"}
      </span>
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Lead, muted, large, and semantic heading variants are included.
      </span>
    </div>
  );
}

function PreviewButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "min-h-11 rounded-full px-4 text-sm font-medium shadow-sm transition",
        className,
      )}
    >
      {children}
    </button>
  );
}
