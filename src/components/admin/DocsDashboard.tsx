"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { freeMaintenance, packages, site } from "@/lib/site";

type Extra = { name: string; price: string };
type Form = {
  client: string;
  activity: string;
  phone: string;
  city: string;
  clientId: string;
  pkg: string;
  extras: Extra[];
  discount: string;
  days: string;
};
type Settings = { repName: string; repId: string; beneficiary: string; iban: string; updatesCap: string };
type Doc = { name: string; url: string; blob: Blob };
type HistoryItem = { number: string; date: string; client: string; activity: string; pkg: string; total: number };

const defaultDays: Record<string, string> = { starter: "7", niche: "14", standard: "21" };
const emptyForm: Form = { client: "", activity: "", phone: "", city: "تبوك", clientId: "", pkg: "starter", extras: [], discount: "", days: "7" };
const emptySettings: Settings = { repName: "", repId: "", beneficiary: "", iban: "", updatesCap: "3" };
const BLANK = "________________";

const num = (v: string) => Number(v.replace(/[^\d.]/g, "")) || 0;
const money = (n: number) => `${n.toLocaleString("en-US")} ر.س`;
const ltr = (s: string) => `\u2066${s}\u2069`;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function Page({ children, id }: { children: ReactNode; id: string }) {
  return (
    <div
      data-page={id}
      dir="rtl"
      style={{ width: 794, height: 1123, fontFamily: "var(--font-body), Tajawal, sans-serif" }}
      className="relative flex flex-col overflow-hidden bg-white px-[52px] pt-[44px] pb-[36px] text-[12.5px] leading-[1.8] text-[#101826]"
    >
      <div className="mb-4 flex items-center justify-between border-b-[3px] border-[#00b8e6] pb-3">
        <div className="text-[22px] font-extrabold text-[#0b1220]">
          أثر <span className="text-[#00a6d6]">للذكاء الاصطناعي</span>
        </div>
        <div className="text-left text-[10.5px] leading-[1.6] text-[#556]">
          <div>واتساب: {ltr(site.phoneDisplay)}</div>
          <div dir="ltr">{site.email}</div>
          <div dir="ltr">atherdigitalagency.com</div>
        </div>
      </div>
      <div className="flex-1">{children}</div>
      <div className="mt-3 border-t border-[#dde] pt-2 text-center text-[10px] text-[#778]">
        {site.name} · {site.city}
      </div>
    </div>
  );
}

