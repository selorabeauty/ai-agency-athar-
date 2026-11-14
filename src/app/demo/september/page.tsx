import type { Metadata } from "next";
import { SalonDemo } from "@/components/demo/salon/SalonDemo";

export const metadata: Metadata = {
  title: "لوحة تحكم صالون سبتمبر — عرض تجريبي",
  description: "إدارة أسعار الخدمات وعروض المواسم — عرض تجريبي من آثر ديجيتال.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "لوحة تحكم صالون سبتمبر الذكية",
    description: "تعديل أسعار بضغطة • عروض مواسم تفعّل بزر • حجوزات وإحصائيات",
    locale: "ar_SA",
    type: "website",
  },
};

export default function SeptemberDemoPage() {
  return <SalonDemo />;
}
