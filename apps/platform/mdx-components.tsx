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
        "scroll-m-20 text-2xl font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "border-border mt-2 scroll-m-20 pb-2 text-xl font-medium tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "mt-4 scroll-m-20 text-base font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn(
        "text-muted-foreground leading-7 not-first:mt-2",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn(
        "text-foreground decoration-border underline underline-offset-4",
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
