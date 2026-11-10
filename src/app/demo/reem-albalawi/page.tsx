import type { Metadata } from "next";
import { LawDemo } from "@/components/demo/law/LawDemo";
import { reemFirm } from "@/components/demo/law/data";

export const metadata: Metadata = {
  title: "لوحة تحكم مكتب المحامية ريم مسند البلوي — عرض تجريبي",
  description: "إدارة المواعيد والاستشارات والعملاء وتحليل أداء الموقع — عرض تجريبي من آثر ديجيتال.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "لوحة تحكم مكتب المحامية ريم مسند البلوي",
    description: "المواعيد والاستشارات • دليل العملاء • تحليل SEO وأداء الموقع",
    locale: "ar_SA",
    type: "website",
    images: [{ url: "/demo/reem-albalawi-og.png", width: 1200, height: 630 }],
  },
};

export default function ReemAlbalawiDemoPage() {
  return <LawDemo firm={reemFirm} />;
}
