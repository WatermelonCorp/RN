import { docsSource } from "@/lib/docs-source";

export type GuideLink = {
  title: string;
  url: string;
};

export type ComponentLink = {
  slug: string;
  title: string;
  description: string;
  category: string;
  url: string;
};

export type ComponentGroup = {
  title: string;
  items: ComponentLink[];
};

export function getGuideLinks(): GuideLink[] {
  return docsSource
    .getPages()
    .filter((page) => page.data.kind === "guide")
    .map((page) => ({
      title: page.data.badge ?? page.data.title,
      url: page.url,
    }));
}

export function getComponentLinks(): ComponentLink[] {
  return docsSource
    .getPages()
    .filter((page) => page.data.kind === "component")
    .map((page) => ({
      slug: page.slugs.at(-1) ?? page.url.split("/").at(-1) ?? "",
      title: page.data.title,
      description: page.data.description ?? "",
      category: page.data.category ?? "Components",
      url: page.url,
    }));
}

export function getComponentGroups(): ComponentGroup[] {
  const grouped = getComponentLinks().reduce<Map<string, ComponentLink[]>>(
    (acc, page) => {
      const bucket = acc.get(page.category) ?? [];
      bucket.push(page);
      acc.set(page.category, bucket);
      return acc;
    },
    new Map(),
  );

  return Array.from(grouped.entries()).map(([title, items]) => ({
    title,
    items,
  }));
}

export function getComponentPager(slug: string) {
  const pages = getComponentLinks();
  const index = pages.findIndex((page) => page.slug === slug);

  if (index === -1) return {};

  const previous = pages[index - 1];
  const next = pages[index + 1];

  return {
    previous: previous
      ? {
          href: previous.url,
          title: previous.title,
          description: previous.description,
        }
      : undefined,
    next: next
      ? {
          href: next.url,
          title: next.title,
          description: next.description,
        }
      : undefined,
  };
}

export type CommandLink = {
  label: string;
  href: string;
  keywords: string[];
  group?: string;
};

export function getCommandLinks(): {
  guides: CommandLink[];
  components: CommandLink[];
} {
  const guideLinks = getGuideLinks().map((item) => ({
    label: item.title,
    href: item.url,
    keywords: ["docs", "guide", item.title.toLowerCase()],
  }));

  const componentLinks = getComponentGroups().flatMap((group) =>
    group.items.map((item) => ({
      label: item.title,
      href: item.url,
      keywords: [
        item.slug,
        group.title.toLowerCase(),
        ...item.description.toLowerCase().split(/\s+/).slice(0, 6),
      ],
      group: group.title,
    })),
  );

  return {
    guides: guideLinks,
    components: componentLinks,
  };
}
