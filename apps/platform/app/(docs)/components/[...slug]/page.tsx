import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DocsPager,
  OnThisPage,
  PreviewCard,
} from "@/components/showcase/docs-primitives";
import { ComponentPreview } from "@/components/mdx/component-preview";
import { ComponentInstallation } from "@/components/showcase/component-installation";
import {
  getComponentDoc,
  getComponentDocPager,
  getComponentDocSlugs,
} from "@/lib/component-docs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MotionDiv from "@/components/core/motion-div";

export function generateStaticParams() {
  return getComponentDocSlugs().map((slug) => ({
    slug: [slug],
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const componentSlug = slug[0];
  try {
    const { meta } = await getComponentDoc(componentSlug);
    return {
      title: `${meta.title} | Watermelon RN`,
      description: meta.description,
    };
  } catch {
    return {};
  }
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const componentSlug = slug[0];
  const doc = await getComponentDoc(componentSlug).catch(() => null);

  if (!doc) {
    notFound();
  }

  const { Content, meta, component } = doc;
  const pager = getComponentDocPager(componentSlug);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.3 }}
      className="grid min-w-0 gap-10"
    >
      <OnThisPage items={meta.toc} />
      <div className="min-w-0 space-y-6">
        <section className="min-w-0 space-y-2">
          <p className="text-muted-foreground w-fit rounded-md border bg-black/10 px-2 py-1 text-xs font-medium uppercase backdrop-blur-lg dark:bg-white/5">
            {meta.category}
          </p>
          <h1 className="text-3xl leading-tight font-(--font-display) sm:text-4xl">
            {meta.title}
          </h1>
          <p className="text-muted-foreground max-w-3xl text-base leading-7 sm:leading-8">
            {meta.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href={meta.sourceHref} target="_blank">
                Source
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={meta.registryHref} target="_blank">
                Registry
              </Link>
            </Button>
          </div>
        </section>

        <section className="mb-6 min-w-0 space-y-4">
          <div className="flex justify-start sm:justify-end">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  Scan to preview
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PreviewCard
                  qrValue={meta.qrValue}
                  appStoreHref={meta.appStoreHref}
                  playStoreHref={meta.playStoreHref}
                />
              </PopoverContent>
            </Popover>
          </div>
          <ComponentPreview
            code={component.source}
            video={meta.video}
            poster={meta.image}
          />
        </section>

        <ComponentInstallation
          item={{
            slug: component.slug,
            name: meta.title,
            category: meta.category,
            install: meta.install ?? [`watermelon add ${component.slug}`],
          }}
          dependencies={meta.dependencies}
        />

        <article className="mb-10 min-w-0 space-y-8 px-0 py-2 sm:space-y-10 sm:px-4">
          <Content />
        </article>

        <DocsPager previous={pager.previous} next={pager.next} />
      </div>
    </MotionDiv>
  );
}
