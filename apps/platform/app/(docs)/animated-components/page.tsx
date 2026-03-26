import type { TOCItemType } from "fumadocs-core/toc";
import { ComponentsIndexView } from "@/components/showcase/component-docs";
import { getRegistryCatalog } from "@/lib/registry-catalog";
import { OnThisPage } from "@/components/showcase/docs-primitives";

export default async function AnimatedComponentsPage() {
  const categories = await getRegistryCatalog();
  const toc: TOCItemType[] = [
    { url: "#component-overview", title: "Overview", depth: 2 },
    { url: "#animated-components", title: "Animated Components", depth: 2 },
  ];

  const animatedCategories = categories.filter(
    (c) => c.title === "Animated Components",
  );

  return (
    <>
      <OnThisPage items={toc} />
      <ComponentsIndexView
        categories={animatedCategories}
        badge="Animated"
        title="High-performance animated components for React Native."
        subTitle="A collection of beautifully crafted, performant animations and interactions built with Reanimated and Moti, ready to drop into your Expo apps."
      />
    </>
  );
}
