import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ConsultationCta } from "@/components/home/ConsultationCta";

export const metadata: Metadata = {
  title: "من نحن",
  description: "قصة وكالة أثر، فلسفة التشغيل الكامل، وقيمنا في بناء أنظمة ذكية للأعمال السعودية.",
};

const values = [
  { n: "01", t: "الأثر قبل الأدوات", d: "لا نبيع تقنية. نبيع نتيجة قابلة للقياس: حجز، طلب، تقييم. الأداة تفصيل نحن من يتحمّله." },
  { n: "02", t: "العربية أولًا", d: "كل ما نبنيه يُكتب ويُصمَّم بالعربية من السطر الأول، بلهجة يفهمها عميلك ويثق بها." },
  { n: "03", t: "صفر صداع تقني", d: "أنت لا تدير خوادم ولا تتابع تحديثات. نحن نشغّل النظام ونطوّره وأنت ترى التقارير." },
  { n: "04", t: "شفافية الأرقام", d: "تقرير شهري بلغة واضحة: كم رسالة أُجيبت، كم موعد حُجز، كم تقييم أُضيف. لا تعقيد." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="من نحن"
        title={
          <>
            وُلدت أثر من سؤال بسيط:
            <br />
            لماذا تخسر المنشآت الجيدة عملاءها رقميًا؟
          </>
        }
        lead="لأن الرد متأخر، والموقع قديم، والظهور في الخرائط غائب. فبنينا وكالة تُصلح الثلاثة بنظام واحد — ونطبّقه على أنفسنا قبل عملائنا."
      />

      <section className="bg-white">
        <div className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-[3px] lg:col-span-7 lg:aspect-[16/10]">
            <Image src="/images/office-2.jpg" alt="مساحة عمل حديثة" fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
          </Reveal>
          <div className="flex flex-col justify-center lg:col-span-4 lg:col-start-9">
            <Reveal>
              <SectionLabel>القصة</SectionLabel>
              <h2 className="mt-4 font-display text-3xl leading-[1.25] lg:text-4xl">نأكل مما نطبخ.</h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-6 space-y-5 text-[15px] leading-8 text-muted">
              <p>
                قبل أن نعرض أي خدمة على عميل، نشغّلها على وكالتنا: موقعنا، مساعدنا الذكي على واتساب، ظهورنا في خرائط
                قوقل. ما تراه هنا هو المنتج نفسه.
              </p>
              <p>بدأنا من الرياض، ونخدم العيادات ومكاتب المحاماة والمصانع في كل مدن المملكة.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-offwhite">
        <div className="container-x py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <SectionLabel>فلسفة التشغيل الكامل</SectionLabel>
                <h2 className="mt-4 font-display text-3xl leading-[1.25] lg:text-4xl">أنت تملك النتيجة. نحن نملك التعقيد.</h2>
              </Reveal>
            </div>
            <Reveal delay={0.1} className="space-y-6 text-[15px] leading-8 text-muted lg:col-span-7 lg:col-start-6">
              <p>
                نموذجنا هو &quot;الخدمة المُدارة&quot;: نختار التقنية الأنسب من أفضل المزوّدين عالميًا، نبنيها لتناسب منشأتك،
                ثم نشغّلها نيابة عنك باشتراك شهري واضح. لا رخص متناثرة، لا فريق تقني داخلي، لا مفاجآت.
              </p>
              <p>
                ولأننا نثق بما نبنيه، نلتزم بضمان الأثر: إذا لم يُحدث النظام فرقًا قابلًا للقياس خلال ٩٠ يومًا، نعيد العمل
                على حسابنا حتى يفعل.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x py-20 lg:py-28">
          <Reveal>
            <SectionLabel>قيمنا</SectionLabel>
          </Reveal>
          <ul className="mt-10 grid gap-px bg-line sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.n} as="li" delay={i * 0.08} className="relative bg-white p-8 lg:p-12">
                <span className="outline-numeral absolute top-4 inset-inline-end-6 text-7xl" aria-hidden>
                  {v.n}
                </span>
                <h3 className="font-display text-2xl text-navy">{v.t}</h3>
                <p className="mt-4 max-w-sm text-[15px] leading-8 text-muted">{v.d}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <ConsultationCta />
    </>
  );
}
