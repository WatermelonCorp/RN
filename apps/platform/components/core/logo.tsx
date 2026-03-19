import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="mr-2 flex h-10 items-center gap-3 tracking-tight">
      <div className="size-8 overflow-hidden rounded-md">
        <Image src="/logo.png" alt="Logo" width={32} height={32} />
      </div>
      <span className="text-lg font-[family:var(--font-display)] font-semibold">
        Watermelon RN
      </span>
    </Link>
  );
};
