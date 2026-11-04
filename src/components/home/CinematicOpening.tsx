"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { heroScenes } from "@/lib/site";
import { editorialEase, useIsDesktop, useMotionAllowed } from "@/lib/motion";

export function CinematicOpening() {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const motionOk = useMotionAllowed();
  const pinned = isDesktop && motionOk;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [scene, setScene] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!pinned) return;
    setScene(Math.min(2, Math.floor(v * 3)));
  });

  useEffect(() => {
    if (pinned) return;
    const id = setInterval(() => setScene((s) => (s + 1) % 3), 3800);
    return () => clearInterval(id);
  }, [pinned]);

  const width = useTransform(scrollYProgress, [0, 0.85], ["44vw", "100vw"]);
  const height = useTransform(scrollYProgress, [0, 0.85], ["60vh", "100vh"]);
  const radius = useTransform(scrollYProgress, [0, 0.85], ["4px", "0px"]);
  const sideX = useTransform(scrollYProgress, [0, 0.8], [0, 420]);
  const sideXNeg = useTransform(sideX, (v) => -v);
  const sideRot = useTransform(scrollYProgress, [0, 0.8], [6, 16]);
  const sideRotNeg = useTransform(sideRot, (v) => -v);
  const sideOpacity = useTransform(scrollYProgress, [0.45, 0.8], [1, 0]);
  const textShift = useTransform(scrollYProgress, [0, 0.85], [0, -40]);
  const vignette = useTransform(scrollYProgress, [0.5, 1], [0.25, 0.55]);

  const current = heroScenes[scene];

  return (
    <section
      ref={ref}
      aria-label="المقدمة"
      className={`relative bg-navy text-white ${pinned ? "h-[300vh]" : ""}`}
    >
      <div className={`${pinned ? "sticky top-0 h-screen" : "min-h-[92vh] py-20"} relative flex items-center justify-center overflow-hidden`}>
        <div className="container-x pointer-events-none absolute top-8 z-20 flex w-full items-start justify-between">
          <span className="label text-white/70">ما وراء المألوف</span>
          <span className="label tabular-nums text-white/70" dir="ltr">
            0{scene + 1} / 03
          </span>
        </div>

        <div className="relative flex h-full w-full items-center justify-center">
          <motion.figure
            style={pinned ? { x: sideXNeg, rotate: sideRot, opacity: sideOpacity } : { rotate: 1.5 }}
            className="img-frame absolute inset-inline-end-[8%] top-[18%] z-10 hidden h-[34vh] w-[20vw] overflow-hidden rounded-[3px] shadow-2xl md:block"
          >
            <Image src="/images/phone-chat.jpg" alt="هاتف يعرض محادثة مع مساعد ذكي" fill priority sizes="22vw" className="object-cover" />
            <figcaption className="absolute bottom-3 inset-inline-start-3 text-[10px] tracking-[0.14em] text-white/80">
              استقبال رقمي — ٢٤/٧
            </figcaption>
          </motion.figure>

          <motion.figure
            style={pinned ? { x: sideX, rotate: sideRotNeg, opacity: sideOpacity } : { rotate: -1.5 }}
            className="img-frame absolute inset-inline-start-[8%] bottom-[14%] z-10 hidden h-[30vh] w-[18vw] overflow-hidden rounded-[3px] shadow-2xl md:block"
          >
            <Image src="/images/server-glow.jpg" alt="رف خوادم بإضاءة خافتة" fill priority sizes="20vw" className="object-cover" />
            <figcaption className="absolute bottom-3 inset-inline-start-3 text-[10px] tracking-[0.14em] text-white/80">
              بنية تحتية تعمل بصمت
            </figcaption>
          </motion.figure>

          <motion.div
            style={pinned ? { width, height, borderRadius: radius } : undefined}
            className={`img-frame relative z-0 overflow-hidden ${pinned ? "" : "h-[56vh] w-[88vw] rounded-[3px] md:h-[64vh] md:w-[60vw]"}`}
          >
            <Image
              src="/images/riyadh-office.jpg"
              alt="مكتب حديث في الرياض"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <motion.div style={pinned ? { opacity: vignette } : { opacity: 0.35 }} className="absolute inset-0 bg-navy" />
          </motion.div>

          <motion.div
            style={pinned ? { y: textShift } : undefined}
            className="absolute z-20 flex w-full max-w-3xl flex-col items-center px-6 text-center"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={`label-${scene}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.45, ease: editorialEase }}
                className="label text-white/80"
              >
                {current.label}
              </motion.span>
            </AnimatePresence>

            <h1 className="mt-5 font-display text-[clamp(2.6rem,7vw,6.5rem)] font-light leading-[1.1] text-white">
              أثر للذكاء الاصطناعي
            </h1>

            <div className="mt-3 h-[1.3em] text-[clamp(1.6rem,4vw,3.2rem)] font-display font-light text-icy">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`word-${scene}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.55, ease: editorialEase }}
                  className="block"
                >
                  {current.word}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="mt-6 h-[2em] text-base text-white/80 md:text-lg">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`support-${scene}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {current.support}
                </motion.p>
              </AnimatePresence>
            </div>

            <Link
              href="/services"
              className="mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-medium text-navy transition hover:bg-icy"
            >
              استكشف خدماتنا <span aria-hidden>↗</span>
            </Link>
          </motion.div>
        </div>

        <div className="container-x pointer-events-none absolute bottom-8 z-20 hidden w-full items-end justify-between lg:flex">
          <span className="label text-white/50">مرّر للاستكشاف</span>
          <span className="h-px w-32 bg-white/30" />
        </div>
      </div>
    </section>
  );
}
