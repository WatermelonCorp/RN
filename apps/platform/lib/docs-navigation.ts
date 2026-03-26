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

const ANIMATED_COMPONENT_CATEGORY = "Animated Components";
const COMPONENTS_CATEGORY = "Components";

type DocsNavigationPageData = {
  kind?: "guide" | "component";
  badge?: string;
  title: string;
  description?: string;
  category?: string;
};

export function getGuideLinks(): GuideLink[] {
  return docsSource
    .getPages()
    .filter((page) => {
      const pageData = page.data as DocsNavigationPageData;
      return pageData.kind === "guide";
    })
    .map((page) => {
      const pageData = page.data as DocsNavigationPageData;

      return {
        title: pageData.badge ?? pageData.title,
        url: page.url,
      };
    });
}

export function getComponentLinks(): ComponentLink[] {
  return docsSource
    .getPages()
    .filter((page) => {
      const pageData = page.data as DocsNavigationPageData;
      return pageData.kind === "component";
    })
    .map((page) => {
      const pageData = page.data as DocsNavigationPageData;

      return {
      slug: page.slugs.at(-1) ?? page.url.split("/").at(-1) ?? "",
      title: pageData.title,
      description: pageData.description ?? "",
      category: pageData.category ?? COMPONENTS_CATEGORY,
      url: page.url,
      };
    });
}

export function getComponentEntries(): ComponentLink[] {
  return getComponentLinks().filter(
    (page) => page.category !== ANIMATED_COMPONENT_CATEGORY,
  );
}

export function getAnimatedComponentEntries(): ComponentLink[] {
  return getComponentLinks().filter(
    (page) => page.category === ANIMATED_COMPONENT_CATEGORY,
  );
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

  const componentLinks = [
    ...getComponentEntries().map((item) => ({
      label: item.title,
      href: item.url,
      keywords: [
        item.slug,
        COMPONENTS_CATEGORY.toLowerCase(),
        ...item.description.toLowerCase().split(/\s+/).slice(0, 6),
      ],
      group: COMPONENTS_CATEGORY,
    })),
    ...getAnimatedComponentEntries().map((item) => ({
      label: item.title,
      href: item.url,
      keywords: [
        item.slug,
        ANIMATED_COMPONENT_CATEGORY.toLowerCase(),
        ...item.description.toLowerCase().split(/\s+/).slice(0, 6),
      ],
      group: ANIMATED_COMPONENT_CATEGORY,
    })),
  ];

  return {
    guides: guideLinks,
    components: componentLinks,
  };
}
