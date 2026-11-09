import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const display = Cairo({
  variable: "--font-display",
  subsets: ["arabic", "latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const body = Tajawal({
  variable: "--font-body",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://atherdigitalagency.com"),
  title: {
    default: `${site.name} — أنظمة ذكية تعمل لأجلك 24/7`,
    template: `%s | ${site.name}`,
  },
  description:
    "نحول حضورك الرقمي إلى حجوزات وعملاء على مدار الساعة: شات بوت واتساب بالذكاء الاصطناعي، تحسين الظهور في خرائط قوقل، وأتمتة CRM للشركات في المملكة العربية السعودية.",
  openGraph: {
    title: site.name,
    description: "أنظمة ذكية تعمل لأجلك 24/7 — لأن كل استفسار بعد الدوام هو موعد ضائع ومبيعات ضائعة.",
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
