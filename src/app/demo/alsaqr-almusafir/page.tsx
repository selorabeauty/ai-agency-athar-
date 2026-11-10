import type { Metadata } from "next";
import { TravelDemo } from "@/components/demo/travel/TravelDemo";

export const metadata: Metadata = {
  title: "لوحة تحكم الصقر المسافر — عرض تجريبي",
  description: "إدارة الحجوزات والخدمات والشات بوت والعملاء والمدونة — عرض تجريبي من آثر ديجيتال.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "لوحة تحكم الصقر المسافر للسفر والسياحة",
    description: "الحجوزات • الطيران والفنادق والبكجات والتأشيرات • الشات بوت والعملاء • المدونة",
    locale: "ar_SA",
    type: "website",
    images: [{ url: "/demo/alsaqr-almusafir-og.png", width: 1200, height: 630 }],
  },
};

export default function AlsaqrDemoPage() {
  return <TravelDemo />;
}
