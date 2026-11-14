import type { Metadata } from "next";
import { WingDemo } from "@/components/demo/coffee/WingDemo";

export const metadata: Metadata = {
  title: "لوحة تحكم كوفي وينغ Wing — عرض تجريبي",
  description: "إدارة المنيو والأسعار وباركود الطاولات QR — عرض تجريبي من آثر ديجيتال.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "لوحة تحكم كوفي وينغ الذكية",
    description: "منيو إلكتروني • تعديل أسعار بضغطة • باركود لكل طاولة",
    locale: "ar_SA",
    type: "website",
  },
};

export default function WingDemoPage() {
  return <WingDemo />;
}
