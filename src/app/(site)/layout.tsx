import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-navy text-white">
      <a href="#main" className="skip-link">
        تخطَّ إلى المحتوى
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
