import type { Metadata } from "next";
import { DocsDashboard } from "@/components/admin/DocsDashboard";

export const metadata: Metadata = {
  title: "لوحة العروض والعقود",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <DocsDashboard />;
}
