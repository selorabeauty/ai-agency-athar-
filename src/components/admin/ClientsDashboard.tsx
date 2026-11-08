"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { businessTypes } from "@/lib/onboarding/config";
import type { OnboardingRecord, OnboardingStatus } from "@/lib/onboarding/store";

const statusLabel: Record<OnboardingStatus, string> = { new: "جديد", in_progress: "قيد التنفيذ", done: "مكتمل" };
const statusColor: Record<OnboardingStatus, string> = { new: "bg-neon text-navy", in_progress: "bg-amber-400 text-navy", done: "bg-emerald-400 text-navy" };
const field = "w-full rounded-xl border border-line bg-white/5 px-3 py-2 text-sm text-white focus:border-neon/60 focus:outline-none";
const ONBOARDING_URL = "https://atherdigitalagency.com/onboarding";

function brief(r: OnboardingRecord) {
  const lines = [
    `مشروع: ${r.project} (${r.ref})`,
    `النشاط: ${r.businessName} — ${r.businessTypeLabel}`,
    `المدينة: ${r.city}${r.address ? ` — ${r.address}` : ""}`,
    r.mapsLink && `خرائط جوجل: ${r.mapsLink}`,
    `المسؤول: ${r.contactName} — ${r.phone}`,
    r.whatsapp && `واتساب النشاط: ${r.whatsapp}`,
    r.email && `البريد: ${r.email}`,
    r.package && `الباقة: ${r.package}`,
    ...r.details.map((d) => `${d.label}: ${d.value}`),
    `أوقات العمل: ${r.hours.map((h) => (h.open ? `${h.day} ${h.from}-${h.to}` : `${h.day} مغلق`)).join("، ")}`,
    r.hoursNote && `ملاحظات الدوام: ${r.hoursNote}`,
    ...Object.entries(r.social).map(([k, v]) => `${k}: ${v}`),
    r.brandColors && `ألوان الهوية: ${r.brandColors}`,
    r.mediaLink && `ملفات إضافية: ${r.mediaLink}`,
    r.notes && `ملاحظات العميل: ${r.notes}`,
  ];
  return lines.filter(Boolean).join("\n");
}

