import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "اطلب استشارة مجانية",
  description: "أخبرنا عن نشاطك وسنعود إليك خلال يوم عمل بتشخيص مجاني لحضورك الرقمي.",
};

const facts = [
  ["البريد الرسمي", site.email, true],
  ["واتساب", site.phoneDisplay, false],
  ["المقر", site.city, false],
  ["ساعات الردّ البشري", "الأحد — الخميس، 9 ص — 6 م", false],
  ["المساعد الذكي", "متاح 24/7", false],
] as const;

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="glow-neon pointer-events-none absolute -top-40 end-[-10%] h-[600px] w-[600px]" />
      <div className="container-x relative grid gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionLabel>استشارة مجانية</SectionLabel>
          </Reveal>
          <Reveal as="h1" delay={0.05} className="mt-5 text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.25] text-white">
            أخبرنا أين يتسرّب عملاؤك، ونحن نوقف الهدر.
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-6 text-lg text-white/75">
            املأ النموذج وسنعود إليك خلال يوم عمل بتشخيص أولي مجاني: ماذا يحدث لرسائلك بعد الدوام، وأين تظهر في خرائط الحي، وما النظام الأنسب لك.
          </Reveal>
          <Reveal delay={0.15} className="mt-10">
            <dl className="grid gap-5 sm:grid-cols-2">
              {facts.map(([k, v, ltr]) => (
                <div key={k} className="rounded-2xl border border-line bg-white/5 p-5">
                  <dt className="text-xs text-muted">{k}</dt>
                  <dd className="mt-1 text-sm font-bold text-white" dir={ltr ? "ltr" : undefined}>
                    {ltr ? <a href={`mailto:${v}`} className="hover:text-neon">{v}</a> : v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Suspense fallback={<div className="card min-h-[480px]" aria-busy />}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
