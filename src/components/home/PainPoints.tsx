import { painPoints } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LossCalculator } from "./LossCalculator";

export function PainPoints() {
  return (
    <section id="pain" aria-labelledby="pain-heading" className="relative scroll-mt-24 overflow-hidden border-t border-line bg-ink">
      <div className="container-x py-20 lg:py-28">
        <SectionHeading
          label="لماذا تخسر عملاء كل يوم؟"
          title="كل استفسار بعد الدوام هو موعد ضائع ومبيعات ضائعة"
          lead="أنت لا ترى هذه الخسائر في تقاريرك، لكنها تحدث يوميًا: في المساء، في عطلة نهاية الأسبوع، وفي كل دقيقة ينتظر فيها العميل ردًّا لا يأتي."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {painPoints.map((p, i) => (
            <Reveal key={p.title} delay={0.08 * i} className="card card-hover flex flex-col p-7">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl font-extrabold text-neon">{p.stat}</span>
                <span className="text-xs text-muted">{p.statLabel}</span>
              </div>
              <h3 className="mt-6 text-lg font-bold leading-snug text-white">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{p.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10">
          <LossCalculator />
        </Reveal>

        <Reveal delay={0.15} className="mt-10 rounded-2xl border border-neon/30 bg-gradient-to-l from-neon/10 to-transparent p-6 sm:p-8">
          <p className="text-lg font-bold text-white sm:text-xl">
            الحل ليس توظيف موظف إضافي للسهر على الهاتف. الحل نظام يجيب خلال ثوانٍ، يحجز، ويتابع — <span className="text-neon">في الوقت الذي تنام فيه أنت ومنافسوك.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
