"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { packages } from "@/lib/site";
import { ContractPages, QuotePage } from "@/components/docs/DocPages";
import { buildDoc, BRAND, money, renderPdf, safeName, shareOrDownload, type DocModel, type Form, type Settings } from "@/components/docs/model";
import { SignaturePad } from "@/components/docs/SignaturePad";

type Doc = { name: string; url: string; blob: Blob };
type HistoryItem = { number: string; date: string; client: string; activity: string; pkg: string; total: number };
type Sent = { id: string; createdAt: string; number: string; client: string; activity: string; pkg: string; total: number; signedAt?: string; signedName?: string };

const defaultDays: Record<string, string> = { starter: "7", niche: "14", standard: "21" };
const emptyForm: Form = { client: "", activity: "", phone: "", city: "تبوك", clientId: "", pkg: "starter", extras: [], discount: "", days: "7" };
const emptySettings: Settings = { repName: "", repId: "", beneficiary: "", iban: "", updatesCap: "3", signature: "" };

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

const waNumber = (phone: string) => {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("966")) return d;
  if (d.startsWith("05")) return "966" + d.slice(1);
  if (d.startsWith("5") && d.length === 9) return "966" + d;
  return d;
};
const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB");

const field = "w-full rounded-xl border border-line bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-neon/60 focus:outline-none";

