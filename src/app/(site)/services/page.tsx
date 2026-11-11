import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { CheckIcon, serviceIcon } from "@/components/ui/Icons";
import { consultationLink, services } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/services" },
  title: "الخدمات",
  description: "شات بوت واتساب بالذكاء الاصطناعي، تحسين الظهور في خرائط قوقل، وأتمتة CRM — أنظمة تعمل لأجلك 24/7.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="الخدمات"
        title="ثلاثة أنظمة، هدف واحد: ألّا يضيع عليك عميل"
        lead="كل خدمة تعمل وحدها، لكنها تُحدث الأثر الأكبر عندما تعمل معًا كمنظومة واحدة."
      />
      {services.map((s, i) => {
        const Icon = serviceIcon[s.id];
        return (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-heading`} className={`scroll-mt-24 border-b border-line ${i % 2 ? "bg-ink" : ""}`}>
            <div className="container-x grid gap-10 py-20 lg:grid-cols-12 lg:py-24">
              <div className="lg:col-span-5">
                <Reveal className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon/10 text-neon">
                    <Icon />
                  </span>
                  <span className="font-display text-sm font-bold text-muted">{s.number}</span>
                </Reveal>
                <Reveal as="h2" delay={0.05} className="mt-6 text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.3] text-white">
                  <span id={`${s.id}-heading`}>{s.title}</span>
                </Reveal>
                <Reveal as="p" delay={0.1} className="mt-2 font-medium text-neon">
                  {s.tagline}
                </Reveal>
              </div>
              <div className="lg:col-span-7">
                <Reveal as="p" className="text-lg leading-relaxed text-white/75">
                  {s.description}
                </Reveal>
                <Reveal delay={0.05} className="card mt-8 p-7">
                  <p className="label mb-4">ماذا يشمل</p>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-white/85">
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neon/15 text-neon">
                          <CheckIcon className="h-3 w-3" />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 border-t border-line pt-5 text-sm font-bold text-white">{s.outcome}</p>
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}
      <section>
        <div className="container-x flex flex-col items-start justify-between gap-8 py-20 lg:flex-row lg:items-center">
          <h2 className="max-w-xl text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.3] text-white">أي نظام يناسب نشاطك؟ نرشّح لك الأنسب مجانًا.</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={consultationLink} size="lg">
              اطلب استشارة مجانية <span aria-hidden>↗</span>
            </Button>
            <Button href="/#pricing" variant="outline" size="lg">
              الباقات والأسعار
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
