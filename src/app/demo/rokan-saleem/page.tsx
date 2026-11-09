import type { Metadata } from "next";
import { RestaurantDemo } from "@/components/demo/restaurant/RestaurantDemo";

export const metadata: Metadata = {
  title: "لوحة تحكم مطعم ركن سليم — عرض تجريبي",
  description: "إدارة الطلبات الفورية والمنيو وظهور جوجل والشات بوت 24/7 والتقييمات — عرض تجريبي من آثر ديجيتال.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "لوحة تحكم مطعم ركن سليم الذكية",
    description: "طلبات فورية • إدارة المنيو • #1 في بحث الوجه • شات بوت 24/7 • التقييمات",
    locale: "ar_SA",
    type: "website",
    images: [{ url: "/demo/rokan-saleem-og.png", width: 1200, height: 630 }],
  },
};

export default function RokanSaleemDemoPage() {
  return <RestaurantDemo />;
}
