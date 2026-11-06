import { after, NextResponse } from "next/server";
import { getContract, publicView, signContract } from "@/lib/contracts";
import { money } from "@/components/docs/model";
import { notifyTeam } from "@/lib/whatsapp/bot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const rec = await getContract((await params).id);
  if (!rec) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(publicView(rec), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  const raw = await req.text();
  if (raw.length > 300_000) return NextResponse.json({ error: "too large" }, { status: 413 });
  let body: { name?: string; image?: string; agree?: boolean };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const name = (body.name ?? "").trim();
  const image = body.image ?? "";
  if (!body.agree || name.length < 2 || name.length > 80 || !image.startsWith("data:image/png;base64,")) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const existing = await getContract(id);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (existing.signed) return NextResponse.json({ error: "already signed" }, { status: 409 });
  const rec = await signContract(id, {
    name,
    image,
    at: new Date().toISOString(),
    ip: (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim(),
    ua: req.headers.get("user-agent") ?? "",
  });
  if (!rec) return NextResponse.json({ error: "already signed" }, { status: 409 });
  const origin = new URL(req.url).origin;
  after(() =>
    notifyTeam(`العميل ${name} وقّع العقد`, [
      ["العميل", `${rec.doc.client} — ${rec.doc.activity}`],
      ["الباقة", rec.doc.pkg.name],
      ["الإجمالي", money(rec.doc.total)],
      ["رقم العرض", rec.doc.number],
      ["العقد الموقّع", `${origin}/sign/${id}`],
    ]),
  );
  return NextResponse.json(publicView(rec));
}
