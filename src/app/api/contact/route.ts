import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { Resend } from "resend";
import { contactSchema, sectorLabel } from "@/lib/contact";

export const runtime = "nodejs";

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX = 5;

const recent = new Map<string, number>();
const perIp = new Map<string, number[]>();

function prune(now: number) {
  for (const [k, t] of recent) if (now - t > DUPLICATE_WINDOW_MS) recent.delete(k);
  for (const [k, arr] of perIp) {
    const kept = arr.filter((t) => now - t < RATE_WINDOW_MS);
    if (kept.length) perIp.set(k, kept);
    else perIp.delete(k);
  }
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "طلب غير صالح" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "form");
      if (!fields[k]) fields[k] = issue.message;
    }
    return NextResponse.json({ ok: false, error: "تحقق من الحقول", fields }, { status: 422 });
  }
  const data = parsed.data;

  if (data.website) {
    return NextResponse.json({ ok: true, delivered: false });
  }

  const now = Date.now();
  prune(now);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const hits = perIp.get(ip) ?? [];
  if (hits.length >= RATE_MAX) {
    return NextResponse.json({ ok: false, error: "محاولات كثيرة، حاول بعد دقيقة" }, { status: 429 });
  }
  perIp.set(ip, [...hits, now]);

  const fingerprint = createHash("sha256")
    .update(`${data.email}|${data.whatsapp}|${data.message.toLowerCase()}`)
    .digest("hex");
  if (recent.has(fingerprint)) {
    return NextResponse.json({ ok: true, delivered: false, duplicate: true });
  }
  recent.set(fingerprint, now);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || "athar.digital.agrncy@gmail.com";
  const from = process.env.RESEND_FROM || "Athar <onboarding@resend.dev>";

  const subject = `طلب استشارة جديد — ${data.name} (${sectorLabel(data.sector)})`;
  const text = [
    `الاسم: ${data.name}`,
    `البريد: ${data.email}`,
    `واتساب: ${data.whatsapp}`,
    `القطاع: ${sectorLabel(data.sector)}`,
    "",
    "الرسالة:",
    data.message,
  ].join("\n");
  const html = `<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;line-height:1.8;color:#0b132b">
    <h2 style="font-weight:400">طلب استشارة جديد</h2>
    <table style="border-collapse:collapse">
      <tr><td style="padding:4px 12px;color:#5b6475">الاسم</td><td>${escape(data.name)}</td></tr>
      <tr><td style="padding:4px 12px;color:#5b6475">البريد</td><td><a href="mailto:${escape(data.email)}">${escape(data.email)}</a></td></tr>
      <tr><td style="padding:4px 12px;color:#5b6475">واتساب</td><td><a href="https://wa.me/${data.whatsapp.replace("+", "")}">${escape(data.whatsapp)}</a></td></tr>
      <tr><td style="padding:4px 12px;color:#5b6475">القطاع</td><td>${escape(sectorLabel(data.sector))}</td></tr>
    </table>
    <p style="white-space:pre-wrap;border-top:1px solid #e5e7eb;padding-top:12px;margin-top:12px">${escape(data.message)}</p>
  </div>`;

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      recent.delete(fingerprint);
      return NextResponse.json({ ok: false, error: "خدمة البريد غير مهيأة حاليًا، تواصل معنا عبر واتساب" }, { status: 503 });
    }
    console.info("[contact] RESEND_API_KEY missing — logging submission instead of sending:\n" + text);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({ from, to, replyTo: data.email, subject, text, html });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    recent.delete(fingerprint);
    console.error("[contact] send failed", err);
    return NextResponse.json({ ok: false, error: "تعذّر إرسال الرسالة، حاول مرة أخرى" }, { status: 502 });
  }
}
