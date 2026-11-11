import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { packages, services, site } from "@/lib/site";

const baseUrl = "https://atherdigitalagency.com";

const orgSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${baseUrl}/#business`,
      name: site.name,
      alternateName: "آثر ديجيتال",
      description: site.trust,
      url: baseUrl,
      logo: `${baseUrl}/og.png`,
      image: `${baseUrl}/og.png`,
      email: site.email,
      telephone: site.phone,
      address: { "@type": "PostalAddress", addressLocality: "تبوك", addressCountry: "SA" },
      areaServed: { "@type": "Country", name: "المملكة العربية السعودية" },
      availableLanguage: ["ar", "en"],
      knowsAbout: services.map((s) => s.title),
      makesOffer: packages.map((p) => ({
        "@type": "Offer",
        name: p.name,
        description: p.target,
        price: p.setup.replace(/[^0-9]/g, ""),
        priceCurrency: "SAR",
        url: `${baseUrl}/#pricing`,
      })),
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: site.name,
      inLanguage: "ar",
      publisher: { "@id": `${baseUrl}/#business` },
    },
  ],
};

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-navy text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <a href="#main" className="skip-link">
        تخطَّ إلى المحتوى
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
