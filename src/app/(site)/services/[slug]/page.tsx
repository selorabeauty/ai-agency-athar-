import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { CheckList, DirectAnswer, JsonLd, LandingCta, QAList, baseUrl, breadcrumb } from "@/components/seo/LandingParts";
import { servicePages } from "@/lib/seo-pages";
import { services, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return servicePages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = servicePages.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.title, description: p.description, alternates: { canonical: `/services/${p.slug}` }, openGraph: { title: p.title, description: p.description, url: `/services/${p.slug}` } };
}

export default async function ServiceDetail({ params }: Props) {
  const { slug } = await params;
  const p = servicePages.find((x) => x.slug === slug);
  if (!p) notFound();
  const s = services.find((x) => x.id === p.serviceId)!;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Service", name: p.title, serviceType: s.title, description: p.answer, url: `${baseUrl}/services/${p.slug}`, provider: { "@id": `${baseUrl}/#business` }, areaServed: { "@type": "Country", name: "المملكة العربية السعودية" }, inLanguage: "ar" },
      breadcrumb([{ name: "الرئيسية", path: "/" }, { name: "الخدمات", path: "/services" }, { name: s.title, path: `/services/${p.slug}` }]),
    ],
  };
  const others = servicePages.filter((x) => x.slug !== p.slug).map((x) => ({ href: `/services/${x.slug}`, label: services.find((y) => y.id === x.serviceId)!.title }));
  return (
    <>
      <JsonLd data={schema} />
      <PageHero label={s.tagline} title={p.h1} lead={s.description} />
      <DirectAnswer heading={`ما هي خدمة ${s.title}؟`} text={p.answer} />
      <CheckList heading="ماذا يشمل" items={s.bullets} />
      <CheckList heading={`كيف نعمل معك في ${site.short}`} items={p.steps} />
      <QAList heading="أسئلة يسألها أصحاب الأعمال" faqs={p.faqs} />
      <LandingCta links={[...others, { href: "/tabuk", label: "خدماتنا في تبوك" }]} />
    </>
  );
}
