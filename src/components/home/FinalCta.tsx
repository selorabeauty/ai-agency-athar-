import { Button } from "@/components/ui/Button";
import { consultationLink } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-heading" className="relative overflow-hidden border-t border-line">
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0" />
      <div aria-hidden className="glow-neon pointer-events-none absolute -bottom-60 start-1/2 h-[700px] w-[700px] translate-x-1/2" />
      <div className="container-x relative py-24 text-center lg:py-32">
        <Reveal as="h2" className="mx-auto max-w-3xl text-[clamp(1.9rem,4.5vw,3.25rem)] leading-[1.25] text-white">
          كم عميلًا راسلك الليلة الماضية <span className="text-neon">ولم يجد ردًّا؟</span>
        </Reveal>
        <Reveal as="p" delay={0.08} className="mx-auto mt-6 max-w-2xl text-lg text-white/75">
          احجز استشارة مجانية، وسنريك خلال 20 دقيقة أين تضيع فرصك وكيف يبدو نظام يعمل لأجلك 24/7.
        </Reveal>
        <Reveal delay={0.16} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={consultationLink} size="lg">
            اطلب استشارة مجانية <span aria-hidden>↗</span>
          </Button>
          <Button href="/#pricing" variant="outline" size="lg">
            راجع الباقات
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
