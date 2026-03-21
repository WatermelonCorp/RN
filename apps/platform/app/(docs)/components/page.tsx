import { ComponentsIndexView } from "@/components/showcase/component-docs";
import { OnThisPage } from "@/components/showcase/docs-primitives";

const toc = [
  { id: "component-overview", title: "Overview" },
  { id: "buttons", title: "Buttons" },
  { id: "typography", title: "Typography" },
];

export default function ComponentsPage() {
  return (
    <>
      <OnThisPage items={toc} />
      <ComponentsIndexView />
    </>
  );
}
