import { faqs } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Faq() {
  return (
    <section aria-labelledby="faq-heading" className="border-t border-line bg-ink">
      <div className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-4">
          <SectionHeading label="أسئلة شائعة" title="ما يسأله أصحاب الأعمال قبل البدء" />
        </div>
        <div className="lg:col-span-8">
          <ul className="divide-y divide-line border-y border-line">
            {faqs.map((f, i) => (
              <Reveal as="li" key={f.q} delay={0.05 * i}>
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-bold text-white sm:text-lg [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-neon transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
