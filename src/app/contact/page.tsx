import type { Metadata } from "next";
import { site } from "@/lib/site";
import { ContactForm } from "@/components/contact/ContactForm";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "اطلب استشارة",
  description: "تواصل مع وكالة أثر لاستشارة مجانية حول الشات بوت، الظهور في خرائط قوقل، وأتمتة الأعمال.",
};

export default function ContactPage() {
  return (
    <section className="bg-white">
      <div className="container-x grid min-h-[80vh] lg:grid-cols-12">
        <div className="relative flex flex-col justify-between border-b border-line py-16 lg:col-span-5 lg:border-b-0 lg:border-e lg:py-28 lg:pe-16">
          <div>
            <SectionLabel>استشارة مجانية</SectionLabel>
            <h1 className="mt-5 font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.1] text-navy">
              أخبرنا أين
              <br />
              يتسرّب عملاؤك.
            </h1>
            <p className="mt-8 max-w-md text-[15px] leading-8 text-muted">
              املأ النموذج وسنعود إليك خلال يوم عمل بتشخيص أولي مجاني: ماذا يحدث لرسائلك بعد الدوام، وأين تظهر في خرائط
              الحي، وما النظام الذي يوقف الهدر.
            </p>
          </div>
          <dl className="mt-14 grid grid-cols-2 gap-8 text-sm">
            <div>
              <dt className="label text-muted">البريد</dt>
              <dd className="mt-2">
                <a href={`mailto:${site.email}`} dir="ltr" className="text-navy hover:text-cobalt">
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label text-muted">المقر</dt>
              <dd className="mt-2 text-navy">{site.city}</dd>
            </div>
            <div>
              <dt className="label text-muted">ساعات الرد</dt>
              <dd className="mt-2 text-navy">الأحد — الخميس، ٩ ص — ٦ م</dd>
            </div>
            <div>
              <dt className="label text-muted">المساعد الذكي</dt>
              <dd className="mt-2 text-navy">متاح ٢٤/٧</dd>
            </div>
          </dl>
        </div>

        <div className="py-16 lg:col-span-7 lg:py-28 lg:ps-16">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
