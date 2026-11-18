import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { CheckList, DirectAnswer, JsonLd, LandingCta, QAList, baseUrl, breadcrumb } from "@/components/seo/LandingParts";
import { industryPages, servicePages } from "@/lib/seo-pages";
import { industries, services } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return industryPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = industryPages.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.title, description: p.description, alternates: { canonical: `/industries/${p.slug}` }, openGraph: { title: p.title, description: p.description, url: `/industries/${p.slug}` } };
}

export default async function IndustryDetail({ params }: Props) {
  const { slug } = await params;
  const p = industryPages.find((x) => x.slug === slug);
  if (!p) notFound();
  const it = industries.find((x) => x.name === p.name);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Service", name: p.title, description: p.answer, url: `${baseUrl}/industries/${p.slug}`, provider: { "@id": `${baseUrl}/#business` }, audience: { "@type": "BusinessAudience", name: p.name }, areaServed: { "@type": "Country", name: "المملكة العربية السعودية" }, inLanguage: "ar" },
      breadcrumb([{ name: "الرئيسية", path: "/" }, { name: "القطاعات", path: "/#industries" }, { name: p.name, path: `/industries/${p.slug}` }]),
    ],
  };
  return (
    <>
      <JsonLd data={schema} />
      <PageHero label={p.name} title={p.h1} lead={it ? `${it.leak} ${it.win}` : p.description} />
      <DirectAnswer heading={`كيف تجلب ${p.name} عملاء أكثر من الإنترنت؟`} text={p.answer} />
      <CheckList heading="عمليات بحث يكتبها عملاؤك في قوقل" items={p.searches.map((s) => `«${s}» + اسم مدينتك`)} />
      <CheckList heading="النظام الذي نبنيه لك" items={p.system} />
      <QAList heading="أسئلة شائعة" faqs={p.faqs} />
      <LandingCta links={servicePages.map((x) => ({ href: `/services/${x.slug}`, label: services.find((y) => y.id === x.serviceId)!.title }))} />
    </>
  );
}
