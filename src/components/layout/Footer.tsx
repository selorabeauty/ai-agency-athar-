import Link from "next/link";
import { legalLinks, nav, services, site } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink">
      <div className="container-x pt-16 pb-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-12 lg:gap-10">
          <div className="col-span-2 lg:col-span-5">
            <Logo />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">{site.trust}</p>
            <a
              href={`mailto:${site.email}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-white transition hover:border-neon/60"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-neon" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <span dir="ltr">{site.email}</span>
            </a>
            <a href={`https://wa.me/${site.phone}`} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-white transition hover:border-neon/60">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-neon" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
              </svg>
              <span>واتساب: {site.phoneDisplay}</span>
            </a>
            <p className="mt-3 text-xs text-muted">{site.city}</p>
          </div>

          <div className="col-span-1 lg:col-span-2 lg:col-start-7">
            <p className="label mb-5">روابط سريعة</p>
            <ul className="space-y-3 text-sm text-white/80">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-neon">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-3">
            <p className="label mb-5">الخدمات</p>
            <ul className="space-y-3 text-sm text-white/80">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={`/services#${s.id}`} className="hover:text-neon">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-2">
            <p className="label mb-5">الصفحات القانونية</p>
            <ul className="space-y-3 text-sm text-white/80">
              {legalLinks.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="hover:text-neon">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider mt-14" />
        <div className="flex flex-col items-start justify-between gap-4 pt-6 text-xs text-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {site.name}. جميع الحقوق محفوظة.</p>
          <a href="#main" className="transition hover:text-white">
            العودة إلى الأعلى ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
