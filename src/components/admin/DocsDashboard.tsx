"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { packages } from "@/lib/site";
import { QuotePage } from "@/components/docs/DocPages";
import { buildDoc, BRAND, money, renderPdf, shareOrDownload, type Form } from "@/components/docs/model";

type Doc = { name: string; url: string; blob: Blob };
type HistoryItem = { number: string; date: string; pkg: string; total: number };

const defaultDays: Record<string, string> = { starter: "7", niche: "14", standard: "21" };
const emptyForm: Form = { pkg: "starter", extras: [], discount: "", days: "7", updatesCap: "3" };

const field = "w-full rounded-xl border border-line bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-neon/60 focus:outline-none";

export function DocsDashboard() {
  const [form, setForm] = useState<Form>(emptyForm);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState({ number: "", date: "" });
  const pagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("athar-admin-settings") || "{}");
      if (saved.updatesCap) setForm((f) => ({ ...f, updatesCap: saved.updatesCap }));
      const h = JSON.parse(localStorage.getItem("athar-admin-history") || "[]");
      setHistory(Array.isArray(h) ? h : []);
    } catch {}
  }, []);

  const doc = useMemo(() => buildDoc(form, meta), [form, meta]);
  const { total, half } = doc;

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setDocs([]);
    if (k === "updatesCap") localStorage.setItem("athar-admin-settings", JSON.stringify({ updatesCap: v }));
  };

  async function generate() {
    setError("");
    setBusy(true);
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const number = `ATH-${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
    const date = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
    setMeta({ number, date });
    await new Promise((r) => setTimeout(r, 80));
    try {
      const blob = await renderPdf(Array.from(pagesRef.current!.querySelectorAll<HTMLElement>("[data-page]")));
      const name = `عرض سعر - ${doc.pkg.name} - ${BRAND}.pdf`;
      setDocs([{ name, url: URL.createObjectURL(blob), blob }]);
      const next = [{ number, date, pkg: doc.pkg.name, total }, ...history].slice(0, 30);
      setHistory(next);
      localStorage.setItem("athar-admin-history", JSON.stringify(next));
    } catch (e) {
      setError("تعذّر إنشاء الملف: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container-x py-10 lg:py-14">
      <h1 className="text-2xl text-white lg:text-3xl">لوحة عروض الأسعار</h1>
      <p className="mt-2 text-sm text-white/70">اختر الباقة والإضافات، ويطلع لك عرض سعر PDF جاهز ترسله على الواتساب.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="min-w-0 space-y-6 lg:col-span-5">
          <div className="card space-y-4 p-5">
            <h2 className="text-lg text-white">اختر الباقة</h2>
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
                  <input className={`${field} min-w-0 flex-1`} placeholder="الخدمة" value={x.name} onChange={(e) => set("extras", form.extras.map((y, j) => (j === i ? { ...y, name: e.target.value } : y)))} />
                  <input className={`${field.replace("w-full ", "")} w-24 shrink-0`} placeholder="السعر" inputMode="numeric" value={x.price} onChange={(e) => set("extras", form.extras.map((y, j) => (j === i ? { ...y, price: e.target.value } : y)))} />
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
              <label className="col-span-2 text-xs text-white/70">
                عدد التحديثات الشهرية المجانية
                <input className={`${field} mt-1`} inputMode="numeric" value={form.updatesCap} onChange={(e) => set("updatesCap", e.target.value)} />
              </label>
            </div>

            <div className="rounded-xl bg-white/5 p-4 text-sm text-white">
              <div className="flex justify-between"><span>الإجمالي</span><b className="text-neon">{money(total)}</b></div>
              <div className="mt-1 flex justify-between text-white/70"><span>الدفعة الأولى 50%</span><span>{money(half)}</span></div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="button" onClick={generate} disabled={busy} className="btn-neon flex h-12 w-full items-center justify-center rounded-full font-bold disabled:opacity-60">
              {busy ? "جاري التجهيز..." : "إنشاء عرض السعر PDF"}
            </button>

            {docs.map((d) => (
              <div key={d.name} className="space-y-2 rounded-xl border border-neon/40 p-4">
                <p className="text-sm font-bold text-white">الملف جاهز ✓</p>
                <button type="button" onClick={() => shareOrDownload([d], BRAND)} className="btn-neon flex h-11 w-full items-center justify-center rounded-full text-sm font-bold">
                  مشاركة (واتساب)
                </button>
                <a href={d.url} download={d.name} className="flex h-10 w-full items-center justify-center rounded-full border border-line text-sm text-white hover:border-neon/60">
                  تحميل PDF
                </a>
              </div>
            ))}
          </div>

          {history.length > 0 && (
            <div className="card p-5">
              <h2 className="text-lg text-white">آخر العروض</h2>
              <ul className="mt-3 divide-y divide-line text-sm">
                {history.map((h) => (
                  <li key={h.number} className="flex items-center justify-between gap-3 py-2 text-white/80">
                    <span>
                      <b className="text-white">{h.pkg}</b>
                      <br />
                      <span className="text-xs text-white/50">{h.date} · {h.number}</span>
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
            <div style={{ width: 794 * 0.62, height: 1123 * 0.62 }} className="mx-auto">
              <div ref={pagesRef} style={{ transform: "scale(0.62)", transformOrigin: "top right", width: 794 }} className="space-y-[20px]">
                <QuotePage doc={doc} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
