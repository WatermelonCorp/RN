import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DocsPager,
  OnThisPage,
  PreviewCard,
} from "@/components/showcase/docs-primitives";
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
import { ComponentVideoPreview } from "@/components/showcase/component-video-preview";
import MotionDiv from "@/components/core/motion-div";

export function generateStaticParams() {
  return getComponentDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { meta } = await getComponentDoc(slug);
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = await getComponentDoc(slug).catch(() => null);

  if (!doc) {
    notFound();
  }

  const { Content, meta } = doc;
  const pager = getComponentDocPager(slug);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.3 }}
      className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_18rem]"
    >
      <div className="space-y-6">
        <section className="space-y-2">
          <p className="text-muted-foreground w-fit rounded-md border bg-black/10 px-2 py-1 text-xs font-medium uppercase backdrop-blur-lg dark:bg-white/5">
            {meta.category}
          </p>
          <h1 className="text-3xl font-(--font-display)">{meta.title}</h1>
          <p className="text-muted-foreground max-w-3xl text-base leading-8">
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

        <section className="mb-6 space-y-4">
          <div className="flex justify-end">
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
          <ComponentVideoPreview
            name={meta.title}
            description={meta.description}
            category={meta.category}
            video={meta.videoSrc}
          />
        </section>

        <article className="mb-10 space-y-10 p-4">
          <Content />
        </article>

        <DocsPager previous={pager.previous} next={pager.next} />
      </div>

      <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
        <OnThisPage items={meta.toc} />
      </aside>
    </MotionDiv>
  );
}
