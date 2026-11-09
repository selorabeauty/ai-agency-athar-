import type { Metadata } from "next";
import { HotelDemo } from "@/components/demo/hotel/HotelDemo";

export const metadata: Metadata = {
  title: "لوحة تحكم فندق ماسة الوجه — عرض تجريبي",
  description: "منصة ذكية لإدارة الحجوزات والغرف والمساعد الذكي 24/7 والسمعة والتحليلات — عرض تجريبي من آثر ديجيتال.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "لوحة تحكم فندق ماسة الوجه الذكية",
    description: "حجوزات فورية • حالة الغرف والأجنحة • مساعد ذكي 24/7 • السمعة والتحليلات",
    locale: "ar_SA",
    type: "website",
    images: [{ url: "/demo/masat-alwajh-og.png", width: 1200, height: 630 }],
  },
};

export default function MasatAlwajhDemoPage() {
  return <HotelDemo />;
}
