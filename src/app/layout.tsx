import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const display = IBM_Plex_Sans_Arabic({
  variable: "--font-display",
  subsets: ["arabic"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const body = Noto_Kufi_Arabic({
  variable: "--font-body",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "أثر للذكاء الاصطناعي — أنظمة تعمل لأجلك",
    template: "%s | أثر للذكاء الاصطناعي",
  },
  description:
    "وكالة أثر: شات بوت واتساب بالذكاء الاصطناعي، تحسين الظهور في خرائط قوقل، ومواقع وأنظمة CRM مؤتمتة للعيادات ومكاتب المحاماة والمصانع في المملكة العربية السعودية.",
  openGraph: {
    title: "أثر للذكاء الاصطناعي",
    description: "حلول تقنية تبني الثقة وتضاعف المبيعات دون تدخل بشري.",
    locale: "ar_SA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${display.variable} ${body.variable}`}>
      <body className="bg-white text-navy antialiased">
        <a href="#main" className="skip-link">
          تخطَّ إلى المحتوى
        </a>
        <UtilityBar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
