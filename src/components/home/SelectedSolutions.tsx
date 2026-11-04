"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type MotionStyle, type MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { services, type Service } from "@/lib/site";
import { useIsDesktop, useMotionAllowed } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

const toneBg: Record<Service["tone"], string> = {
  icy: "bg-icy",
  navy: "bg-navy",
  pale: "bg-pale",
};

function Story({ s, index, progress, pinned }: { s: Service; index: number; progress: MotionValue<number>; pinned: boolean }) {
  const start = index / 3;
  const end = (index + 1) / 3;
  const enter = [start, start + 0.14];
  const leave = [end - 0.06, end];

  const opacity = useTransform(progress, [enter[0], enter[1], leave[0], leave[1]], [index === 0 ? 1 : 0, 1, 1, index === 2 ? 1 : 0]);
  const rotateY = useTransform(progress, [start, start + 0.2], [index % 2 === 0 ? 55 : -55, 0]);
  const imgX = useTransform(progress, [start, start + 0.2], [index % 2 === 0 ? -60 : 60, 0]);
  const imgY = useTransform(progress, [start, start + 0.2], [80, 0]);
  const detailY = useTransform(progress, [start + 0.05, start + 0.3], [120, 0]);
  const detailOpacity = useTransform(progress, [start + 0.05, start + 0.22], [0, 1]);
  const textY = useTransform(progress, [start, start + 0.18], [40, 0]);
  const textOpacity = useTransform(progress, [start, start + 0.16], [index === 0 ? 1 : 0, 1]);

  const textFirst = index !== 1;
  const dark = s.tone === "navy";

  const text = (
    <motion.div
      style={pinned ? { y: textY, opacity: textOpacity } : undefined}
      className={`relative flex flex-col justify-center px-6 py-12 lg:px-14 ${dark ? "bg-navy text-white" : "bg-white text-navy"}`}
    >
      <span className="outline-numeral pointer-events-none absolute -top-2 inset-inline-end-6 text-[clamp(6rem,14vw,12rem)] opacity-70" aria-hidden>
        {s.number}
      </span>
      <SectionLabel tone={dark ? "light" : "dark"}>{s.kicker}</SectionLabel>
      <h3 className="mt-5 font-display text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.2]">{s.title}</h3>
      <p className={`mt-6 max-w-md text-[15px] leading-8 ${dark ? "text-white/75" : "text-muted"}`}>{s.summary}</p>
      <ul className={`mt-8 space-y-3 border-t pt-6 text-sm ${dark ? "border-white/15 text-white/85" : "border-line text-navy/85"}`}>
        {s.bullets.map((b) => (
          <li key={b} className="flex items-start gap-3">
            <span className={`mt-3 h-px w-5 shrink-0 ${dark ? "bg-icy" : "bg-cobalt"}`} />
            {b}
          </li>
        ))}
      </ul>
      <Link href={s.slug} className={`mt-10 inline-flex items-center gap-2 text-sm font-medium ${dark ? "text-icy" : "text-cobalt"}`}>
        اكتشف الحل <span aria-hidden>↗</span>
      </Link>
    </motion.div>
  );

  const media = (
    <div className={`perspective relative min-h-[60vh] overflow-hidden ${toneBg[s.tone]} lg:min-h-0`}>
      <motion.div
        style={pinned ? { rotateY, x: imgX, y: imgY, transformOrigin: index % 2 === 0 ? "right center" : "left center" } : { rotate: index % 2 === 0 ? 1 : -1 }}
        className="absolute inset-[8%] overflow-hidden rounded-[3px] border border-white/60 shadow-[0_40px_80px_-40px_rgba(11,19,43,0.5)]"
      >
        <Image src={s.image} alt={s.title} fill sizes="(min-width:1024px) 58vw, 100vw" className="object-cover" />
      </motion.div>
      <motion.div
        style={pinned ? { y: detailY, opacity: detailOpacity } : undefined}
        className="absolute bottom-[4%] inset-inline-start-[4%] h-[32%] w-[28%] overflow-hidden rounded-[3px] border border-white/70 shadow-xl"
      >
        <Image src={s.detail} alt="" fill sizes="20vw" className="object-cover" />
      </motion.div>
      <span className="absolute top-5 inset-inline-end-6 label text-navy/50 mix-blend-multiply" dir="ltr">
        {s.number} — SOLUTION
      </span>
    </div>
  );

  return (
    <motion.article
      style={{ opacity: pinned ? opacity : 1, "--share": s.textShare } as MotionStyle}
      className={`${pinned ? "absolute inset-0" : "relative"} grid lg:grid-cols-[var(--share)_1fr]`}
    >
      {textFirst ? (
        <>
          {text}
          {media}
        </>
      ) : (
        <>
          {media}
          {text}
        </>
      )}
    </motion.article>
  );
}

export function SelectedSolutions() {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const motionOk = useMotionAllowed();
  const pinned = isDesktop && motionOk;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="portfolio" aria-labelledby="solutions-heading" className="bg-white">
      <div className="container-x flex flex-col items-start justify-between gap-6 border-b border-line py-16 lg:flex-row lg:items-end lg:py-24">
        <Reveal>
          <SectionLabel>الحلول المختارة</SectionLabel>
          <h2 id="solutions-heading" className="mt-4 font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.15]">
            أنظمة استثنائية.
            <br />
            نتائج ملموسة.
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="max-w-sm text-sm leading-7 text-muted">
          ثلاثة أنظمة نبنيها لعملائنا — ونستخدمها نحن أولًا. كل نظام يُسلَّم خلال أسابيع، ويعمل لسنوات.
        </Reveal>
      </div>

      <div ref={ref} className={pinned ? "relative h-[340vh]" : ""}>
        <div className={pinned ? "sticky top-0 h-screen overflow-hidden" : "divide-y divide-line"}>
          {services.map((s, i) => (
            <Story key={s.id} s={s} index={i} progress={scrollYProgress} pinned={pinned} />
          ))}
        </div>
      </div>
    </section>
  );
}
