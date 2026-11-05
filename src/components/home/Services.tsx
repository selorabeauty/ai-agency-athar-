import Link from "next/link";
import { services } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckIcon, serviceIcon } from "@/components/ui/Icons";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="relative scroll-mt-24 overflow-hidden border-t border-line">
      <div aria-hidden className="glow-neon pointer-events-none absolute top-1/3 start-[-20%] h-[600px] w-[600px] opacity-50" />
      <div className="container-x relative py-20 lg:py-28">
        <SectionHeading
          label="ماذا نبني لك"
          title="ثلاثة أنظمة تعمل معًا لتحويل كل استفسار إلى عميل"
          lead="لا نبيع أدوات متفرقة. نبني لك منظومة واحدة: يراك العميل في الخرائط، يراسلك على واتساب، يُجاب فورًا، ويُتابَع حتى يحجز."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = serviceIcon[s.id];
            return (
              <Reveal key={s.id} delay={0.08 * i} className="card card-hover flex flex-col p-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon/10 text-neon">
                    <Icon />
                  </span>
                  <span className="font-display text-sm font-bold text-muted">{s.number}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">{s.title}</h3>
                <p className="mt-1 text-sm font-medium text-neon">{s.tagline}</p>
                <p className="mt-4 text-sm leading-relaxed text-white/70">{s.description}</p>
                <ul className="mt-6 space-y-2.5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-white/85">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neon/15 text-neon">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-7">
                  <p className="border-t border-line pt-5 text-sm font-bold text-white">{s.outcome}</p>
                  <Link href={`/services#${s.id}`} className="mt-3 inline-flex items-center gap-1 text-sm text-neon hover:underline">
                    التفاصيل الكاملة <span aria-hidden>←</span>
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
