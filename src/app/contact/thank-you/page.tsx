import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "تم استلام طلبك",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="glow-neon pointer-events-none absolute -top-40 start-1/2 h-[600px] w-[600px] translate-x-1/2" />
      <div className="container-x relative flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <Reveal>
          <SectionLabel className="justify-center">تم الاستلام</SectionLabel>
        </Reveal>
        <Reveal as="h1" delay={0.05} className="mt-5 max-w-2xl text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.25] text-white">
          شكرًا لك. طلبك وصل، وسنعود إليك خلال يوم عمل.
        </Reveal>
        <Reveal as="p" delay={0.1} className="mt-6 max-w-xl text-lg text-white/75">
          في هذه الأثناء، راجع الباقات أو اقرأ عن طريقتنا في العمل.
        </Reveal>
        <Reveal delay={0.15} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/#pricing">الباقات والأسعار</Button>
          <Button href="/about" variant="outline">
            من نحن
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
