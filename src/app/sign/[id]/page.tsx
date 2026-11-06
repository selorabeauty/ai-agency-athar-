import type { Metadata } from "next";
import { SignClient } from "@/components/docs/SignClient";

export const metadata: Metadata = {
  title: "توقيع العقد",
  robots: { index: false, follow: false },
};

export default async function SignPage({ params }: { params: Promise<{ id: string }> }) {
  return <SignClient id={(await params).id} />;
}
