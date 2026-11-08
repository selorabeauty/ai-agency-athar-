import { NextResponse } from "next/server";
import { z } from "zod";
import { businessTypeById, days, fileCategories, MAX_FILE_BYTES, MAX_TOTAL_BYTES, accessPlatforms, type FileCategory } from "@/lib/onboarding/config";
import { createRecord, storageReady } from "@/lib/onboarding/store";
import { notifyTeam } from "@/lib/whatsapp/bot";

export const runtime = "nodejs";

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 6;
const perIp = new Map<string, number[]>();

const str = (max: number) => z.string().trim().max(max).default("");
const phone = z.string().trim().regex(/^\+?[0-9\s-]{8,18}$/, "رقم غير صالح");

const schema = z.object({
  businessType: z.string(),
  businessName: z.string().trim().min(2, "اكتب اسم النشاط").max(120),
  contactName: z.string().trim().min(2, "اكتب اسم المسؤول").max(80),
  phone,
  whatsapp: z.union([phone, z.literal("")]).default(""),
  email: z.union([z.string().trim().email("بريد غير صالح").max(120), z.literal("")]).default(""),
  city: z.string().trim().min(2, "اكتب المدينة").max(60),
  address: str(200),
  mapsLink: str(500),
  package: str(80),
  hours: z
    .array(z.object({ day: z.enum(days as [string, ...string[]]), open: z.boolean(), from: str(5), to: str(5) }))
    .max(7)
    .default([]),
  hoursNote: str(300),
  social: z.record(z.string(), str(300)).default({}),
  brandColors: str(200),
  mediaLink: str(500),
  notes: str(2000),
  details: z.record(z.string(), str(2000)).default({}),
  access: z.record(z.string(), str(40)).default({}),
  consent: z.literal(true, { message: "يلزم الموافقة على سياسة الخصوصية" }),
  website: str(200),
});

export async function POST(req: Request) {
  if (!storageReady()) return NextResponse.json({ ok: false, error: "الخدمة غير مهيأة حالياً، تواصل معنا عبر واتساب" }, { status: 503 });
  const len = Number(req.headers.get("content-length") || 0);
  if (len > MAX_TOTAL_BYTES + 2 * 1024 * 1024) return NextResponse.json({ ok: false, error: "حجم الملفات كبير جداً" }, { status: 413 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const hits = (perIp.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX) return NextResponse.json({ ok: false, error: "محاولات كثيرة، حاول لاحقاً" }, { status: 429 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "طلب غير صالح" }, { status: 400 });
  }

  let raw: unknown;
  try {
    raw = JSON.parse(String(form.get("data") ?? ""));
  } catch {
    return NextResponse.json({ ok: false, error: "طلب غير صالح" }, { status: 400 });
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "form");
      if (!fields[k]) fields[k] = issue.message;
    }
    return NextResponse.json({ ok: false, error: "تحقق من الحقول المطلوبة", fields }, { status: 422 });
  }
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true, ref: "" });

  const type = businessTypeById(d.businessType);
  if (!type) return NextResponse.json({ ok: false, error: "اختر نوع النشاط", fields: { businessType: "اختر نوع النشاط" } }, { status: 422 });

  const files: { category: FileCategory; name: string; type: string; bytes: Buffer }[] = [];
  let total = 0;
  for (const cat of Object.keys(fileCategories) as FileCategory[]) {
    const list = form.getAll(`file:${cat}`).filter((f): f is File => f instanceof File);
    if (list.length > fileCategories[cat].max) return NextResponse.json({ ok: false, error: `عدد ملفات «${fileCategories[cat].label}» أكثر من المسموح` }, { status: 422 });
    for (const f of list) {
      if (!fileCategories[cat].types.includes(f.type)) return NextResponse.json({ ok: false, error: `نوع الملف غير مدعوم: ${f.name}` }, { status: 422 });
      if (f.size > MAX_FILE_BYTES) return NextResponse.json({ ok: false, error: `الملف كبير جداً: ${f.name}` }, { status: 413 });
      total += f.size;
      if (total > MAX_TOTAL_BYTES) return NextResponse.json({ ok: false, error: "مجموع حجم الملفات كبير جداً" }, { status: 413 });
      files.push({ category: cat, name: f.name.slice(0, 120), type: f.type, bytes: Buffer.from(await f.arrayBuffer()) });
    }
  }

  perIp.set(ip, [...hits, now]);

  const details = type.fields
    .map((f) => ({ key: f.key, label: f.label, value: (d.details[f.key] ?? "").trim() }))
    .filter((x) => x.value && (!type.fields.find((f) => f.key === x.key)?.options || type.fields.find((f) => f.key === x.key)!.options!.includes(x.value)));
  const access = Object.fromEntries(accessPlatforms.map((p) => [p.id, d.access[p.id] ?? ""]).filter(([, v]) => v));
  const social = Object.fromEntries(Object.entries(d.social).filter(([k, v]) => ["instagram", "tiktok", "snapchat", "x", "website"].includes(k) && v));

  const rec = await createRecord(
    {
      ref: "",
      businessType: type.id,
      businessTypeLabel: type.label,
      businessName: d.businessName,
      contactName: d.contactName,
      phone: d.phone,
      whatsapp: d.whatsapp,
      email: d.email,
      city: d.city,
      address: d.address,
      mapsLink: d.mapsLink,
      package: d.package,
      hours: d.hours,
      hoursNote: d.hoursNote,
      social,
      brandColors: d.brandColors,
      mediaLink: d.mediaLink,
      notes: d.notes,
      details,
      access,
    },
    files,
    type.code,
  );

  notifyTeam(`عميل جديد عبّى بياناته — ${rec.businessName}`, [
    ["رقم الطلب", rec.ref],
    ["النشاط", `${rec.businessTypeLabel} — ${rec.city}`],
    ["المسؤول", rec.contactName],
    ["الجوال", rec.phone],
    ["الباقة", rec.package || "-"],
    ["الملفات", String(rec.files.length)],
    ["اللوحة", "https://atherdigitalagency.com/admin/clients"],
  ]).catch((e) => console.error("[onboarding] notify failed", e));

  return NextResponse.json({ ok: true, ref: rec.ref });
}