export function DocsDashboard() {
  const [form, setForm] = useState<Form>(emptyForm);
  const [settings, setSettings] = useState<Settings>(emptySettings);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState({ number: "", date: "" });
  const [generated, setGenerated] = useState<DocModel | null>(null);
  const [link, setLink] = useState("");
  const [linkBusy, setLinkBusy] = useState(false);
  const [sent, setSent] = useState<Sent[]>([]);
  const pagesRef = useRef<HTMLDivElement>(null);

  const loadSent = useCallback(() => {
    fetch("/admin/api/contracts", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then(setSent)
      .catch(() => {});
  }, []);
  useEffect(loadSent, [loadSent]);

  useEffect(() => {
    setSettings(load("athar-admin-settings", emptySettings));
    try {
      setHistory(JSON.parse(localStorage.getItem("athar-admin-history") || "[]"));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("athar-admin-settings", JSON.stringify(settings));
  }, [settings]);

  const doc = useMemo(() => buildDoc(form, settings, meta), [form, settings, meta]);
  const { total, half } = doc;

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setDocs([]);
    setLink("");
  };
  const setS = <K extends keyof Settings>(k: K, v: string) => {
    setSettings((s) => ({ ...s, [k]: v }));
    setDocs([]);
    setLink("");
  };

  async function generate() {
    if (!form.client.trim() || !form.activity.trim()) {
      setError("اكتب اسم العميل ونشاطه أولاً.");
      return;
    }
    setError("");
    setBusy(true);
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const number = `ATH-${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
    const date = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
    setMeta({ number, date });
    await new Promise((r) => setTimeout(r, 80));
    try {
      const root = pagesRef.current!;
      const safe = safeName(form.client);
      const out: Doc[] = [];
      for (const [kind, label] of [
        ["quote", "عرض سعر"],
        ["contract", "عقد"],
      ] as const) {
        const blob = await renderPdf(Array.from(root.querySelectorAll<HTMLElement>(`[data-page^="${kind}"]`)));
        out.push({ name: `${label} - ${safe}.pdf`, url: URL.createObjectURL(blob), blob });
      }
      setGenerated(buildDoc(form, settings, { number, date }));
      setLink("");
      setDocs(out);
      const item: HistoryItem = { number, date, client: form.client, activity: form.activity, pkg: doc.pkg.name, total };
      const next = [item, ...history].slice(0, 30);
      setHistory(next);
      localStorage.setItem("athar-admin-history", JSON.stringify(next));
    } catch (e) {
      setError("تعذّر إنشاء الملفات: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setBusy(false);
    }
  }

  const share = (files: Doc[]) => shareOrDownload(files, `${BRAND} — ${form.client}`);

  async function createLink() {
    if (!generated) return;
    setLinkBusy(true);
    setError("");
    try {
      const r = await fetch("/admin/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc: generated }),
      });
      if (!r.ok) throw new Error(String(r.status));
      const { id } = await r.json();
      setLink(`${location.origin}/sign/${id}`);
      loadSent();
    } catch (e) {
      setError("تعذّر إنشاء رابط التوقيع: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLinkBusy(false);
    }
  }

  const waText = (url: string) =>
    `مرحباً ${form.client}، يسعدنا التعامل معك\nهذا رابط مراجعة عقد «${doc.pkg.name}» وتوقيعه إلكترونياً من جوالك:\n${url}\n\n${BRAND}`;

  return (
    <section className="container-x py-10 lg:py-14">
      <h1 className="text-2xl text-white lg:text-3xl">لوحة العروض والعقود</h1>
      <p className="mt-2 text-sm text-white/70">اكتب بيانات العميل واختر الباقة، وتطلع لك ملفات PDF جاهزة باسمه.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="min-w-0 space-y-6 lg:col-span-5">
          <div className="card space-y-4 p-5">
            <h2 className="text-lg text-white">بيانات العميل</h2>
            <input className={field} placeholder="اسم العميل *" value={form.client} onChange={(e) => set("client", e.target.value)} />
            <input className={field} placeholder="اسم النشاط / نوعه * (مثال: عيادة أسنان النخبة)" value={form.activity} onChange={(e) => set("activity", e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <input className={field} placeholder="جوال العميل" inputMode="tel" dir="ltr" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              <input className={field} placeholder="المدينة" value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <input className={field} placeholder="رقم الهوية / السجل التجاري (اختياري)" value={form.clientId} onChange={(e) => set("clientId", e.target.value)} />

            <div className="grid gap-2">
              {packages.map((p) => (
                <label key={p.id} className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm ${form.pkg === p.id ? "border-neon bg-neon/10 text-white" : "border-line text-white/80"}`}>
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="pkg"
                      checked={form.pkg === p.id}
                      onChange={() => {
                        set("pkg", p.id);
                        set("days", defaultDays[p.id] ?? form.days);
                      }}
                    />
                    {p.name}
                  </span>
                  <b>{p.setup}</b>
                </label>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-white/80">خدمات إضافية (اختياري)</p>
              {form.extras.map((x, i) => (
                <div key={i} className="flex gap-2">
                  <input className={field} placeholder="الخدمة" value={x.name} onChange={(e) => set("extras", form.extras.map((y, j) => (j === i ? { ...y, name: e.target.value } : y)))} />
                  <input className={`${field} w-28 shrink-0`} placeholder="السعر" inputMode="numeric" value={x.price} onChange={(e) => set("extras", form.extras.map((y, j) => (j === i ? { ...y, price: e.target.value } : y)))} />
                  <button type="button" className="shrink-0 px-2 text-white/60 hover:text-white" onClick={() => set("extras", form.extras.filter((_, j) => j !== i))} aria-label="حذف">
                    ✕
                  </button>
                </div>
              ))}
              <div className="flex flex-wrap gap-2">
                {["شات بوت واتساب بالذكاء الاصطناعي", "تهيئة الملف التجاري في Google", "خدمة أخرى"].map((n) => (
                  <button key={n} type="button" className="rounded-full border border-line px-3 py-1.5 text-xs text-white/80 hover:border-neon/60" onClick={() => set("extras", [...form.extras, { name: n === "خدمة أخرى" ? "" : n, price: "" }])}>
                    + {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-white/70">
                خصم (ر.س)
                <input className={`${field} mt-1`} inputMode="numeric" placeholder="0" value={form.discount} onChange={(e) => set("discount", e.target.value)} />
              </label>
              <label className="text-xs text-white/70">
                مدة التنفيذ (أيام عمل)
                <input className={`${field} mt-1`} inputMode="numeric" value={form.days} onChange={(e) => set("days", e.target.value)} />
              </label>
            </div>

            <div className="rounded-xl bg-white/5 p-4 text-sm text-white">
              <div className="flex justify-between"><span>الإجمالي</span><b className="text-neon">{money(total)}</b></div>
              <div className="mt-1 flex justify-between text-white/70"><span>الدفعة الأولى 50%</span><span>{money(half)}</span></div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="button" onClick={generate} disabled={busy} className="btn-neon flex h-12 w-full items-center justify-center rounded-full font-bold disabled:opacity-60">
              {busy ? "جاري التجهيز..." : "إنشاء عرض السعر والعقد"}
            </button>

            {docs.length > 0 && (
              <div className="space-y-2 rounded-xl border border-neon/40 p-4">
                <p className="text-sm font-bold text-white">الملفات جاهزة ✓</p>
                <button type="button" onClick={() => share(docs)} className="btn-neon flex h-11 w-full items-center justify-center rounded-full text-sm font-bold">
                  مشاركة الملفين (واتساب)
                </button>
                {docs.map((d) => (
                  <div key={d.name} className="flex gap-2">
                    <a href={d.url} download={d.name} className="flex h-10 flex-1 items-center justify-center rounded-full border border-line text-sm text-white hover:border-neon/60">
                      تحميل: {d.name}
                    </a>
                    <button type="button" onClick={() => share([d])} className="h-10 rounded-full border border-line px-4 text-sm text-white hover:border-neon/60">
                      مشاركة
                    </button>
                  </div>
                ))}
                <div className="mt-3 space-y-2 border-t border-line pt-3">
                  <p className="text-sm font-bold text-white">توقيع العميل إلكترونياً</p>
                  {!link ? (
                    <button type="button" onClick={createLink} disabled={linkBusy} className="flex h-11 w-full items-center justify-center rounded-full border border-neon text-sm font-bold text-neon disabled:opacity-60">
                      {linkBusy ? "جاري الإنشاء..." : "إنشاء رابط توقيع للعميل"}
                    </button>
                  ) : (
                    <>
                      <input readOnly dir="ltr" className={field} value={link} onFocus={(e) => e.target.select()} />
                      <div className="flex gap-2">
                        <a
                          href={`https://wa.me/${waNumber(form.phone)}?text=${encodeURIComponent(waText(link))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-neon flex h-11 flex-1 items-center justify-center rounded-full text-sm font-bold"
                        >
                          إرسال الرابط للعميل (واتساب)
                        </a>
                        <button type="button" onClick={() => navigator.clipboard?.writeText(link)} className="h-11 rounded-full border border-line px-4 text-sm text-white hover:border-neon/60">
                          نسخ
                        </button>
                      </div>
                      <p className="text-xs text-white/55">يفتح العميل الرابط، يراجع العقد ويوقّع بإصبعه. يوصلك تنبيه، وتلقى العقد الموقّع في «العقود المرسلة».</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {sent.length > 0 && (
            <div className="card p-5">
              <h2 className="text-lg text-white">العقود المرسلة للتوقيع</h2>
              <ul className="mt-3 divide-y divide-line text-sm">
                {sent.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3 py-2 text-white/80">
                    <span>
                      <b className="text-white">{c.client}</b> · {c.pkg}
                      <br />
                      <span className="text-xs text-white/50">
                        {c.number} · {money(c.total)}
                      </span>
                    </span>
<span className="flex shrink-0 items-center gap-2">
                      <a href={`/sign/${c.id}`} target="_blank" rel="noopener noreferrer" className={`rounded-full px-3 py-1 text-xs ${c.signedAt ? "bg-neon/15 text-neon" : "border border-line text-white/70"}`}>
                        {c.signedAt ? `موقّع ✓ ${shortDate(c.signedAt)}` : "بانتظار التوقيع"}
                      </a>
                      <button
                        type="button"
                        aria-label="حذف"
                        className="px-1 text-white/40 hover:text-red-400"
                        onClick={async () => {
                          if (!confirm(`حذف عقد ${c.client}؟ ما يقدر العميل يفتح الرابط بعدها.`)) return;
                          await fetch(`/admin/api/contracts?id=${c.id}`, { method: "DELETE" });
                          loadSent();
                        }}
                      >
                        ✕
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <details className="card p-5">
            <summary className="cursor-pointer text-white">بياناتك (تُحفظ على هذا الجهاز)</summary>
            <div className="mt-4 space-y-3">
              <input className={field} placeholder="اسمك (ممثل أثر في العقد)" value={settings.repName} onChange={(e) => setS("repName", e.target.value)} />
              <input className={field} placeholder="رقم هويتك" value={settings.repId} onChange={(e) => setS("repId", e.target.value)} />
              <input className={field} placeholder="اسم المستفيد في البنك" value={settings.beneficiary} onChange={(e) => setS("beneficiary", e.target.value)} />
              <input className={field} placeholder="الآيبان SA..." dir="ltr" value={settings.iban} onChange={(e) => setS("iban", e.target.value)} />
              <label className="block text-xs text-white/70">
                عدد التحديثات الشهرية المجانية
                <input className={`${field} mt-1`} inputMode="numeric" value={settings.updatesCap} onChange={(e) => setS("updatesCap", e.target.value)} />
              </label>
              <div>
                <p className="mb-1 text-xs text-white/70">توقيعك (يظهر تلقائياً في كل عرض سعر وعقد)</p>
                <SignaturePad value={settings.signature} onChange={(v) => setS("signature", v)} />
              </div>
            </div>
          </details>

          {history.length > 0 && (
            <div className="card p-5">
              <h2 className="text-lg text-white">آخر العروض</h2>
              <ul className="mt-3 divide-y divide-line text-sm">
                {history.map((h) => (
                  <li key={h.number} className="flex items-center justify-between gap-3 py-2 text-white/80">
                    <span>
                      <b className="text-white">{h.client}</b> · {h.activity}
                      <br />
                      <span className="text-xs text-white/50">{h.date} · {h.pkg} · {h.number}</span>
                    </span>
                    <span className="shrink-0 text-neon">{money(h.total)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="min-w-0 lg:col-span-7">
          <p className="mb-3 text-sm text-white/60">معاينة</p>
          <div className="overflow-x-auto rounded-2xl border border-line bg-white/5 p-3">
            <div style={{ width: 794 * 0.62, height: 1123 * 0.62 * 3 + 24 }} className="mx-auto">
              <div ref={pagesRef} style={{ transform: "scale(0.62)", transformOrigin: "top right", width: 794 }} className="space-y-[20px]">
                <QuotePage doc={doc} />
                <ContractPages doc={doc} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
