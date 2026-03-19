import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

export type TocItem = {
  id: string;
  title: string;
};

export function DocSection({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 space-y-4", className)}>
      <h2 className="text-base font-medium tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export function DocSubsection({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 space-y-3", className)}>
      <h3 className="text-sm font-medium tracking-tight">{title}</h3>
      {children}
    </section>
  );
}

export function ApiTable({
  rows,
}: {
  rows: Array<{
    prop: string;
    type: string;
    default?: string;
    description: string;
  }>;
}) {
  return (
    <div className="border-border/70 overflow-hidden rounded-2xl border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/60 text-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">prop</th>
            <th className="px-4 py-3 font-medium">type</th>
            <th className="px-4 py-3 font-medium">default</th>
            <th className="px-4 py-3 font-medium">description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.prop} className="border-border/70 border-t align-top">
              <td className="text-foreground px-4 py-3 font-mono text-xs">
                <span className="bg-muted rounded-md px-1.5 py-0.5">
                  {row.prop}
                </span>
              </td>
              <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                {row.type}
              </td>
              <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                {row.default || "-"}
              </td>
              <td className="text-muted-foreground px-4 py-3 leading-7">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function OnThisPage({ items }: { items: TocItem[] }) {
  return (
    <div className="border-border/70 bg-card/75 rounded-md border p-4 shadow-sm">
      <p className="text-muted-foreground text-xs font-medium tracking-[0.22em] uppercase">
        On this page
      </p>
      <nav className="mt-4 flex flex-col gap-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="text-muted-foreground hover:text-foreground text-sm transition"
          >
            {item.title}
          </a>
        ))}
      </nav>
    </div>
  );
}

export function PreviewCard({
  qrValue,
  appStoreHref,
  playStoreHref,
}: {
  qrValue: string;
  appStoreHref: string;
  playStoreHref: string;
}) {
  return (
    <div>
      <p className="text-foreground mt-5 text-center text-xs">
        Scan this QR code with your camera app to preview the Watermelon native
        component pages.
      </p>
      <div className="mt-2 flex justify-center rounded-[1.5rem] bg-white p-2">
        <QRCodeSVG value={qrValue} size={220} marginSize={2} />
      </div>
      <p className="text-muted-foreground mt-2 text-center text-sm leading-7">
        Install Expo Go on your device if you are previewing the local showcase
        build through an Expo link.
      </p>
      <div className="mt-2 flex flex-col gap-3">
        <a
          href={appStoreHref}
          target="_blank"
          rel="noreferrer"
          className="bg-foreground text-background inline-flex min-h-12 items-center justify-center rounded-full px-4 text-base font-medium transition hover:opacity-90"
        >
          Download on App Store
        </a>
        <a
          href={playStoreHref}
          target="_blank"
          rel="noreferrer"
          className="bg-muted text-foreground hover:bg-muted/80 inline-flex min-h-12 items-center justify-center rounded-full px-4 text-base font-medium transition"
        >
          Download on Play Store
        </a>
      </div>
    </div>
  );
}

export function PreviewVideo({ src, title }: { src: string; title: string }) {
  return (
    <div className="h-[400px] w-[200px] overflow-hidden bg-black">
      <video aria-labelledby={title} src={src} className="w-fit" />
    </div>
  );
}

export function DocsPager({
  previous,
  next,
}: {
  previous?: { href: string; title: string; description: string };
  next?: { href: string; title: string; description: string };
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {previous ? (
        <Link
          href={previous.href}
          className="border-border/70 bg-card/70 hover:bg-muted/40 rounded-lg border p-4 transition"
        >
          <p className="text-muted-foreground text-sm">Previous</p>
          <p className="mt-2 text-lg font-medium">{previous.title}</p>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="border-border/70 bg-card/70 hover:bg-muted/40 rounded-lg border p-4 text-right transition"
        >
          <p className="text-muted-foreground text-sm">Next</p>
          <p className="mt-2 text-lg font-medium">{next.title}</p>
        </Link>
      ) : null}
    </div>
  );
}
