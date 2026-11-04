"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useMotionAllowed } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";

export function GradientInterlude() {
  const ref = useRef<HTMLElement>(null);
  const motionOk = useMotionAllowed();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scaleA = useTransform(scrollYProgress, [0, 1], [1.08, 0.96]);
  const scaleB = useTransform(scrollYProgress, [0, 1], [0.94, 1.08]);
  const yA = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yB = useTransform(scrollYProgress, [0, 1], [-40, 80]);
  const planeY = useTransform(scrollYProgress, [0, 1], [120, -120]);

  return (
    <section ref={ref} aria-labelledby="interlude-heading" className="grad-blue relative overflow-hidden text-white">
      <motion.div
        aria-hidden
        style={motionOk ? { y: planeY } : undefined}
        className="pointer-events-none absolute -top-32 start-[30%] h-[140%] w-[40%] rotate-[18deg] bg-white/[0.04]"
      />
      <div aria-hidden className="pointer-events-none absolute bottom-0 end-0 h-[60%] w-[35%] -rotate-[12deg] bg-cobalt/20" />

      <div className="container-x relative grid items-center gap-14 py-24 lg:grid-cols-12 lg:py-36">
        {/* Images occupy the inline-start (right) half; editorial text sits on the left as specified. */}
        <div className="relative order-1 h-[480px] lg:col-span-6 lg:h-[620px]">
          <motion.div
            style={motionOk ? { scale: scaleA, y: yA } : undefined}
            className="absolute top-0 start-0 h-[62%] w-[70%] overflow-hidden [clip-path:polygon(0_0,100%_0,100%_88%,88%_100%,0_100%)]"
          >
            <Image src="/images/dashboard.jpg" alt="لوحة متابعة تعرض بيانات العملاء" fill sizes="(min-width:1024px) 35vw, 70vw" className="object-cover" />
          </motion.div>
          <motion.div
            style={motionOk ? { scale: scaleB, y: yB } : undefined}
            className="absolute bottom-0 end-0 h-[55%] w-[58%] overflow-hidden border border-white/40 [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%,0_12%)]"
          >
            <Image src="/images/circuit.jpg" alt="تدفق بيانات ذكي" fill sizes="(min-width:1024px) 30vw, 60vw" className="object-cover" />
          </motion.div>
          <span className="absolute top-1/2 end-[8%] label -translate-y-1/2 rotate-90 text-white/50" dir="ltr">
            ATHAR — SYSTEMS
          </span>
        </div>

        <div className="order-2 flex flex-col items-center text-center lg:col-span-5 lg:col-start-8">
          <Reveal>
            <h2 id="interlude-heading" className="font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-[1.1]">
              أنظمة.
              <br />
              تعمل.
              <br />
              لأجلك.
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="mt-8 max-w-sm text-base leading-8 text-white/75">
            حلول تقنية تبني الثقة وتضاعف المبيعات دون تدخل بشري.
          </Reveal>
          <Reveal delay={0.25} className="mt-10 h-px w-24 bg-white/40" />
        </div>
      </div>
    </section>
  );
}
