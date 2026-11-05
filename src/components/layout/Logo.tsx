import Link from "next/link";
import { site } from "@/lib/site";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label={`${site.name} — الصفحة الرئيسية`} className={`inline-flex items-center gap-3 ${className}`}>
      <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-electric to-neon shadow-[0_8px_24px_-8px_rgba(0,212,255,0.8)]">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#0b132b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 18 12 5l7 13" />
          <path d="M8.5 13.5h7" />
          <circle cx="12" cy="18" r="1.4" fill="#0b132b" stroke="none" />
          <circle cx="5" cy="18" r="1.1" fill="#0b132b" stroke="none" />
          <circle cx="19" cy="18" r="1.1" fill="#0b132b" stroke="none" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-base font-extrabold tracking-tight whitespace-nowrap text-white sm:text-lg">
          أثر <span className="text-neon">للذكاء الاصطناعي</span>
        </span>
        <span className="mt-1 text-[11px] font-medium text-muted">أنظمة ذكية تعمل لأجلك 24/7</span>
      </span>
    </Link>
  );
}
