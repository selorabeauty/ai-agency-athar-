"use client";

import Link from "next/link";
import { nav, services, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      <svg
        aria-hidden
        className="pointer-events-none absolute -top-40 inset-inline-end-[-10%] h-[720px] w-[720px] opacity-[0.12]"
        viewBox="0 0 720 720"
        fill="none"
        stroke="white"
        strokeWidth="0.8"
      >
        <circle cx="360" cy="360" r="340" />
        <circle cx="360" cy="360" r="260" />
        <circle cx="360" cy="360" r="170" />
        <ellipse cx="360" cy="360" rx="340" ry="120" transform="rotate(-28 360 360)" />
        <ellipse cx="360" cy="360" rx="340" ry="60" transform="rotate(18 360 360)" />
      </svg>

      <div className="container-x relative pt-20 pb-10">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-5">
            <p className="font-display text-[clamp(5rem,14vw,11rem)] leading-none text-white">{site.wordmark}</p>
            <p className="mt-3 max-w-sm text-sm text-white/60">
              وكالة سعودية تبني أنظمة ذكية تعمل لأجلك: استقبال رقمي، ظهور محلي، وأتمتة تُترجم إلى مبيعات.
            </p>
          </div>

          <div className="col-span-6 lg:col-span-2 lg:col-start-7">
            <p className="label mb-5 text-white/50">الوكالة</p>
            <ul className="space-y-3 text-sm text-white/80">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="hover:text-white">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-6 lg:col-span-2">
            <p className="label mb-5 text-white/50">الخدمات</p>
            <ul className="space-y-3 text-sm text-white/80">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={s.slug} className="hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-2">
            <p className="label mb-5 text-white/50">تواصل</p>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <a href={`mailto:${site.email}`} dir="ltr" className="inline-block hover:text-white">
                  {site.email}
                </a>
              </li>
              <li>{site.city}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {site.name}. جميع الحقوق محفوظة.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white/80 transition hover:border-white hover:text-white"
          >
            العودة للأعلى <span aria-hidden>↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
