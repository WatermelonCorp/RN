import type { TOCItemType } from "fumadocs-core/toc";
import { ComponentsIndexView } from "@/components/showcase/component-docs";
import { getRegistryCatalog } from "@/lib/registry-catalog";
import { OnThisPage } from "@/components/showcase/docs-primitives";

export default async function ComponentsPage() {
  const categories = await getRegistryCatalog();
  const toc: TOCItemType[] = [
    { url: "#component-overview", title: "Overview", depth: 2 },
    ...categories.map((category) => ({
      url: `#${category.slug}`,
      title: category.title,
      depth: 2,
    })),
  ];

  return (
    <>
      <OnThisPage items={toc} />
      <ComponentsIndexView categories={categories} />
    </>
  );
}
