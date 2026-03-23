import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ShowcaseCategory } from "@/lib/registry-catalog";
import Image from "next/image";
import { PageHeader } from "../core/typography";

export function ComponentsIndexView({
  categories,
}: {
  categories: ShowcaseCategory[];
}) {
  return (
    <div className="space-y-8">
      <section id="component-overview" className="scroll-mt-24">
        <PageHeader
          badge="Components"
          title="Browse every installable primitive in the registry."
          subTitle="This section mirrors the shadcn docs flow: overview first, then component detail pages with install commands, usage examples, and source straight from the registry."
        />
      </section>

      {categories.map((category) => (
        <section
          key={category.slug}
          id={category.slug}
          className="scroll-mt-24 space-y-5"
        >
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium tracking-[0.22em] uppercase">
              {category.title}
            </p>
            <h2 className="text-xs font-medium tracking-tight">
              {category.items.length} {category.title.toLowerCase()} available
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {category.items.map((component) => (
              <article
                key={component.slug}
                className="border-border/70 bg-card/75 w-fit rounded-xl border p-1 shadow-sm"
              >
                <div className="space-y-2 pb-2">
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={`/logo.png`}
                      alt={component.title}
                      width={300}
                      height={160}
                    />
                  </div>

                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-lg font-medium">{component.title}</h3>
                    <Button
                      asChild
                      className="w-full sm:w-auto"
                      variant="ghost"
                    >
                      <Link href={`/components/${component.slug}`}>View</Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
