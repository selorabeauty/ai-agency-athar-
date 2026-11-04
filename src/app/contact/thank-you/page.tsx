import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "تم استلام طلبك",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <section className="bg-white">
      <div className="container-x flex min-h-[70vh] flex-col items-start justify-center py-24">
        <SectionLabel>تم الاستلام</SectionLabel>
        <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,5.5vw,5rem)] leading-[1.1] text-navy">
          شكرًا لك.
          <br />
          وصل طلبك وسنعود إليك خلال يوم عمل.
        </h1>
        <p className="mt-8 max-w-xl text-[15px] leading-8 text-muted">
          في هذه الأثناء، يمكنك استكشاف أنظمتنا الثلاثة أو قراءة قصة أثر. إن كان الأمر عاجلًا، راسلنا على البريد الموضّح
          في أسفل الصفحة.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/services" className="pill-gradient inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium text-white">
            استكشف خدماتنا <span aria-hidden>↗</span>
          </Link>
          <Link href="/" className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-6 text-sm text-navy hover:border-navy">
            الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </section>
  );
}