export function ClientsDashboard() {
  const [records, setRecords] = useState<OnboardingRecord[] | null>(null);
  const [selected, setSelected] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [copied, setCopied] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/admin/api/onboarding", { cache: "no-store" });
    const data = await res.json().catch(() => ({ records: [] }));
    setRecords(data.records ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const shown = useMemo(
    () => (records ?? []).filter((r) => (!typeFilter || r.businessType === typeFilter) && (!statusFilter || r.status === statusFilter)),
    [records, typeFilter, statusFilter],
  );
  const rec = records?.find((r) => r.id === selected);

  async function patch(id: string, body: Partial<OnboardingRecord>) {
    const res = await fetch(`/admin/api/onboarding/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => null);
    if (data?.record) setRecords((rs) => rs?.map((r) => (r.id === id ? data.record : r)) ?? null);
  }

  async function remove(id: string) {
    if (!confirm("حذف بيانات هذا العميل وملفاته نهائياً؟")) return;
    await fetch(`/admin/api/onboarding/${id}`, { method: "DELETE" });
    setSelected("");
    load();
  }

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 1800);
    } catch {}
  }

  const sendLink = `https://wa.me/?text=${encodeURIComponent(`أهلاً بك! عشان نبدأ مشروعك، عبّ بيانات نشاطك وارفع ملفاتك من هذا الرابط الآمن (بدون أي كلمات مرور):\n${ONBOARDING_URL}`)}`;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl text-white lg:text-3xl">العملاء الجدد</h1>
          <p className="mt-2 text-sm text-white/70">كل عميل يعبّي صفحة البيانات يظهر هنا مع ملفاته، ومربوط برقم مشروع خاص فيه.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => copy(ONBOARDING_URL, "link")} className="rounded-full border border-line px-4 py-2 text-xs font-bold text-white hover:border-neon/50">
            {copied === "link" ? "تم النسخ ✓" : "نسخ رابط صفحة العميل"}
          </button>
          <a href={sendLink} target="_blank" rel="noopener noreferrer" className="btn-neon rounded-full px-4 py-2 text-xs font-bold">
            إرسال الرابط على واتساب
          </a>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <select className={field.replace("w-full ", "")} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="نوع النشاط">
          <option value="">كل الأنشطة</option>
          {businessTypes.map((b) => (
            <option key={b.id} value={b.id}>{b.label}</option>
          ))}
        </select>
        <select className={field.replace("w-full ", "")} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="الحالة">
          <option value="">كل الحالات</option>
          {(Object.keys(statusLabel) as OnboardingStatus[]).map((s) => (
            <option key={s} value={s}>{statusLabel[s]}</option>
          ))}
        </select>
        <button type="button" onClick={load} className="rounded-xl border border-line px-4 text-xs font-bold text-white/80 hover:border-neon/50">تحديث</button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <ul className="space-y-3 lg:col-span-5">
          {records === null && <li className="text-sm text-muted">جاري التحميل...</li>}
          {records && shown.length === 0 && <li className="card p-6 text-sm text-muted">ما فيه طلبات بعد. أرسلي رابط صفحة العميل لأول عميل يوافق.</li>}
          {shown.map((r) => (
            <li key={r.id}>
              <button type="button" onClick={() => setSelected(r.id)} className={`card w-full p-4 text-start transition ${selected === r.id ? "border-neon/70" : "hover:border-neon/40"}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-bold text-white">{r.businessName}</p>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusColor[r.status]}`}>{statusLabel[r.status]}</span>
                </div>
                <p className="mt-1 text-xs text-muted">{r.businessTypeLabel} · {r.city} · {new Date(r.createdAt).toLocaleDateString("ar-SA-u-ca-gregory")}</p>
                <p className="mt-1 text-[11px] text-neon" dir="ltr">{r.project}</p>
              </button>
            </li>
          ))}
        </ul>

        <div className="lg:col-span-7">
          {!rec ? (
            records && records.length > 0 && <div className="card p-6 text-sm text-muted">اختاري عميل من القائمة لعرض بياناته وملفاته.</div>
          ) : (
            <div className="card space-y-6 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl text-white">{rec.businessName}</h2>
                  <p className="mt-1 text-xs text-muted">{rec.businessTypeLabel} · رقم الطلب <span dir="ltr">{rec.ref}</span></p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => copy(brief(rec), "brief")} className="btn-neon rounded-full px-4 py-2 text-xs font-bold">{copied === "brief" ? "تم النسخ ✓" : "نسخ ملخص المشروع"}</button>
                  <button type="button" onClick={() => remove(rec.id)} className="rounded-full border border-red-400/50 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10">حذف</button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="text-xs text-white/70">
                  الحالة
                  <select className={`${field} mt-1`} value={rec.status} onChange={(e) => patch(rec.id, { status: e.target.value as OnboardingStatus })}>
                    {(Object.keys(statusLabel) as OnboardingStatus[]).map((s) => (
                      <option key={s} value={s}>{statusLabel[s]}</option>
                    ))}
                  </select>
                </label>
                <label className="text-xs text-white/70 sm:col-span-2">
                  المشروع المرتبط
                  <input key={`p-${rec.id}`} dir="ltr" className={`${field} mt-1`} defaultValue={rec.project} onBlur={(e) => e.target.value !== rec.project && patch(rec.id, { project: e.target.value })} />
                </label>
              </div>

              <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                {[
                  ["المسؤول", rec.contactName],
                  ["الجوال", rec.phone],
                  ["واتساب النشاط", rec.whatsapp],
                  ["البريد", rec.email],
                  ["المدينة", `${rec.city}${rec.address ? ` — ${rec.address}` : ""}`],
                  ["الباقة", rec.package],
                  ...rec.details.map((d) => [d.label, d.value]),
                  ["ألوان الهوية", rec.brandColors],
                  ["ملاحظات الدوام", rec.hoursNote],
                  ["ملاحظات العميل", rec.notes],
                ]
                  .filter(([, val]) => val)
                  .map(([k, val]) => (
                    <div key={k} className="min-w-0">
                      <dt className="text-xs text-muted">{k}</dt>
                      <dd className="mt-0.5 whitespace-pre-wrap break-words text-white">{val}</dd>
                    </div>
                  ))}
              </dl>

              <div>
                <p className="text-xs text-muted">أوقات العمل</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {rec.hours.map((h) => (
                    <span key={h.day} className="rounded-lg border border-line px-2 py-1 text-[11px] text-white/80">
                      {h.day}: {h.open ? <span dir="ltr">{h.from}–{h.to}</span> : "مغلق"}
                    </span>
                  ))}
                </div>
              </div>

              {(rec.mapsLink || rec.mediaLink || Object.keys(rec.social).length > 0) && (
                <div className="space-y-1 text-sm">
                  <p className="text-xs text-muted">الروابط</p>
                  {[["خرائط جوجل", rec.mapsLink], ["ملفات إضافية", rec.mediaLink], ...Object.entries(rec.social)]
                    .filter(([, u]) => u)
                    .map(([k, u]) => (
                      <p key={k} className="truncate"><span className="text-white/70">{k}: </span><span dir="ltr" className="text-neon">{u}</span></p>
                    ))}
                </div>
              )}

              <div>
                <p className="text-xs text-muted">حالة الصلاحيات</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  {Object.keys(rec.access).length === 0 && <span className="text-white/60">لم يحدد العميل</span>}
                  {Object.entries(rec.access).map(([k, val]) => (
                    <span key={k} className="rounded-lg border border-line px-2 py-1 text-white/80">{k.toUpperCase()}: {val}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted">الملفات ({rec.files.length})</p>
                <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {rec.files.map((f) => {
                    const url = `/admin/api/onboarding/${rec.id}/files/${f.id}`;
                    const img = ["image/png", "image/jpeg", "image/webp"].includes(f.type);
                    return (
                      <li key={f.id} className="overflow-hidden rounded-xl border border-line bg-white/5">
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          {img ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={url} alt={f.name} loading="lazy" className="h-24 w-full object-cover" />
                          ) : (
                            <div className="flex h-24 items-center justify-center text-xs font-bold text-neon">{f.name.split(".").pop()?.toUpperCase()}</div>
                          )}
                        </a>
                        <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                          <span className="truncate text-[10px] text-white/70">{f.category === "logo" ? "شعار" : f.category === "photos" ? "صورة" : "أسعار"}</span>
                          <a href={`${url}?download`} className="text-[10px] font-bold text-neon">تحميل</a>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <label className="block text-xs text-white/70">
                ملاحظاتك الداخلية
                <textarea key={`n-${rec.id}`} rows={3} className={`${field} mt-1`} defaultValue={rec.adminNote} onBlur={(e) => e.target.value !== rec.adminNote && patch(rec.id, { adminNote: e.target.value })} />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
