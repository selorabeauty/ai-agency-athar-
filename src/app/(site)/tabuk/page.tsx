import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CheckList, DirectAnswer, JsonLd, LandingCta, QAList, baseUrl, breadcrumb } from "@/components/seo/LandingParts";
import { industryPages, servicePages, tabukFaqs } from "@/lib/seo-pages";
import { services } from "@/lib/site";

const title = "شركة تسويق رقمي في تبوك";
const description = "أثر وكالة تسويق رقمي من تبوك: شات بوت واتساب بالذكاء الاصطناعي، تحسين الظهور في خرائط قوقل، إعلانات قوقل، ولوحات تحكم للعملاء.";

export const metadata: Metadata = { title, description, alternates: { canonical: "/tabuk" }, openGraph: { title, description, url: "/tabuk" } };

export default function TabukPage() {
  const schema = { "@context": "https://schema.org", "@graph": [breadcrumb([{ name: "الرئيسية", path: "/" }, { name: "تبوك", path: "/tabuk" }]), { "@type": "WebPage", url: `${baseUrl}/tabuk`, name: title, about: { "@id": `${baseUrl}/#business` }, inLanguage: "ar" }] };
  return (
    <>
      <JsonLd data={schema} />
      <PageHero label="تبوك" title="شركة تسويق رقمي في تبوك تقيس نتائجها بالطلبات" lead={description} />
      <DirectAnswer heading="ماذا تقدم أثر لأصحاب الأعمال في تبوك؟" text="أثر وكالة رقمية مقرها تبوك. نبني لأصحاب المحلات والشركات نظامًا يجلب الطلبات: ظهور في قوقل وخرائط قوقل عند البحث عن خدمتك في تبوك، ورد فوري على واتساب بالذكاء الاصطناعي، ومتابعة تلقائية حتى إغلاق البيع، وتقرير شهري يوضح عدد الطلبات ومصدرها." />
      <CheckList heading="خدماتنا" items={services.map((s) => `${s.title}: ${s.tagline}`)} />
      <CheckList heading="قطاعات نخدمها في تبوك والمملكة" items={industryPages.map((p) => p.name)} />
      <QAList heading="أسئلة شائعة" faqs={tabukFaqs} />
      <LandingCta links={[...servicePages.map((x) => ({ href: `/services/${x.slug}`, label: services.find((y) => y.id === x.serviceId)!.title })), ...industryPages.map((x) => ({ href: `/industries/${x.slug}`, label: x.name }))]} />
    </>
  );
}
