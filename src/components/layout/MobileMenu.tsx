"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { nav, services, site } from "@/lib/site";
import { Logo } from "./Logo";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label="فتح القائمة"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-line"
      >
        <span className="block h-px w-5 bg-navy" />
        <span className="block h-px w-5 bg-navy" />
        <span className="block h-px w-3 bg-navy self-end me-2.5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="قائمة الموقع"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col bg-white"
          >
            <div className="container-x flex h-[72px] items-center justify-between border-b border-line">
              <Logo />
              <button
                ref={closeRef}
                type="button"
                aria-label="إغلاق القائمة"
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-xl leading-none"
              >
                ×
              </button>
            </div>
            <nav aria-label="التنقل" className="container-x flex-1 overflow-y-auto py-8">
              <ul className="space-y-1">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={reduced ? false : { opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block border-b border-line py-4 font-display text-3xl text-navy"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <p className="label mt-10 mb-4 text-muted">الخدمات</p>
              <ul className="space-y-3">
                {services.map((s) => (
                  <li key={s.id}>
                    <Link href={s.slug} onClick={() => setOpen(false)} className="text-navy/80">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="container-x border-t border-line py-5">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="pill-gradient flex h-12 items-center justify-center gap-2 rounded-full text-sm font-medium text-white"
              >
                اطلب استشارة <span aria-hidden>↗</span>
              </Link>
              <p className="mt-4 text-center text-xs text-muted">{site.email}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
