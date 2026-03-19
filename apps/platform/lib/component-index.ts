export type ComponentDocMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  preview: "button" | "text";
  usage: string;
};

export const COMPONENT_DOC_META: Record<string, ComponentDocMeta> = {
  button: {
    slug: "button",
    title: "Button",
    description:
      "A cross-platform pressable with size and variant APIs that feel familiar to shadcn users while staying native-first.",
    category: "Buttons",
    preview: "button",
    usage: `import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export function Example() {
  return (
    <Button variant="default" size="lg">
      <Text>Continue</Text>
    </Button>
  );
}`,
  },
  text: {
    slug: "text",
    title: "Text",
    description:
      "Semantic typography primitives for headings, paragraphs, code, muted copy, and composition with other registry components.",
    category: "Typography",
    preview: "text",
    usage: `import { Text } from "@/components/ui/text";

export function ArticleHeader() {
  return (
    <>
      <Text variant="h1">Ship native UI faster.</Text>
      <Text variant="lead">
        Bring editorial hierarchy and reusable tokens into your React Native app.
      </Text>
    </>
  );
}`,
  },
};

export const DOC_SECTIONS = [
  { name: "Overview", href: "/components" },
  { name: "Installation", href: "/installation" },
  { name: "CLI", href: "/cli" },
] as const;

export function getComponentMeta(slug: string) {
  return COMPONENT_DOC_META[slug];
}

export function getComponentGroups() {
  const grouped = Object.values(COMPONENT_DOC_META).reduce<
    Record<string, ComponentDocMeta[]>
  >((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {});

  return Object.entries(grouped).map(([title, items]) => ({
    title,
    items: items.sort((a, b) => a.title.localeCompare(b.title)),
  }));
}
