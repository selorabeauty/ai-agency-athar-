"use client";

import { motion, useReducedMotion } from "framer-motion";
import { hero, sectors } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { editorialEase } from "@/lib/motion";

const chat = [
  { from: "user", text: "السلام عليكم، عندكم موعد متاح بكرة؟", time: "11:42 م" },
  { from: "bot", text: "وعليكم السلام ورحمة الله! أكيد، متاح بكرة الساعة 5:30 أو 7:00 مساءً. أي وقت يناسبك؟", time: "11:42 م" },
  { from: "user", text: "7:00 مناسب", time: "11:43 م" },
  { from: "bot", text: "تم حجز موعدك بكرة الساعة 7:00 مساءً ✓ أرسلنا لك الموقع والتفاصيل. نراك على خير!", time: "11:43 م" },
] as const;

export function Hero() {
  const reduced = useReducedMotion();
  const fade = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: editorialEase },
  });

  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0" />
      <div aria-hidden className="glow-neon pointer-events-none absolute -top-32 end-[-10%] h-[600px] w-[600px]" />
      <div aria-hidden className="glow-neon pointer-events-none absolute -bottom-48 start-[-15%] h-[520px] w-[520px] opacity-60" />

      <div className="container-x relative grid items-center gap-14 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-7">
          <motion.div {...fade(0)} className="inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-4 py-1.5 text-xs font-bold text-neon">
            <span aria-hidden className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-neon" />
            </span>
            يعمل الآن · الرياض
          </motion.div>

          <motion.h1 {...fade(0.08)} id="hero-heading" className="mt-6 text-[clamp(2.25rem,5.5vw,4.5rem)] font-extrabold leading-[1.2] text-white">
            <span className="text-gradient">{hero.headline}</span>
          </motion.h1>

          <motion.p {...fade(0.16)} className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
            {hero.sub}
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/contact" size="lg">
              اطلب استشارة مجانية <span aria-hidden>↗</span>
            </Button>
            <Button href="/#pricing" variant="outline" size="lg">
              شاهد الباقات والأسعار
            </Button>
          </motion.div>

          <motion.ul {...fade(0.32)} className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted" aria-label="القطاعات التي نخدمها">
            {sectors.map((s) => (
              <li key={s} className="inline-flex items-center gap-2">
                <span aria-hidden className="h-1 w-1 rounded-full bg-neon" />
                {s}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div {...fade(0.2)} className="lg:col-span-5">
          <div className="card relative mx-auto max-w-md p-5 shadow-[0_40px_120px_-40px_rgba(0,119,255,0.5)]">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-electric to-neon font-display text-sm font-extrabold text-navy">أ</span>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-white">مساعد أثر الذكي</p>
                  <p className="text-xs text-neon">متصل الآن</p>
                </div>
              </div>
              <span className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted">خارج أوقات الدوام</span>
            </div>

            <ol className="mt-4 space-y-3" aria-label="مثال لمحادثة واتساب يديرها النظام">
              {chat.map((m, i) => (
                <motion.li
                  key={i}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.35, duration: 0.5, ease: editorialEase }}
                  className={`flex ${m.from === "bot" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.from === "bot" ? "rounded-ss-sm bg-neon/15 text-white" : "rounded-se-sm bg-white/10 text-white/90"
                    }`}
                  >
                    <p>{m.text}</p>
                    <p className={`mt-1 text-[10px] ${m.from === "bot" ? "text-neon/80" : "text-muted"}`}>{m.time}</p>
                  </div>
                </motion.li>
              ))}
            </ol>

            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
              {[
                ["ثوانٍ", "زمن الردّ"],
                ["24/7", "بلا إجازات"],
                ["0", "استفسار ضائع"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl bg-white/5 py-2.5">
                  <p className="font-display text-lg font-extrabold text-neon">{v}</p>
                  <p className="text-[11px] text-muted">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
