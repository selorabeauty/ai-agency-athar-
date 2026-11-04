"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { sectors, services } from "@/lib/site";

const columns = [
  {
    title: "الخدمات",
    items: services.map((s) => ({ href: s.slug, label: s.title, meta: s.kicker })),
  },
  {
    title: "القطاعات",
    items: sectors.map((s) => ({ href: `/#sectors`, label: s.label, meta: s.headline })),
  },
  {
    title: "الوكالة",
    items: [
      { href: "/about", label: "من نحن", meta: "قصة أثر وفلسفتنا" },
      { href: "/#portfolio", label: "نماذج الأعمال", meta: "أنظمة نفّذناها" },
      { href: "/contact", label: "تواصل معنا", meta: "احجز استشارة مجانية" },
    ],
  },
];

export function MegaMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      const links = panelRef.current?.querySelectorAll<HTMLElement>("a[href]");
      if (!links || links.length === 0) return;
      const list = Array.from(links);
      const idx = list.indexOf(document.activeElement as HTMLElement);
      if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
        e.preventDefault();
        list[(idx + 1) % list.length]?.focus();
      } else if (e.key === "ArrowUp" || e.key === "ArrowRight") {
        e.preventDefault();
        list[(idx - 1 + list.length) % list.length]?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        list[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        list[list.length - 1]?.focus();
      } else if (e.key === "Tab") {
        const first = list[0];
        const last = list[list.length - 1];
        if (!e.shiftKey && document.activeElement === last) close(false);
        if (e.shiftKey && document.activeElement === buttonRef.current) close(false);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          buttonRef.current?.focus();
        }
      }
    };
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || buttonRef.current?.contains(t)) return;
      close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close]);

  useEffect(() => {
    if (open) {
      const first = panelRef.current?.querySelector<HTMLElement>("a[href]");
      first?.focus({ preventScroll: true });
    }
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        onClick={() => (open ? close() : setOpen(true))}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-1.5 text-sm text-navy transition hover:border-navy/50 aria-expanded:border-navy aria-expanded:bg-navy aria-expanded:text-white"
      >
        تصفح
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            ref={panelRef}
            role="region"
            aria-label="قائمة تصفح الموقع"
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full border-t border-line bg-white shadow-[0_30px_60px_-30px_rgba(11,19,43,0.35)]"
          >
            <div className="container-x grid grid-cols-12 gap-10 py-10">
              {columns.map((col) => (
                <div key={col.title} className="col-span-3 border-e border-line pe-8 last:border-0">
                  <p className="label mb-5 text-muted">{col.title}</p>
                  <ul className="space-y-4">
                    {col.items.map((it) => (
                      <li key={it.label}>
                        <Link
                          href={it.href}
                          onClick={() => close(false)}
                          className="group block rounded-md outline-offset-4"
                        >
                          <span className="block text-[15px] text-navy transition group-hover:text-cobalt">{it.label}</span>
                          <span className="mt-0.5 block text-xs text-muted">{it.meta}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Link
                href="/contact"
                onClick={() => close(false)}
                className="group relative col-span-3 overflow-hidden rounded-sm bg-navy"
              >
                <Image
                  src="/images/data-abstract.jpg"
                  alt=""
                  fill
                  sizes="320px"
                  className="object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-80"
                />
                <div className="relative flex h-full min-h-[220px] flex-col justify-end p-6 text-white">
                  <span className="label text-white/70">استشارة مجانية</span>
                  <span className="mt-2 font-display text-2xl">دعنا نبني نظامك القادم ↗</span>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
