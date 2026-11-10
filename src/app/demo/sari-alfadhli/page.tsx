import type { Metadata } from "next";
import { LawDemo } from "@/components/demo/law/LawDemo";
import { sariFirm } from "@/components/demo/law/data";

export const metadata: Metadata = {
  title: "لوحة تحكم مكتب المحامي ساري الفاضلي — عرض تجريبي",
  description: "إدارة المواعيد والاستشارات والعملاء وتحليل أداء الموقع — عرض تجريبي من آثر ديجيتال.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "لوحة تحكم مكتب المحامي ساري الفاضلي للمحاماة والاستشارات القانونية",
    description: "المواعيد والاستشارات • دليل العملاء • تحليل SEO وأداء الموقع",
    locale: "ar_SA",
    type: "website",
    images: [{ url: "/demo/sari-alfadhli-og.png", width: 1200, height: 630 }],
  },
};

export default function SariAlfadhliDemoPage() {
  return <LawDemo firm={sariFirm} />;
}
