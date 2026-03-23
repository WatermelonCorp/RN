"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { CopyButton } from "../animate-ui/components/buttons/copy";
import { GlassContainer } from "../core/3d-container";

type HighlighterProps = Record<string, unknown> & {
  children?: string;
};

type SyntaxHighlighterComponent = ComponentType<HighlighterProps> & {
  registerLanguage: (name: string, language: unknown) => void;
};

function getSyntaxHighlighter(
  module: unknown,
): SyntaxHighlighterComponent | null {
  if (!module || typeof module !== "object") {
    return null;
  }

  const record = module as Record<string, unknown>;
  const candidate =
    record.default ??
    record.PrismLight ??
    (typeof record === "function" ? record : null);

  if (
    candidate &&
    typeof candidate === "function" &&
    typeof (candidate as SyntaxHighlighterComponent).registerLanguage ===
      "function"
  ) {
    return candidate as SyntaxHighlighterComponent;
  }

  return null;
}

function getLanguageModule(module: unknown) {
  if (!module || typeof module !== "object") {
    return null;
  }

  const record = module as Record<string, unknown>;
  return record.default ?? module;
}

interface CodeBlockProps {
  children: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
  title?: string;
  mobile?: boolean;
}

export function CodeBlock({
  children,
  language = "tsx",
  showLineNumbers = true,
  className,
  title,
  mobile = false,
}: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [syntax, setSyntax] = useState<{
    SyntaxHighlighter: SyntaxHighlighterComponent;
    oneLight: Record<string, unknown>;
    oneDark: Record<string, unknown>;
  } | null>(null);
  const code = children?.trim() || "";

  useEffect(() => {
    let active = true;

    const loadSyntax = async () => {
      try {
        const [
          prismLightModule,
          { oneLight, oneDark },
          tsx,
          typescript,
          bash,
          json,
          css,
          markdown,
          javascript,
        ] = await Promise.all([
          import("react-syntax-highlighter/dist/esm/prism-light"),
          import("react-syntax-highlighter/dist/esm/styles/prism"),
          import("react-syntax-highlighter/dist/esm/languages/prism/tsx"),
          import("react-syntax-highlighter/dist/esm/languages/prism/typescript"),
          import("react-syntax-highlighter/dist/esm/languages/prism/bash"),
          import("react-syntax-highlighter/dist/esm/languages/prism/json"),
          import("react-syntax-highlighter/dist/esm/languages/prism/css"),
          import("react-syntax-highlighter/dist/esm/languages/prism/markdown"),
          import("react-syntax-highlighter/dist/esm/languages/prism/javascript"),
        ]);

        if (!active) return;

        const SyntaxHighlighter = getSyntaxHighlighter(prismLightModule);

        if (!SyntaxHighlighter) {
          setSyntax(null);
          return;
        }

        const register = (name: string, mod: unknown) => {
          const lang = getLanguageModule(mod);
          if (lang) SyntaxHighlighter.registerLanguage(name, lang);
        };

        register("tsx", tsx);
        register("typescript", typescript);
        register("bash", bash);
        register("json", json);
        register("css", css);
        register("markdown", markdown);
        register("javascript", javascript);

        setSyntax({
          SyntaxHighlighter,
          oneLight: oneLight as Record<string, unknown>,
          oneDark: oneDark as Record<string, unknown>,
        });
      } catch {
        setSyntax(null);
      }
    };

    loadSyntax();
    return () => {
      active = false;
    };
  }, []);

  return (
    <GlassContainer
      variant="strong"
      className={cn(
        "group w-full max-w-full min-w-0 rounded-2xl p-0.5",
        className,
      )}
    >
      <div className="border-border/70 bg-card/88 relative flex min-w-0 max-w-full flex-col overflow-hidden rounded-[calc(1rem-2px)] border">
        <div className="border-border/60 bg-background/82 sticky top-0 z-10 flex shrink-0 items-center justify-between border-b px-1 py-1 backdrop-blur-md">
          <p className="text-muted-foreground pl-2 text-xs font-medium tracking-[0.24em] lowercase">
            {title || language}
          </p>

          <CopyButton variant="secondary" size="xs" content={code} />
        </div>

        <div className="max-h-[min(70vh,40rem)] min-h-0 overflow-auto">
          {syntax ? (
            <syntax.SyntaxHighlighter
              language={language}
              style={isDark ? syntax.oneDark : syntax.oneLight}
              useInlineStyles
              className="text-foreground"
              showLineNumbers={mobile ? false : showLineNumbers}
              customStyle={{
                margin: 0,
                padding: "1rem",
                fontSize: "13px",
                lineHeight: "1.6",
                background: "transparent",
                overflowX: "auto",
                overflowY: "visible",
                minWidth: "100%",
                width: "max-content",
                maxWidth: "none",
                whiteSpace: "pre",
                wordBreak: "normal",
              }}
              codeTagProps={{
                style: {
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  whiteSpace: "pre",
                  wordBreak: "normal",
                },
              }}
            >
              {code}
            </syntax.SyntaxHighlighter>
          ) : (
            <pre className="m-0 min-w-full w-max overflow-x-auto overflow-y-visible p-4 text-[13px] leading-[1.6] whitespace-pre">
              <code className="font-mono whitespace-pre">
                {code}
              </code>
            </pre>
          )}
        </div>
      </div>
    </GlassContainer>
  );
}
