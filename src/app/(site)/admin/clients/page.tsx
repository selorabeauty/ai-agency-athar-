import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { ClientsDashboard } from "@/components/admin/ClientsDashboard";

export const metadata: Metadata = {
  title: "العملاء الجدد",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function ClientsPage() {
  return (
    <section className="container-x py-10 lg:py-14">
      <AdminNav active="/admin/clients" />
      <ClientsDashboard />
    </section>
  );
}
