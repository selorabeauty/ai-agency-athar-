import { SectionLabel } from "./SectionLabel";

export function PageHero({ label, title, lead }: { label: string; title: React.ReactNode; lead?: string }) {
  return (
    <section className="bg-white">
      <div className="container-x border-b border-line pt-20 pb-14 lg:pt-32 lg:pb-20">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-[1.1] text-navy">{title}</h1>
        {lead && <p className="mt-8 max-w-2xl text-base leading-8 text-muted lg:text-lg">{lead}</p>}
      </div>
    </section>
  );
}
