import { NextResponse } from "next/server";
import type { DocModel } from "@/components/docs/model";
import { createContract, deleteContract, listContracts } from "@/lib/contracts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const recs = await listContracts();
  return NextResponse.json(
    recs.slice(0, 50).map((r) => ({
      id: r.id,
      createdAt: r.createdAt,
      number: r.doc.number,
      client: r.doc.client,
      activity: r.doc.activity,
      pkg: r.doc.pkg.name,
      total: r.doc.total,
      signedAt: r.signed?.at,
      signedName: r.signed?.name,
    })),
  );
}

export async function POST(req: Request) {
  const raw = await req.text();
  if (raw.length > 400_000) return NextResponse.json({ error: "too large" }, { status: 413 });
  let doc: DocModel;
  try {
    doc = JSON.parse(raw).doc;
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!doc?.client || !doc?.number || !doc?.pkg?.name) return NextResponse.json({ error: "missing fields" }, { status: 400 });
  try {
    const rec = await createContract(doc);
    return NextResponse.json({ id: rec.id });
  } catch (e) {
    console.error("[contracts] create failed", e);
    return NextResponse.json({ error: "storage failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id") ?? "";
  return (await deleteContract(id)) ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "not found" }, { status: 404 });
}
