import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

type MDXComponentProps = {
  className?: string;
  [key: string]: unknown;
};

type MDXComponents = Record<string, ComponentType<MDXComponentProps>>;

export const customMDXComponents: MDXComponents = {
    h1: ({ className, ...props }) => (
      <h1
        className={cn(
          "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl font-[family:var(--font-display)]",
          className,
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }) => (
      <h2
        className={cn(
          "scroll-m-20 border-border border-b pb-2 mt-10 text-3xl font-semibold tracking-tight first:mt-0 font-[family:var(--font-display)]",
          className,
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }) => (
      <h3
        className={cn(
          "scroll-m-20 mt-8 text-2xl font-semibold tracking-tight font-[family:var(--font-display)]",
          className,
        )}
        {...props}
      />
    ),
    p: ({ className, ...props }) => (
      <p
        className={cn(
          "leading-7 text-muted-foreground not-first:mt-6",
          className,
        )}
        {...props}
      />
    ),
    a: ({ className, ...props }) => (
      <a
        className={cn(
          "text-foreground decoration-border font-medium underline underline-offset-4",
          className,
        )}
        {...props}
      />
    ),
    ul: ({ className, ...props }) => (
      <ul
        className={cn(
          "text-muted-foreground list-disc space-y-2 pl-6",
          className,
        )}
        {...props}
      />
    ),
    ol: ({ className, ...props }) => (
      <ol
        className={cn(
          "text-muted-foreground list-decimal space-y-2 pl-6",
          className,
        )}
        {...props}
      />
    ),
    li: ({ className, ...props }) => (
      <li className={cn("leading-8", className)} {...props} />
    ),
    strong: ({ className, ...props }) => (
      <strong
        className={cn("text-foreground font-semibold", className)}
        {...props}
      />
    ),
    code: ({ className, ...props }) => (
      <code
        className={cn(
          "bg-muted text-foreground rounded-md px-1.5 py-0.5 font-mono text-[0.9em]",
          className,
        )}
        {...props}
      />
    ),
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...customMDXComponents,
    ...components,
  };
}
