"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { testimonials } from "@/lib/site";
import { editorialEase } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Testimonials() {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  const t = testimonials[i];
  const go = (d: number) => setI((v) => (v + d + testimonials.length) % testimonials.length);

  return (
    <section aria-labelledby="testimonials-heading" className="bg-offwhite">
      <div className="container-x py-24 lg:py-36">
        <div className="flex items-end justify-between border-b border-line pb-8">
          <SectionLabel>
            <span id="testimonials-heading">آراء عملائنا</span>
          </SectionLabel>
          <span className="label tabular-nums text-muted" dir="ltr">
            0{i + 1} / 0{testimonials.length}
          </span>
        </div>

        <div className="relative min-h-[320px] py-14 lg:py-20" aria-live="polite">
          <span aria-hidden className="outline-numeral absolute -top-2 start-0 text-[9rem] opacity-60 lg:text-[14rem]">
            ”
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.blockquote
              key={i}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: editorialEase }}
              className="relative mx-auto max-w-4xl"
            >
              <p className="font-display text-[clamp(1.6rem,3.6vw,3.2rem)] leading-[1.45] text-navy">{t.quote}</p>
              <footer className="mt-10 flex items-center gap-4 text-sm">
                <span className="h-px w-10 bg-cobalt" />
                <span>
                  <span className="block font-medium text-navy">{t.name}</span>
                  <span className="block text-muted">{t.role}</span>
                </span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 border-t border-line pt-8">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="الشهادة السابقة"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-navy transition hover:border-navy"
          >
            <span aria-hidden>→</span>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="الشهادة التالية"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-navy transition hover:border-navy"
          >
            <span aria-hidden>←</span>
          </button>
        </div>
      </div>
    </section>
  );
}
