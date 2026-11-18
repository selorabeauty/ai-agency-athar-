import { consultationLink, consultationPromise, freeMaintenance, freeMaintenancePromo, packages, whatsappLink } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckIcon } from "@/components/ui/Icons";

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="relative scroll-mt-24 overflow-hidden border-t border-line">
      <div aria-hidden className="glow-neon pointer-events-none absolute -top-40 start-1/2 h-[600px] w-[600px] translate-x-1/2 opacity-60" />
      <div className="container-x relative py-20 lg:py-28">
        <SectionHeading
          align="center"
          label="الباقات"
          title="لا نبيعك باقة جاهزة، نبني لك نظامًا يسدّد تكلفته"
          lead="كل نشاط مختلف: شركة تكييف بثلاثة فروع لا تحتاج ما يحتاجه معرض رخام واحد. لذلك نحدد السعر بعد استشارة مجانية، وتستلم عرض سعر مكتوبًا وواضحًا بالريال قبل أي التزام."
        />

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {packages.map((p, i) => (
            <Reveal
              key={p.id}
              delay={0.08 * i}
              className={`card card-hover relative flex flex-col p-7 sm:p-8 ${p.badge ? "border-neon/60 shadow-[0_30px_90px_-40px_rgba(0,212,255,0.6)] lg:-translate-y-3" : ""}`}
            >
              {p.badge && (
                <span className="absolute -top-3.5 start-7 rounded-full bg-neon px-3 py-1 text-xs font-bold text-navy">{p.badge}</span>
              )}
              <h3 className="text-2xl font-extrabold text-white">{p.name}</h3>
              <p className="mt-2 min-h-12 text-sm text-muted">{p.target}</p>

              <div className="mt-6 rounded-2xl border border-line bg-white/5 p-5">
                <p className="text-xs text-muted">السعر</p>
                <p className="mt-1 font-display text-lg font-extrabold text-white sm:text-xl">بعد الاستشارة المجانية</p>
                <p className="mt-1 text-xs text-neon">عرض سعر مكتوب يناسب حجم نشاطك</p>
              </div>

              <ul className="mt-7 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/85">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neon/15 text-neon">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl border border-neon/30 bg-neon/10 p-4 text-xs leading-relaxed text-white/80">
                <p className="font-bold text-neon">دعم وصيانة مجانية: {p.support}</p>
                <p className="mt-1.5">{freeMaintenance.after}</p>
                <p className="mt-1 text-muted">ملاحظة: {freeMaintenance.note}</p>
              </div>

              <div className="mt-auto pt-8">
                <Button href={whatsappLink(`مرحبًا، أرغب في استشارة مجانية وعرض سعر لـ${p.name}.`)} variant={p.badge ? "neon" : "outline"} className="w-full">
                  احصل على عرض سعرك <span aria-hidden>↗</span>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-3xl rounded-3xl border border-neon/50 bg-neon/10 p-6 text-center sm:p-8">
          <p className="font-display text-lg font-extrabold leading-relaxed text-white sm:text-xl">{freeMaintenancePromo}</p>
        </Reveal>

        <Reveal delay={0.15} className="card mx-auto mt-8 max-w-3xl p-6 sm:p-8">
          <p className="label">ماذا تحصل في الاستشارة المجانية</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {consultationPromise.map((c) => (
              <li key={c} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/85">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neon/15 text-neon">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {c}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex justify-center">
            <Button href={consultationLink} size="lg">
              احجز استشارتك المجانية الآن <span aria-hidden>↗</span>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
