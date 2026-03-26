import type { ComponentType } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { TOCItemType } from "fumadocs-core/toc";
import { DocsBody, DocsDescription, DocsTitle } from "fumadocs-ui/page";
import MotionDiv from "@/components/core/motion-div";
import { PageHeader } from "@/components/core/typography";
import { Button } from "@/components/ui/button";
import {
  DocsPager,
  OnThisPage,
  PreviewCard,
} from "@/components/showcase/docs-primitives";
import { ComponentLivePreview } from "@/components/showcase/component-live-preview";
import { ComponentPreview } from "@/components/mdx/component-preview";
import { ComponentInstallation } from "@/components/showcase/component-installation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getComponentLinks, getComponentPager } from "@/lib/docs-navigation";
import { docsSource } from "@/lib/docs-source";
import { getRegistryCatalog } from "@/lib/registry-catalog";
import { customMDXComponents } from "@/mdx-components";

type DocsPageParams = {
  slug: string[];
};

type ResolvedDocsPageData = {
  body: ComponentType<{ components?: typeof customMDXComponents }>;
  toc?: TOCItemType[];
  kind?: "guide" | "component";
  badge?: string;
  title: string;
  description?: string;
  category?: string;
  sourceHref?: string;
  registryHref?: string;
  qrValue?: string;
  appStoreHref?: string;
  playStoreHref?: string;
  install?: string[];
  importPath?: string;
  dependencies?: string[];
};

export function generateStaticParams() {
  return docsSource.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<DocsPageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = docsSource.getPage(slug);

  if (!page) return {};

  return {
    title: `${page.data.title} | Watermelon RN`,
    description: page.data.description,
  };
}

export default async function DocsPage({
  params,
}: {
  params: Promise<DocsPageParams>;
}) {
  const { slug } = await params;
  const page = docsSource.getPage(slug);

  if (!page) {
    notFound();
  }

  const pageData = page.data as ResolvedDocsPageData;
  const Content = pageData.body;
  const baseToc = pageData.toc ?? [];
  const isComponentPage = pageData.kind === "component";

  const toc = isComponentPage
    ? [
        {
          title: "Installation",
          url: "#installation",
          depth: 2,
        },
        ...baseToc,
      ]
    : baseToc;

  if (!isComponentPage) {
    return (
      <MotionDiv
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
        transition={{ duration: 0.3 }}
        className="mr-auto max-w-5xl space-y-8"
      >
        <OnThisPage items={toc} />

        <PageHeader
          badge={pageData.badge ?? pageData.title}
          title={pageData.title}
          subTitle={pageData.description ?? ""}
        />

        <DocsBody className="min-w-0 space-y-2">
          <Content components={customMDXComponents} />
        </DocsBody>
      </MotionDiv>
    );
  }

  const componentSlug = page.slugs.at(-1);
  const catalog = await getRegistryCatalog();
  const componentDocs = getComponentLinks();
  const component = catalog
    .flatMap((category) => category.items)
    .find((item) => item.slug === componentSlug);
  const componentDoc = componentDocs.find(
    (item) => item.slug === componentSlug,
  );

  if (!component || !componentSlug || !componentDoc) {
    notFound();
  }

  const pager = getComponentPager(componentSlug);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.3 }}
      className="grid min-w-0 gap-10"
    >
      <OnThisPage items={toc} />
      <div className="min-w-0 space-y-6">
        <section className="min-w-0 space-y-2">
          <p className="text-muted-foreground w-fit rounded-md border bg-black/10 px-2 py-px text-xs uppercase backdrop-blur-lg dark:bg-white/5">
            {pageData.category}
          </p>
          <DocsTitle className="text-xl leading-tight font-medium md:text-2xl">
            {pageData.title}
          </DocsTitle>
          <DocsDescription className="max-w-3xl text-base leading-7 sm:leading-8">
            {pageData.description}
          </DocsDescription>
          <div className="flex flex-wrap gap-3">
            {pageData.sourceHref ? (
              <Button asChild variant="outline" size="sm">
                <Link href={pageData.sourceHref} target="_blank">
                  Source
                </Link>
              </Button>
            ) : null}
            {pageData.registryHref ? (
              <Button asChild variant="outline" size="sm">
                <Link href={pageData.registryHref} target="_blank">
                  Registry
                </Link>
              </Button>
            ) : null}
          </div>
        </section>

        <section className="mb-6 min-w-0 space-y-4">
          {pageData.qrValue &&
          pageData.appStoreHref &&
          pageData.playStoreHref ? (
            <div className="flex justify-start sm:justify-end">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    Scan to preview
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PreviewCard
                    qrValue={pageData.qrValue}
                    appStoreHref={pageData.appStoreHref}
                    playStoreHref={pageData.playStoreHref}
                  />
                </PopoverContent>
              </Popover>
            </div>
          ) : null}
          <ComponentPreview
            code={component.source}
            video={undefined}
            poster={undefined}
          >
            <ComponentLivePreview slug={componentSlug} />
          </ComponentPreview>
        </section>

        <ComponentInstallation
          item={{
            slug: component.slug,
            name: componentDoc.title,
            category: componentDoc.category,
            install: pageData.install ?? [`watermelon add ${component.slug}`],
            importPath: pageData.importPath,
          }}
          dependencies={pageData.dependencies ?? component.dependencies}
        />

        <DocsBody className="mb-10 min-w-0 space-y-2 px-0 py-2 sm:space-y-3 sm:px-4">
          <Content components={customMDXComponents} />
        </DocsBody>

        <DocsPager previous={pager.previous} next={pager.next} />
      </div>
    </MotionDiv>
  );
}
