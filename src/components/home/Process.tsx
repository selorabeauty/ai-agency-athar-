import { steps } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Process() {
  return (
    <section aria-labelledby="process-heading" className="border-t border-line bg-ink">
      <div className="container-x py-20 lg:py-28">
        <SectionHeading label="كيف نعمل" title="من أول مكالمة إلى نظام يعمل: أربع خطوات واضحة" />
        <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.number} delay={0.08 * i} className="card relative p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-neon/40 bg-neon/10 font-display text-lg font-extrabold text-neon">{s.number}</span>
              <h3 className="mt-5 text-lg font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
