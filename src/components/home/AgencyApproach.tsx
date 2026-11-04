import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function AgencyApproach() {
  return (
    <section aria-labelledby="approach-heading" className="bg-offwhite">
      <div className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-32">
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[3px] lg:col-span-6 lg:aspect-auto lg:min-h-[640px]">
          <Image src="/images/team.jpg" alt="اجتماع عمل في مكتب حديث" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          <span className="absolute bottom-4 start-4 label text-white/80">منهج أثر — ٢٠٢٦</span>
        </Reveal>

        <div className="flex flex-col justify-center lg:col-span-5 lg:col-start-8">
          <Reveal>
            <SectionLabel>منهجنا</SectionLabel>
            <h2 id="approach-heading" className="mt-4 font-display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.2]">
              الأعمال لا تنمو بالصدفة.
              <br />
              بل بالأنظمة.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 space-y-5 text-[15px] leading-8 text-muted">
            <p>
              نعمل بنموذج التشغيل الكامل: نحن من يختار التقنية، ويبنيها، ويشغّلها، ويطوّرها. أنت ترى النتائج فقط —
              حجوزات مؤكدة، طلبات مرتّبة، وتقييمات تتراكم.
            </p>
            <p>
              إرشاد مدروس من أول اجتماع، صفر صداع تقني، وضمان واضح على العائد: إن لم يُحدث النظام أثرًا قابلًا للقياس
              خلال ٩٠ يومًا، نعيد العمل حتى يفعل.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
            {[
              ["< ١٠ ث", "زمن الرد على العميل"],
              ["٢٤/٧", "تشغيل بلا توقف"],
              ["٩٠ يومًا", "ضمان الأثر"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="font-display text-2xl text-navy">{v}</p>
                <p className="mt-1 text-xs text-muted">{l}</p>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.3}>
            <Link href="/about" className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-cobalt">
              تعرّف على أثر <span aria-hidden>↗</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
