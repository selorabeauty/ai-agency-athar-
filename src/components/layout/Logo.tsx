import Link from "next/link";
import { site } from "@/lib/site";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" aria-label={`${site.name} — الصفحة الرئيسية`} className="group inline-flex flex-col leading-none">
      <span className={`font-display text-[1.75rem] font-medium tracking-tight ${light ? "text-white" : "text-navy"}`}>
        {site.wordmark}
      </span>
      <span className={`mt-0.5 text-[10px] tracking-[0.2em] ${light ? "text-white/60" : "text-muted"}`}>
        {site.tagline}
      </span>
    </Link>
  );
}
