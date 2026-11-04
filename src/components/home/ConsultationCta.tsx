import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function ConsultationCta() {
  return (
    <section aria-labelledby="cta-heading" className="grad-blue relative overflow-hidden text-white">
      <div aria-hidden className="pointer-events-none absolute -bottom-40 start-[-10%] h-[520px] w-[520px] rounded-full border border-white/10" />
      <div aria-hidden className="pointer-events-none absolute -top-56 end-[-5%] h-[640px] w-[640px] rounded-full border border-white/10" />
      <div className="container-x relative flex flex-col items-start gap-10 py-28 lg:flex-row lg:items-end lg:justify-between lg:py-40">
        <Reveal>
          <SectionLabel tone="light">استشارة</SectionLabel>
          <h2 id="cta-heading" className="mt-5 font-display text-[clamp(2.6rem,6.5vw,6rem)] leading-[1.1]">
            دعنا نبني
            <br />
            نظامك القادم.
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="flex flex-col items-start gap-5">
          <p className="max-w-sm text-base leading-8 text-white/75">
            استشارة مجانية لمدة ٢٠ دقيقة نحدد فيها أين يتسرّب العملاء من منشأتك، وما النظام الذي يوقف ذلك.
          </p>
          <Link
            href="/contact"
            className="inline-flex h-13 items-center gap-2 rounded-full bg-white px-8 text-base font-medium text-navy transition hover:bg-icy"
          >
            ابدأ محادثة <span aria-hidden>↗</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
