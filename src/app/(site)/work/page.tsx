import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd, LandingCta, breadcrumb } from "@/components/seo/LandingParts";

const title = "نماذج أعمالنا: لوحات تحكم وأنظمة تجريبية";
const description = "نماذج تجريبية حية من أعمال أثر: لوحات تحكم للحجوزات والعملاء والشات بوت. البيانات فيها توضيحية.";

export const metadata: Metadata = { title, description, alternates: { canonical: "/work" }, openGraph: { title, description, url: "/work" } };

const demos = [
  { href: "/demo/alsaqr-almusafir", name: "لوحة تحكم وكالة سفر وسياحة", body: "حجوزات الطيران والفنادق والبكجات والتأشيرات، شات بوت، إدارة العملاء، ومدونة — من لوحة واحدة." },
];

export default function WorkPage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...breadcrumb([{ name: "الرئيسية", path: "/" }, { name: "نماذج أعمالنا", path: "/work" }]) }} />
      <PageHero label="نماذج أعمالنا" title="جرّب النظام بنفسك قبل أن تقرر" lead="هذه نماذج تجريبية حية نبنيها لنريك كيف ستبدو لوحة التحكم لنشاطك. البيانات فيها توضيحية وليست لعملاء حقيقيين. ستُضاف دراسات حالة لعملائنا هنا بعد موافقتهم." />
      <section className="border-b border-line">
        <div className="container-x grid gap-5 py-14 md:grid-cols-2 lg:py-16">
          {demos.map((d) => (
            <Reveal key={d.href} className="card card-hover p-7">
              <p className="label">عرض تجريبي</p>
              <h2 className="mt-3 text-xl text-white">{d.name}</h2>
              <p className="mt-3 text-white/75">{d.body}</p>
              <Link href={d.href} className="mt-5 inline-flex text-sm font-bold text-neon hover:underline">افتح النموذج ↗</Link>
            </Reveal>
          ))}
        </div>
      </section>
      <LandingCta />
    </>
  );
}