const H = ({ children }: { children: ReactNode }) => (
  <h2 className="mt-4 mb-1.5 border-r-4 border-[#00b8e6] pr-2 text-[14px] font-bold text-[#0089b3]">{children}</h2>
);
const UL = ({ items }: { items: ReactNode[] }) => (
  <ul className="list-disc space-y-0.5 pr-5">
    {items.map((x, i) => (
      <li key={i}>{x}</li>
    ))}
  </ul>
);
const KV = ({ rows }: { rows: [string, ReactNode][] }) => (
  <table className="my-1.5 w-full border-collapse">
    <tbody>
      {rows.map(([k, v]) => (
        <tr key={k}>
          <td className="w-[32%] border border-[#cfd8e3] bg-[#f5f8fb] px-2 py-1.5 font-bold">{k}</td>
          <td className="border border-[#cfd8e3] px-2 py-1.5">{v}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
const Sign = ({ a, b, aName }: { a: string; b: string; aName?: string }) => (
  <div className="mt-7 flex gap-8">
    {[
      [a, aName],
      [b, undefined],
    ].map(([t, n]) => (
      <div key={t} className="flex-1 border-t border-[#889] pt-1.5">
        <b>{t}</b>
        <div>الاسم: {n || BLANK}</div>
        <div>التوقيع: {BLANK}</div>
        <div>التاريخ: {BLANK}</div>
      </div>
    ))}
  </div>
);

const field = "w-full rounded-xl border border-line bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-neon/60 focus:outline-none";

export function DocsDashboard() {
  const [form, setForm] = useState<Form>(emptyForm);
  const [settings, setSettings] = useState<Settings>(emptySettings);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState({ number: "", date: "" });
  const pagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSettings(load("athar-admin-settings", emptySettings));
    try {
      setHistory(JSON.parse(localStorage.getItem("athar-admin-history") || "[]"));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("athar-admin-settings", JSON.stringify(settings));
  }, [settings]);

  const pkg = packages.find((p) => p.id === form.pkg) ?? packages[0];
  const extras = form.extras.filter((e) => e.name.trim());
  const subtotal = num(pkg.setup) + extras.reduce((s, e) => s + num(e.price), 0);
  const discount = Math.min(num(form.discount), subtotal);
  const total = subtotal - discount;
  const half = Math.round(total / 2);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setDocs([]);
  };
  const setS = <K extends keyof Settings>(k: K, v: string) => setSettings((s) => ({ ...s, [k]: v }));

  const maintenance = useMemo(
    () => [
      freeMaintenance.items[0] + ".",
      freeMaintenance.items[1] + ".",
      `عدد محدود من التحديثات الشهرية البسيطة (تعديل نصوص أو صور أو أسعار)، بحد أقصى ${settings.updatesCap || "____"} تحديثات شهرياً.`,
      freeMaintenance.note,
      freeMaintenance.after,
    ],
    [settings.updatesCap],
  );

  const clientName = form.client || BLANK;
  const days = form.days || "____";
  const bank = `طريقة الدفع: تحويل بنكي. اسم المستفيد: ${settings.beneficiary || BLANK} · الآيبان: `;

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
      const [{ toPng }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")]);
      await document.fonts.ready;
      const root = pagesRef.current!;
      const safe = form.client.trim().replace(/[\\/:*?"<>|]+/g, "-");
      const out: Doc[] = [];
      for (const [kind, label] of [
        ["quote", "عرض سعر"],
        ["contract", "عقد"],
      ] as const) {
        const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
        const pages = Array.from(root.querySelectorAll<HTMLElement>(`[data-page^="${kind}"]`));
        const styleProps = Array.from(getComputedStyle(pages[0])).filter((p) => !/^(min-|max-)?(height|block-size)$/.test(p));
        for (let i = 0; i < pages.length; i++) {
          const png = await toPng(pages[i], {
            pixelRatio: 2,
            backgroundColor: "#ffffff",
            cacheBust: true,
            width: 794,
            height: 1123,
            includeStyleProperties: styleProps,
          });
          if (i) pdf.addPage();
          pdf.addImage(png, "PNG", 0, 0, 595.28, 841.89, undefined, "FAST");
        }
        const blob = pdf.output("blob");
        out.push({ name: `${label} - ${safe}.pdf`, url: URL.createObjectURL(blob), blob });
      }
      setDocs(out);
      const item: HistoryItem = { number, date, client: form.client, activity: form.activity, pkg: pkg.name, total };
      const next = [item, ...history].slice(0, 30);
      setHistory(next);
      localStorage.setItem("athar-admin-history", JSON.stringify(next));
    } catch (e) {
      setError("تعذّر إنشاء الملفات: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setBusy(false);
    }
  }

  async function share(files: Doc[]) {
    const f = files.map((d) => new File([d.blob], d.name, { type: "application/pdf" }));
    if (navigator.canShare?.({ files: f })) {
      try {
        await navigator.share({ files: f, title: `${site.short} — ${form.client}` });
      } catch {}
    } else {
      files.forEach((d) => {
        const a = document.createElement("a");
        a.href = d.url;
        a.download = d.name;
        a.click();
      });
    }
  }

  const quoteNo = meta.number || "—";
  const quoteDate = meta.date || "—";

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
              </div>
            )}
          </div>

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
                <Page id="quote-1">
                  <h1 className="mb-2 text-[21px] font-extrabold text-[#0b1220]">عرض سعر</h1>
                  <KV
                    rows={[
                      ["رقم العرض", ltr(quoteNo)],
                      ["التاريخ", ltr(quoteDate)],
                      ["العميل", clientName],
                      ["النشاط", form.activity || BLANK],
                      ["الجوال", form.phone ? ltr(form.phone) : BLANK],
                      ["المدينة", form.city || BLANK],
                    ]}
                  />
                  <H>تفاصيل العرض</H>
                  <table className="my-1.5 w-full border-collapse">
                    <thead>
                      <tr className="bg-[#eaf8fd]">
                        <th className="border border-[#cfd8e3] px-2 py-1.5 text-right">البند</th>
                        <th className="border border-[#cfd8e3] px-2 py-1.5 text-right">يشمل</th>
                        <th className="w-[110px] border border-[#cfd8e3] px-2 py-1.5 text-right">السعر</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-[#cfd8e3] px-2 py-1.5 font-bold">{pkg.name}</td>
                        <td className="border border-[#cfd8e3] px-2 py-1.5">{pkg.features.join("، ")}</td>
                        <td className="border border-[#cfd8e3] px-2 py-1.5">{pkg.setup}</td>
                      </tr>
                      {extras.map((e, i) => (
                        <tr key={i}>
                          <td className="border border-[#cfd8e3] px-2 py-1.5 font-bold" colSpan={2}>{e.name}</td>
                          <td className="border border-[#cfd8e3] px-2 py-1.5">{money(num(e.price))}</td>
                        </tr>
                      ))}
                      {discount > 0 && (
                        <tr>
                          <td className="border border-[#cfd8e3] px-2 py-1.5" colSpan={2}>خصم</td>
                          <td className="border border-[#cfd8e3] px-2 py-1.5">- {money(discount)}</td>
                        </tr>
                      )}
                      <tr className="bg-[#eaf8fd] text-[14px]">
                        <td className="border border-[#cfd8e3] px-2 py-1.5 font-extrabold" colSpan={2}>الإجمالي (دفعة واحدة)</td>
                        <td className="border border-[#cfd8e3] px-2 py-1.5 font-extrabold">{money(total)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p>جميع الأسعار دفعة واحدة، وليس عليها اشتراك شهري إلزامي.</p>
                  <H>صيانة ودعم فني مجاني لمدة 3 أشهر</H>
                  <UL items={maintenance} />
                  <H>الدفع والتسليم</H>
                  <UL
                    items={[
                      `الدفعة الأولى 50% (${money(half)}) عند الموافقة لبدء العمل، والـ 50% المتبقية (${money(total - half)}) عند التسليم وقبل نقل الموقع على الدومين النهائي.`,
                      <>{bank}{ltr(settings.iban || "SA" + BLANK)}</>,
                      `مدة التنفيذ المتوقعة: ${days} أيام عمل، تبدأ بعد استلام الدفعة الأولى وكامل المحتوى (الشعار، الصور، النصوص، الأسعار).`,
                      "رسوم الخدمات الخارجية (مثل رسائل واتساب من Meta أو مفاتيح الذكاء الاصطناعي) غير مشمولة إلا إذا ذُكرت في هذا العرض.",
                      "هذا العرض صالح لمدة 7 أيام من تاريخه.",
                    ]}
                  />
                  <Sign a={`عن ${site.name}`} aName={settings.repName} b={`موافقة العميل: ${clientName}`} />
                </Page>

                <Page id="contract-1">
                  <h1 className="mb-2 text-[20px] font-extrabold text-[#0b1220]">اتفاقية تقديم خدمات تصميم موقع إلكتروني</h1>
                  <p>أُبرمت هذه الاتفاقية بتاريخ {ltr(quoteDate)} بين كلٍّ من:</p>
                  <KV
                    rows={[
                      ["الطرف الأول (مقدّم الخدمة)", `${site.name}، ويمثلها: ${settings.repName || BLANK}، رقم الهوية: ${settings.repId || BLANK}`],
                      ["الطرف الثاني (العميل)", <>{clientName} — {form.activity || BLANK}، رقم الهوية / السجل التجاري: {form.clientId || BLANK}، الجوال: {form.phone ? ltr(form.phone) : BLANK}</>],
                    ]}
                  />
                  <H>1. نطاق العمل</H>
                  <p>
                    يلتزم الطرف الأول بتنفيذ «{pkg.name}» وتشمل: {pkg.features.join("، ")}
                    {extras.length ? `، إضافة إلى: ${extras.map((e) => e.name).join("، ")}` : ""}، وفق عرض السعر رقم {ltr(quoteNo)} الذي يُعدّ جزءاً لا يتجزأ من هذه الاتفاقية. أي عمل خارج هذا النطاق يُتفق عليه كتابياً بسعر مستقل.
                  </p>
                  <H>2. السعر وطريقة الدفع</H>
                  <UL
                    items={[
                      `قيمة الخدمة الإجمالية: ${money(total)}، دفعة واحدة دون اشتراك شهري إلزامي.`,
                      `تُدفع ${money(half)} (50%) عند توقيع الاتفاقية، و${money(total - half)} (50%) عند التسليم وقبل نقل الموقع على الدومين النهائي.`,
                      <>{bank}{ltr(settings.iban || "SA" + BLANK)}</>,
                      "رسوم الخدمات الخارجية (رسائل Meta/واتساب، مفاتيح الذكاء الاصطناعي، الإعلانات المدفوعة) يتحملها الطرف الثاني ما لم يُنص على غير ذلك.",
                    ]}
                  />
                  <H>3. مدة التنفيذ والتزامات العميل</H>
                  <UL
                    items={[
                      `مدة التنفيذ: ${days} أيام عمل، تبدأ من استلام الدفعة الأولى وكامل المحتوى المطلوب.`,
                      "يلتزم الطرف الثاني بتسليم المحتوى (الشعار، الصور، النصوص، الأسعار، بيانات التواصل) خلال 5 أيام، ويتمدد موعد التسليم بقدر أي تأخير منه.",
                      "يحق للطرف الثاني جولتا تعديل على التصميم قبل التسليم النهائي.",
                      "يُعدّ الموقع مُسلَّماً عند نشره وإبلاغ العميل، أو بعد 5 أيام من إرسال رابط المعاينة دون ملاحظات.",
                    ]}
                  />
                  <H>4. الصيانة المجانية (3 أشهر من تاريخ التسليم)</H>
                  <UL items={maintenance} />
                </Page>

                <Page id="contract-2">
                  <H>5. الملكية والحسابات</H>
                  <UL
                    items={[
                      "تنتقل ملكية الموقع ومحتواه للطرف الثاني بعد سداد كامل المبلغ.",
                      "يُسجَّل الدومين والملف التجاري في Google باسم الطرف الثاني أو يُسلَّم له، وتُسلَّم له بيانات الدخول عند انتهاء الصيانة أو عند طلبه.",
                      "يحق للطرف الأول عرض الموقع ضمن نماذج أعماله ما لم يعترض الطرف الثاني كتابياً.",
                    ]}
                  />
                  <H>6. السرية وحماية البيانات</H>
                  <p>يلتزم الطرفان بسرية المعلومات المتبادلة، ويلتزم الطرف الأول بالتعامل مع بيانات العملاء وفق نظام حماية البيانات الشخصية في المملكة العربية السعودية.</p>
                  <H>7. الإلغاء</H>
                  <UL items={["يحق للطرف الثاني إلغاء الاتفاقية قبل بدء التنفيذ واسترداد الدفعة الأولى كاملة.", "بعد بدء التنفيذ تُخصم قيمة ما تم إنجازه من الدفعة الأولى، ويُسترد الباقي إن وُجد."]} />
                  <H>8. حدود المسؤولية</H>
                  <p>لا يتحمل الطرف الأول مسؤولية الأعطال الناتجة عن مزودي الخدمات الخارجية (الاستضافة، Meta، Google، OpenAI) أو عن تعديلات يجريها الطرف الثاني أو غيره على الموقع، ولا تتجاوز مسؤوليته في جميع الأحوال قيمة هذه الاتفاقية.</p>
                  <H>9. أحكام عامة</H>
                  <p>تخضع هذه الاتفاقية لأنظمة المملكة العربية السعودية، ويُسعى لحل أي خلاف ودياً أولاً. حُررت من نسختين بيد كل طرف نسخة.</p>
                  <Sign a={`الطرف الأول: ${site.name}`} aName={settings.repName} b={`الطرف الثاني: ${clientName}`} />
                </Page>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
