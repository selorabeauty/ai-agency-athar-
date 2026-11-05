"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { nav, legalLinks, site } from "@/lib/site";
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

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label="فتح القائمة"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-xl border border-line bg-panel/60"
      >
        <span className="block h-0.5 w-5 rounded bg-white" />
        <span className="block h-0.5 w-5 rounded bg-white" />
        <span className="block h-0.5 w-3 self-end rounded bg-neon me-3" />
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
            className="fixed inset-0 z-[60] flex flex-col bg-ink"
          >
            <div className="container-x flex h-[76px] items-center justify-between border-b border-line">
              <Logo />
              <button
                ref={closeRef}
                type="button"
                aria-label="إغلاق القائمة"
                onClick={() => {
                  close();
                  triggerRef.current?.focus();
                }}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-line text-2xl leading-none text-white"
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
                    <Link href={item.href} onClick={close} className="block border-b border-line py-4 font-display text-2xl text-white">
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                {legalLinks.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} onClick={close} className="hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="container-x border-t border-line py-5">
              <Link href="/contact" onClick={close} className="btn-neon flex h-12 items-center justify-center gap-2 rounded-full text-sm font-bold">
                اطلب استشارة مجانية <span aria-hidden>↗</span>
              </Link>
              <p className="mt-4 text-center text-xs text-muted" dir="ltr">
                {site.email}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
