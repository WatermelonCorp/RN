import { readFile } from "node:fs/promises";
import path from "node:path";
import { COMPONENT_DOC_META } from "@/lib/component-index";

type RegistryComponentRecord = {
  name: string;
  type: string;
  files: Array<{
    path: string;
    type: string;
  }>;
  dependencies?: string[];
  registryDependencies?: string[];
};

type RegistryFile = {
  components: Record<string, RegistryComponentRecord>;
};

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
  const registryRoot = path.join(
    process.cwd(),
    "..",
    "..",
    "packages",
    "registry",
  );
  const registryPath = path.join(registryRoot, "registry.json");
  const registryRaw = await readFile(registryPath, "utf8");
  const registry = JSON.parse(registryRaw) as RegistryFile;

  const items = await Promise.all(
    Object.entries(registry.components).map(async ([slug, component]) => {
      const preset = COMPONENT_DOC_META[slug] ?? {
        title: titleCase(component.name),
        description: "Reusable React Native component from the Watermelon registry.",
        category: "Components",
        usage: `watermelon add ${slug}`,
        preview: "button" as const,
      };
      const primaryFile = component.files[0];
      const sourcePath = path.join(registryRoot, "src", primaryFile.path);
      const source = await readFile(sourcePath, "utf8");

      return {
        slug,
        title: preset.title,
        description: preset.description,
        category: preset.category,
        dependencies: component.dependencies ?? [],
        registryDependencies: component.registryDependencies ?? [],
        installCommand: `watermelon add ${slug}`,
        sourcePath: primaryFile.path,
        source,
        usage: preset.usage,
        preview: preset.preview,
      } satisfies ShowcaseComponent;
    }),
  );

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
