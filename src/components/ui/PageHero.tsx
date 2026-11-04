import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

export function PageHero({ label, title, lead }: { label: string; title: string; lead?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="glow-neon pointer-events-none absolute -top-40 start-1/2 h-[520px] w-[520px] translate-x-1/2" />
      <div className="container-x relative py-20 lg:py-28">
        <Reveal>
          <SectionLabel>{label}</SectionLabel>
        </Reveal>
        <Reveal as="h1" delay={0.05} className="mt-5 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.25] text-white">
          {title}
        </Reveal>
        {lead && (
          <Reveal as="p" delay={0.1} className="mt-6 max-w-2xl text-lg text-muted">
            {lead}
          </Reveal>
        )}
      </div>
    </section>
  );
}
