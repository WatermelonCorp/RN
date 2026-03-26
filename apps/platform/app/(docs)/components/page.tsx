import type { TOCItemType } from "fumadocs-core/toc";
import { ComponentsIndexView } from "@/components/showcase/component-docs";
import { getRegistryCatalog } from "@/lib/registry-catalog";
import { OnThisPage } from "@/components/showcase/docs-primitives";

export default async function ComponentsPage() {
  const categories = await getRegistryCatalog();
  const toc: TOCItemType[] = [
    { url: "#component-overview", title: "Overview", depth: 2 },
    { url: "#components", title: "Components", depth: 2 },
  ];

  const standardCategories = categories.filter(
    (c) => c.title !== "Animated Components",
  );

  return (
    <>
      <OnThisPage items={toc} />
      <ComponentsIndexView
        categories={standardCategories}
        badge="Components"
        title="Browse every installable primitive in the registry."
        subTitle="This section mirrors the shadcn docs flow: overview first, then component detail pages with install commands, usage examples, and source straight from the registry."
      />
    </>
  );
}
