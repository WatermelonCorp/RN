import { getComponentLinks } from "@/lib/docs-navigation";
import registryData from "./registry-data.json";
import { customShowcaseItems } from "./custom-showcase";

export type ShowcaseComponent = {
  slug: string;
  title: string;
  description: string;
  category: string;
  dependencies: readonly string[];
  registryDependencies: readonly string[];
  installCommand: string;
  sourcePath: string;
  source: string;
};

export type ShowcaseCategory = {
  slug: string;
  title: string;
  items: ShowcaseComponent[];
};

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export async function getRegistryCatalog(): Promise<ShowcaseCategory[]> {
  const docsMeta = new Map(
    getComponentLinks().map((item) => [item.slug, item] as const),
  );

  const items = [...registryData, ...customShowcaseItems].map((component) => {
    const slug = component.slug;
    const preset = docsMeta.get(slug);

    return {
      slug,
      title: preset?.title ?? titleCase(component.name),
      description:
        preset?.description ??
        "Reusable React Native component from the Watermelon registry.",
      category: preset?.category ?? "Components",
      dependencies: component.dependencies ?? [],
      registryDependencies: component.registryDependencies ?? [],
      installCommand: `watermelon add ${slug}`,
      sourcePath: component.sourcePath,
      source: component.source,
    } satisfies ShowcaseComponent;
  });

  const grouped = items.reduce<Map<string, ShowcaseComponent[]>>(
    (acc, item) => {
      const bucket = acc.get(item.category) ?? [];
      bucket.push(item);
      acc.set(item.category, bucket);
      return acc;
    },
    new Map(),
  );

  return Array.from(grouped.entries()).map(([title, categoryItems]) => ({
    slug: title.toLowerCase().replace(/\s+/g, "-"),
    title,
    items: categoryItems.sort((a, b) => a.title.localeCompare(b.title)),
  }));
}
