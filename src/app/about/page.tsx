import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { consultationLink, sectors, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "من نحن",
  description: "أثر للذكاء الاصطناعي: وكالة سعودية تبني أنظمة ذكية تعمل لأجل أصحاب الأعمال على مدار الساعة.",
};

const values = [
  { title: "نطبّق قبل أن نبيع", body: "كل نظام نقدّمه لعملائنا يعمل أولًا داخل أثر: موقعنا، مساعدنا الذكي، وظهورنا في الخرائط." },
  { title: "نتائج تُقاس، لا وعود", body: "نقيس ما يهمّك فعلًا: زمن الردّ، عدد الحجوزات، المكالمات من الخرائط — ونرسلها لك شهريًا بلغة واضحة." },
  { title: "نظام واحد، لا أدوات متفرقة", body: "الموقع والواتساب والخرائط وCRM تعمل كمنظومة واحدة، لا كاشتراكات متناثرة يديرها موظف مرهق." },
  { title: "بياناتك ملكك", body: "الدومين، الملف التجاري، وقاعدة العملاء تُسجَّل باسمك دائمًا، ونلتزم بنظام حماية البيانات الشخصية في المملكة." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="من نحن"
        title="وُلدت أثر من سؤال بسيط: لماذا تخسر المنشآت الجيدة عملاءها رقميًا؟"
        lead="لأن الردّ متأخر، والموقع قديم، والظهور في الخرائط غائب. فبنينا وكالة تُصلح الثلاثة بنظام واحد — ونطبّقه على أنفسنا قبل عملائنا."
      />

      <section className="border-b border-line">
        <div className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-5">
            <SectionHeading label="قصتنا" title="من الرياض، لأصحاب الأعمال الذين لا يملكون وقتًا لتفويت عميل" />
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-white/75 lg:col-span-7">
            <Reveal as="p">
              {site.name} وكالة سعودية متخصصة في بناء أنظمة الذكاء الاصطناعي والأتمتة للأعمال: شات بوت واتساب يردّ خلال ثوانٍ، ظهور محلي في خرائط قوقل يجلب عملاء جددًا، وأنظمة CRM تتابع كل استفسار حتى يصبح حجزًا.
            </Reveal>
            <Reveal as="p" delay={0.05}>
              نعمل مع {sectors.join("، و")} — قطاعات تملك عملاء جاهزين للدفع، لكنها تخسرهم يوميًا بسبب الردّ المتأخر والحضور الرقمي الضعيف.
            </Reveal>
            <Reveal as="p" delay={0.1}>
              لا نبيع التقنية لذاتها. نبيع النتيجة: عميل راسلك الساعة ١١ مساءً وحجز موعده قبل أن ينام.
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-ink">
        <div className="container-x py-20 lg:py-28">
          <SectionHeading label="قيمنا" title="أربعة مبادئ نلتزم بها في كل مشروع" />
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={0.06 * i} className="card card-hover p-7">
                <h3 className="text-lg font-bold text-white">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container-x flex flex-col items-start justify-between gap-8 py-20 lg:flex-row lg:items-center">
          <h2 className="max-w-xl text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.3] text-white">جاهز لنظام يعمل لأجلك على مدار الساعة؟</h2>
          <Button href={consultationLink} size="lg">
            اطلب استشارة مجانية <span aria-hidden>↗</span>
          </Button>
        </div>
      </section>
    </>
  );
}
