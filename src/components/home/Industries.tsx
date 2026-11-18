import { consultationLink, industries } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Industries() {
  return (
    <section id="industries" aria-labelledby="industries-heading" className="relative scroll-mt-24 overflow-hidden border-t border-line bg-ink">
      <div aria-hidden className="glow-neon pointer-events-none absolute -bottom-40 end-[-15%] h-[560px] w-[560px] opacity-50" />
      <div className="container-x relative py-20 lg:py-28">
        <SectionHeading
          label="قطاعات نخدمها"
          title="مشروعك الواحد يساوي آلاف الريالات — فلماذا يضيع بسبب رسالة لم تُجب؟"
          lead="نعمل مع الشركات التي يكون فيها العميل الواحد صفقة كبيرة. في هذه القطاعات، طلب إضافي واحد في الشهر قد يغطي تكلفة النظام بالكامل."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((it, i) => (
            <Reveal key={it.name} delay={0.06 * i} className="card card-hover flex min-w-0 flex-col p-7">
              <h3 className="text-lg font-bold text-white">{it.name}</h3>
              <p className="mt-1 text-sm font-medium text-neon">{it.ticket}</p>
              <div className="mt-5 space-y-4 text-sm leading-relaxed">
                <p className="text-white/70">
                  <span className="font-bold text-white/90">أين تضيع المبيعات: </span>
                  {it.leak}
                </p>
                <p className="border-t border-line pt-4 text-white/85">
                  <span className="font-bold text-neon">ماذا نبني لك: </span>
                  {it.win}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl border border-neon/40 bg-neon/10 p-6 sm:p-8 lg:flex-row lg:items-center">
          <p className="max-w-2xl text-lg font-bold leading-relaxed text-white">
            نشاطك ليس في القائمة؟ إذا كان عميلك يبحث عنك في قوقل ويراسلك على واتساب، <span className="text-neon">فنظامنا يعمل لك.</span>
          </p>
          <Button href={consultationLink} size="lg" className="shrink-0">
            احجز تشخيصك المجاني <span aria-hidden>↗</span>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
