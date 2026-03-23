import type { Metadata } from "next";
import { Geist_Mono, Newsreader, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { NextProvider } from "fumadocs-core/framework/next";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "700"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Watermelon RN Registry",
  description:
    "A shadcn-like registry and showcase for React Native components.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", roboto.variable, newsreader.variable)}
      suppressHydrationWarning
    >
      <body className={`${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <NextProvider>
            <TooltipProvider>
              <div className="min-h-[calc(100vh-var(--header-height,56px))]">
                {children}
              </div>
            </TooltipProvider>
          </NextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
