import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/site";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ConsultationCta } from "@/components/home/ConsultationCta";

export const metadata: Metadata = {
  title: "خدماتنا",
  description: "شات بوت واتساب بالذكاء الاصطناعي، تحسين الظهور في خرائط قوقل والتقييمات، ومواقع وأنظمة CRM مؤتمتة.",
};

const included: Record<string, string[]> = {
  chatbots: ["ربط رسمي بواجهة واتساب للأعمال", "تدريب على خدماتك وأسعارك وأسئلتك الشائعة", "حجز وتأكيد وتذكير بالمواعيد", "تحويل للموظف البشري بضغطة", "لوحة محادثات وتقارير أسبوعية"],
  maps: ["تهيئة الملف التجاري بالكامل", "صور ومنشورات شهرية بالعربية", "محرك طلب تقييمات تلقائي بعد الزيارة", "رد على التقييمات بصوت منشأتك", "تقرير شهري لمشاهدات الخريطة والاتصالات"],
  crm: ["موقع تحريري فاخر بالعربية (RTL)", "استضافة وصيانة ومراقبة مستمرة", "نموذج طلب يذهب مباشرة للوحة CRM", "تنبيهات واتساب للفريق فور وصول الطلب", "تقارير أداء وتحسين مستمر"],
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="خدماتنا"
        title={
          <>
            ثلاثة أنظمة.
            <br />
            نتيجة واحدة: عملاء أكثر بجهد أقل.
          </>
        }
        lead="نقدّم كل نظام برسم تأسيس واشتراك شهري واضح يشمل التشغيل والصيانة والتطوير. اختر نظامًا واحدًا أو اجمعها في حزمة."
      />

      {services.map((s, i) => {
        const flip = i % 2 === 1;
        return (
          <section key={s.id} id={s.id} className={`scroll-mt-24 ${i % 2 === 0 ? "bg-white" : "bg-offwhite"}`} aria-labelledby={`${s.id}-title`}>
            <div className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-32">
              <Reveal className={`relative aspect-[5/4] overflow-hidden rounded-[3px] lg:col-span-6 lg:aspect-auto lg:min-h-[560px] ${flip ? "lg:order-2" : ""}`}>
                <Image src={s.image} alt={s.title} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
                <span className="absolute top-5 inset-inline-start-5 label text-white/85" dir="ltr">
                  {s.number}
                </span>
              </Reveal>
              <div className={`relative flex flex-col justify-center lg:col-span-5 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"}`}>
                <span className="outline-numeral pointer-events-none absolute -top-10 inset-inline-end-0 text-[9rem]" aria-hidden>
                  {s.number}
                </span>
                <Reveal>
                  <SectionLabel>{s.kicker}</SectionLabel>
                  <h2 id={`${s.id}-title`} className="mt-4 font-display text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.2]">
                    {s.title}
                  </h2>
                </Reveal>
                <Reveal delay={0.1} className="mt-6 text-[15px] leading-8 text-muted">
                  {s.summary}
                </Reveal>
                <Reveal delay={0.15} className="mt-8">
                  <p className="label text-muted">ماذا يشمل</p>
                  <ul className="mt-4 divide-y divide-line border-y border-line text-sm text-navy/85">
                    {included[s.id].map((item) => (
                      <li key={item} className="flex items-center gap-3 py-3">
                        <span className="h-px w-5 bg-cobalt" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal delay={0.2}>
                  <Link href="/contact" className="pill-gradient mt-10 inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium text-white">
                    اطلب استشارة <span aria-hidden>↗</span>
                  </Link>
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      <ConsultationCta />
    </>
  );
}
