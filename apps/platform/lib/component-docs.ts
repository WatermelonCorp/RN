import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import { getComponentGroups } from "@/lib/component-index";
import { getRegistryCatalog } from "@/lib/registry-catalog";
import type { TocItem } from "@/components/showcase/docs-primitives";

type DocMeta = {
  slug?: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  video?: string;
  videoSrc?: string;
  featured?: boolean;
  featuredOrder?: number;
  componentNumber?: number;
  dependencies?: string[];
  install?: string[];
  qrValue: string;
  appStoreHref: string;
  playStoreHref: string;
  sourceHref: string;
  registryHref: string;
  toc: TocItem[];
};

type DocModule = {
  default: ComponentType;
  meta: DocMeta;
};

const DOC_IMPORTS: Record<string, () => Promise<DocModule>> = {
  button: () => import("@/content/components/button.mdx") as Promise<DocModule>,
  text: () => import("@/content/components/text.mdx") as Promise<DocModule>,
};

export async function getComponentDoc(slug: string) {
  const load = DOC_IMPORTS[slug];
  if (!load) {
    notFound();
  }

  const [docModule, categories] = await Promise.all([
    load(),
    getRegistryCatalog(),
  ]);
  const component = categories
    .flatMap((category) => category.items)
    .find((item) => item.slug === slug);

  if (!component) {
    notFound();
  }

  return {
    component,
    Content: docModule.default,
    meta: {
      ...docModule.meta,
      slug,
      video: docModule.meta.video ?? docModule.meta.videoSrc,
      dependencies: docModule.meta.dependencies ?? component.dependencies,
      install: docModule.meta.install ?? [`watermelon add ${slug}`],
    },
  };
}

export function getComponentDocSlugs() {
  return Object.keys(DOC_IMPORTS);
}

export function getComponentDocPager(slug: string) {
  const ordered = getComponentGroups().flatMap((group) => group.items);
  const index = ordered.findIndex((item) => item.slug === slug);
  if (index === -1) return {};

  const previous = ordered[index - 1];
  const next = ordered[index + 1];

  return {
    previous: previous
      ? {
          href: `/components/${previous.slug}`,
          title: previous.title,
          description: previous.description,
        }
      : undefined,
    next: next
      ? {
          href: `/components/${next.slug}`,
          title: next.title,
          description: next.description,
        }
      : undefined,
  };
}
