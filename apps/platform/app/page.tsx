import { getRegistryCatalog } from "@/lib/registry-catalog";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const categories = await getRegistryCatalog();
  const count = categories.reduce(
    (total, category) => total + category.items.length,
    0,
  );

  return (
    <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-10">
      <section className="grid w-full gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-8">
          <p className="text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground">
            React Native Registry
          </p>
          <h1 className="max-w-5xl font-[family:var(--font-display)] text-6xl leading-none font-semibold tracking-[-0.06em] sm:text-7xl lg:text-[8.5rem]">
            Watermelon RN
          </h1>
          <p className="max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
            A minimal registry for installable React Native components.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/components">Browse Components</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/components/installation">Installation</Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-3 border-l border-border/70 pl-6">
          <p className="text-sm text-muted-foreground">{count} components</p>
          <p className="text-sm text-muted-foreground">CLI installation</p>
        </div>
      </section>
    </main>
  );
}
