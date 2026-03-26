"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type TextVariant =
  | "default"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "blockquote"
  | "code"
  | "lead"
  | "large"
  | "small"
  | "muted";

interface TextProps extends React.ComponentProps<"p"> {
  variant?: TextVariant;
}

const TextStyleContext = React.createContext<string | undefined>(undefined);

function Text({ className, variant = "default", ...props }: TextProps) {
  const styles = {
    default: "text-foreground",
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
    h4: "scroll-m-20 text-xl font-semibold tracking-tight",
    p: "leading-7 [&:not(:first-child)]:mt-6",
    blockquote: "mt-6 border-l-2 pl-6 italic",
    code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
    lead: "text-xl text-muted-foreground",
    large: "text-lg font-semibold",
    small: "text-sm font-medium leading-none",
    muted: "text-sm text-muted-foreground",
  };

  return (
    <p
      className={cn(styles[variant], className)}
      {...props}
    />
  );
}

export { Text, TextStyleContext };
