import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ShowcaseCategory } from "@/lib/registry-catalog";
import Image from "next/image";
import { PageHeader } from "../core/typography";

export function ComponentsIndexView({
  categories,
  badge,
  title,
  subTitle,
  showOnly = null,
}: {
  categories: ShowcaseCategory[];
  badge: string;
  title: string;
  subTitle: string;
  showOnly?: string[] | null;
}) {
  const filtered = showOnly
    ? categories.filter((category) => showOnly.includes(category.title))
    : categories;

  return (
    <div className="space-y-8">
      <section id="component-overview" className="scroll-mt-24">
        <PageHeader badge={badge} title={title} subTitle={subTitle} />
      </section>

      {filtered
        .filter((section) => section.items.length > 0)
        .map((section) => (
          <section
            key={section.title}
            id={section.title.toLowerCase().replace(/ /g, "-")}
            className="scroll-mt-24 space-y-5"
          >
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-medium tracking-[0.22em] uppercase">
                {section.title}
              </p>
              <h2 className="text-xs font-medium tracking-tight">
                {section.items.length} available
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {section.items.map((component) => (
                <article
                  key={component.slug}
                  className="border-border/70 bg-card/75 w-full rounded-xl border p-1 shadow-sm"
                >
                  <div className="space-y-2 pb-2">
                    <div className="overflow-hidden rounded-lg">
                      <Image
                        src={`/logo.png`}
                        alt={component.title}
                        width={400}
                        height={200}
                        className="w-full object-cover"
                      />
                    </div>

                    <div className="flex items-center justify-between px-2">
                      <h3 className="line-clamp-1 text-lg font-medium">
                        {component.title}
                      </h3>
                      <Button asChild size="sm" variant="ghost">
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
