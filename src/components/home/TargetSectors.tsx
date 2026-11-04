"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { sectors } from "@/lib/site";
import { editorialEase } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function TargetSectors() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const s = sectors[active];

  return (
    <section id="sectors" aria-labelledby="sectors-heading" className="bg-white">
      <div className="container-x border-b border-line py-16 lg:py-24">
        <Reveal>
          <SectionLabel>القطاعات المستهدفة</SectionLabel>
          <h2 id="sectors-heading" className="mt-4 max-w-2xl font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.15]">
            نبني لمن تكون الثقة عنده رأس المال.
          </h2>
        </Reveal>
      </div>

      <div className="container-x grid gap-10 py-12 lg:grid-cols-12 lg:gap-16 lg:py-20">
        <div className="min-w-0 lg:col-span-4">
          <div role="tablist" aria-label="اختر القطاع" className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:gap-0">
            {sectors.map((sec, i) => {
              const selected = i === active;
              return (
                <button
                  key={sec.id}
                  role="tab"
                  id={`sector-tab-${sec.id}`}
                  aria-selected={selected}
                  aria-controls={`sector-panel-${sec.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
                      e.preventDefault();
                      const n = (i + 1) % sectors.length;
                      setActive(n);
                      document.getElementById(`sector-tab-${sectors[n].id}`)?.focus();
                    } else if (e.key === "ArrowUp" || e.key === "ArrowRight") {
                      e.preventDefault();
                      const n = (i - 1 + sectors.length) % sectors.length;
                      setActive(n);
                      document.getElementById(`sector-tab-${sectors[n].id}`)?.focus();
                    }
                  }}
                  className={`group flex shrink-0 items-center justify-between gap-6 whitespace-nowrap border-b py-5 text-start transition lg:w-full ${
                    selected ? "border-navy text-navy" : "border-line text-muted hover:text-navy"
                  }`}
                >
                  <span className="flex items-baseline gap-4">
                    <span className="label tabular-nums" dir="ltr">
                      0{i + 1}
                    </span>
                    <span className="font-display text-2xl lg:text-3xl">{sec.label}</span>
                  </span>
                  <span
                    aria-hidden
                    className={`hidden h-px bg-navy transition-all duration-500 lg:block ${selected ? "w-10" : "w-0 group-hover:w-5"}`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-w-0 lg:col-span-8">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[3px] bg-pale lg:col-span-7">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={s.id}
                  initial={reduced ? false : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: editorialEase }}
                  className="absolute inset-0"
                >
                  <Image src={s.image} alt={s.label} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
              <span className="absolute bottom-4 start-4 label text-white/85">{s.label}</span>
            </div>

            <div
              role="tabpanel"
              id={`sector-panel-${s.id}`}
              aria-labelledby={`sector-tab-${s.id}`}
              className="flex flex-col justify-between lg:col-span-5"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={s.id}
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, ease: editorialEase }}
                >
                  <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.3rem)] leading-[1.25] text-navy">{s.headline}</h3>
                  <p className="mt-6 text-[15px] leading-8 text-muted">{s.pain}</p>
                  <p className="mt-5 border-s-2 border-cobalt ps-4 text-[15px] leading-8 text-navy">{s.solution}</p>
                </motion.div>
              </AnimatePresence>
              <Link href={s.href} className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-cobalt">
                الحل المخصص لـ{s.label} <span aria-hidden>↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
