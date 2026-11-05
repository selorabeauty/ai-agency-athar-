import { consultationLink, freeMaintenancePromo, packages, whatsappLink } from "@/lib/site";
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
          label="الباقات والأسعار"
          title="أسعار واضحة بالريال السعودي، بلا مفاجآت"
          lead="سعر تأسيس ثابت تدفعه مرة واحدة فقط. اختر ما يناسب مرحلة عملك اليوم."
        />

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {packages.map((p, i) => (
            <Reveal
              key={p.id}
              delay={0.08 * i}
              className={`card card-hover relative flex flex-col p-7 sm:p-8 ${p.highlight ? "border-neon/60 shadow-[0_30px_90px_-40px_rgba(0,212,255,0.6)] lg:-translate-y-3" : ""}`}
            >
              {p.highlight && (
                <span className="absolute -top-3.5 start-7 rounded-full bg-neon px-3 py-1 text-xs font-bold text-navy">الأكثر طلبًا</span>
              )}
              <h3 className="text-2xl font-extrabold text-white">{p.name}</h3>
              <p className="mt-2 min-h-12 text-sm text-muted">{p.target}</p>

              <div className="mt-6 rounded-2xl border border-line bg-white/5 p-5">
                <p className="text-xs text-muted">سعر التأسيس</p>
                <p className="mt-1 font-display text-xl font-extrabold text-white sm:text-2xl">{p.setup}</p>
                <p className="mt-1 text-xs text-neon">{p.setupNote}</p>
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

              <div className="mt-auto pt-8">
                <Button href={whatsappLink(`مرحبًا، أرغب في طلب ${p.name} بسعر ${p.setup}.`)} variant={p.highlight ? "neon" : "outline"} className="w-full">
                  ابدأ بهذه الباقة <span aria-hidden>↗</span>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-3xl rounded-3xl border border-neon/50 bg-neon/10 p-6 text-center sm:p-8">
          <p className="font-display text-lg font-extrabold leading-relaxed text-white sm:text-xl">{freeMaintenancePromo}</p>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted">
          غير متأكد أي باقة تناسبك؟{" "}
          <a href={consultationLink} target="_blank" rel="noopener noreferrer" className="font-bold text-neon underline-offset-4 hover:underline">
            اطلب استشارة مجانية عبر واتساب
          </a>{" "}
          وسنرشّح لك الأنسب خلال يوم عمل واحد.
        </Reveal>
      </div>
    </section>
  );
}
