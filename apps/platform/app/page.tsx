import { getRegistryCatalog } from "@/lib/registry-catalog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/core/landing-navbar";

export default async function Home() {
  const categories = await getRegistryCatalog();
  const count = categories.reduce(
    (total, category) => total + category.items.length,
    0,
  );

  return (
      <>
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 sm:px-6 lg:px-10">
        <LandingNavbar />

        <main className="flex flex-1 flex-col gap-16 py-10 sm:py-12">
          <section className="grid w-full gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="space-y-8">
              <p className="text-muted-foreground text-xs font-medium tracking-[0.26em] uppercase">
                React Native Registry
              </p>
              <h1 className="max-w-5xl text-6xl leading-none font-[family:var(--font-display)] font-semibold tracking-[-0.06em] sm:text-7xl lg:text-[8.5rem]">
                Watermelon RN
              </h1>
              <p className="text-muted-foreground max-w-xl text-base leading-8 sm:text-lg">
                A minimal registry for installable React Native components.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/components">Browse Components</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/installation">Installation</Link>
                </Button>
              </div>
            </div>

            <div className="border-border/70 flex flex-col justify-end gap-3 border-l pl-6">
              <p className="text-muted-foreground text-sm">{count} components</p>
              <p className="text-muted-foreground text-sm">CLI installation</p>
            </div>
          </section>

          <section className="border-border/70 grid gap-8 border-t pt-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start">
            <div className="space-y-3">
              <p className="text-muted-foreground text-xs font-medium tracking-[0.26em] uppercase">
                Why Watermelon
              </p>
              <h2 className="text-3xl leading-tight font-[family:var(--font-display)] font-semibold tracking-[-0.04em] sm:text-4xl">
                Copy the component, own the code, ship faster.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border-border/70 bg-card/60 rounded-2xl border p-5">
                <p className="text-sm font-medium">Registry-first workflow</p>
                <p className="text-muted-foreground mt-2 text-sm leading-7">
                  Install only what you need and keep the generated files inside
                  your app.
                </p>
              </div>

              <div className="border-border/70 bg-card/60 rounded-2xl border p-5">
                <p className="text-sm font-medium">Native-first primitives</p>
                <p className="text-muted-foreground mt-2 text-sm leading-7">
                  Build React Native interfaces with components designed for
                  real mobile product surfaces.
                </p>
              </div>

              <div className="border-border/70 bg-card/60 rounded-2xl border p-5">
                <p className="text-sm font-medium">Docs + CLI together</p>
                <p className="text-muted-foreground mt-2 text-sm leading-7">
                  Browse examples, install commands, and API details in the same
                  place.
                </p>
              </div>

              <div className="border-border/70 bg-card/60 rounded-2xl border p-5">
                <p className="text-sm font-medium">Composable by default</p>
                <p className="text-muted-foreground mt-2 text-sm leading-7">
                  Start with a tiny base and adapt each primitive to your design
                  system over time.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
