import { NextResponse } from "next/server";
import { listRecords } from "@/lib/onboarding/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, records: await listRecords() });
}
