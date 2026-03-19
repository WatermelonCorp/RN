import { COMPONENT_DOC_META } from "@/lib/component-index";
import registryData from "./registry-data.json";

export type ShowcaseComponent = {
  slug: string;
  title: string;
  description: string;
  category: string;
  dependencies: string[];
  registryDependencies: string[];
  installCommand: string;
  sourcePath: string;
  source: string;
  usage: string;
  preview: "button" | "text";
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
  const items = registryData.map((component) => {
    const slug = component.slug;
    const preset = COMPONENT_DOC_META[slug] ?? {
      title: titleCase(component.name),
      description: "Reusable React Native component from the Watermelon registry.",
      category: "Components",
      usage: `watermelon add ${slug}`,
      preview: "button" as const,
    };

    return {
      slug,
      title: preset.title,
      description: preset.description,
      category: preset.category,
      dependencies: component.dependencies ?? [],
      registryDependencies: component.registryDependencies ?? [],
      installCommand: `watermelon add ${slug}`,
      sourcePath: component.sourcePath,
      source: component.source,
      usage: preset.usage,
      preview: preset.preview,
    } satisfies ShowcaseComponent;
  });

  const grouped = items.reduce<Map<string, ShowcaseComponent[]>>((acc, item) => {
    const bucket = acc.get(item.category) ?? [];
    bucket.push(item);
    acc.set(item.category, bucket);
    return acc;
  }, new Map());

  return Array.from(grouped.entries()).map(([title, categoryItems]) => ({
    slug: title.toLowerCase().replace(/\s+/g, "-"),
    title,
    items: categoryItems.sort((a, b) => a.title.localeCompare(b.title)),
  }));
}
