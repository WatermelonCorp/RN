import { z } from "zod";
import {
  defineDocs,
  defineConfig,
  frontmatterSchema,
} from "fumadocs-mdx/config";

const pageSchema = frontmatterSchema.extend({
  kind: z.enum(["guide", "component"]).default("guide"),
  badge: z.string().optional(),
  category: z.string().optional(),
  image: z.string().optional(),
  video: z.string().optional(),
  featured: z.boolean().optional(),
  featuredOrder: z.number().optional(),
  componentNumber: z.number().optional(),
  dependencies: z.array(z.string()).optional(),
  install: z.array(z.string()).optional(),
  qrValue: z.string().optional(),
  appStoreHref: z.string().optional(),
  playStoreHref: z.string().optional(),
  sourceHref: z.string().optional(),
  registryHref: z.string().optional(),
  importPath: z.string().optional(),
});

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
