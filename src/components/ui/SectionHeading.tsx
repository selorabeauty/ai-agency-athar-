import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

export function SectionHeading({
  label,
  title,
  lead,
  align = "start",
}: {
  label: string;
  title: string;
  lead?: string;
  align?: "start" | "center";
}) {
  const center = align === "center";
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <Reveal>
        <SectionLabel className={center ? "justify-center" : ""}>{label}</SectionLabel>
      </Reveal>
      <Reveal as="h2" delay={0.05} className="mt-4 text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.3] text-white">
        {title}
      </Reveal>
      {lead && (
        <Reveal as="p" delay={0.1} className="mt-5 text-base text-muted sm:text-lg">
          {lead}
        </Reveal>
      )}
    </div>
  );
}
