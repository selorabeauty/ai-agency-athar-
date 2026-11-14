"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { whatsappLink } from "@/lib/site";
import { categories, COFFEE, hourly, initialMenu, initialTables, TAGLINE, type MenuItem, type TableQr } from "./data";

type Tab = "overview" | "menu" | "qr";

const icons: Record<Tab, string> = {
  overview: "M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z",
  menu: "M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Zm2-5h3M9 3v2M13 3v2",
  qr: "M3 3h6v6H3V3Zm2 2v2h2V5H5Zm10-2h6v6h-6V3Zm2 2v2h2V5h-2ZM3 15h6v6H3v-6Zm2 2v2h2v-2H5Zm8-2h2v2h-2v-2Zm4 0h4v4h-4v-4Zm-4 4h2v2h-2v-2Z",
};

const tabs: { id: Tab; label: string; short: string }[] = [
  { id: "overview", label: "لوحة التحكم والإحصائيات", short: "الرئيسية" },
  { id: "menu", label: "إدارة المنيو والأسعار", short: "المنيو" },
  { id: "qr", label: "باركود الطلب QR", short: "الباركود" },
];

const sar = (n: number) => `${n.toLocaleString("en-US")} ر.س`;
const card = "rounded-3xl border border-white/[0.07] bg-[#1d1410]/90 p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] sm:p-6";
const btn = "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition active:scale-[0.97]";
const primary = `${btn} bg-gradient-to-l from-amber-600 to-amber-400 text-[#1a0f08] shadow-lg shadow-amber-600/20 hover:brightness-110`;
const ghost = `${btn} border border-white/10 text-amber-100/90 hover:border-amber-400/50 hover:text-amber-300`;

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function Title({ children, sub, end }: { children: React.ReactNode; sub?: string; end?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-bold text-white sm:text-lg">{children}</h3>
        {sub && <p className="text-xs text-amber-100/50">{sub}</p>}
      </div>
      {end}
    </div>
  );
}

function Stat({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`${card} ${accent ? "border-amber-400/30 bg-gradient-to-br from-amber-600/15 to-[#1d1410]/90" : ""}`}>
      <p className="text-xs text-amber-100/50">{label}</p>
      <motion.b key={value} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 block text-2xl font-bold text-white sm:text-3xl">{value}</motion.b>
      <p className="mt-1 text-xs font-bold text-amber-300">{sub}</p>
    </div>
  );
}

function Bars({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values);
  const top = values.indexOf(max);
  return (
    <div className="flex h-44 items-end gap-1 sm:gap-2">
      {values.map((v, i) => (
        <div key={labels[i]} className="group flex h-full flex-1 flex-col items-center gap-1.5">
          <span className="text-[9px] font-bold text-amber-300 opacity-0 transition group-hover:opacity-100">{v.toLocaleString("en-US")}</span>
          <div className="relative w-full flex-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(v / max) * 100}%` }}
              transition={{ duration: 0.7, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute inset-x-0 bottom-0 rounded-t-md ${i === top ? "bg-gradient-to-t from-amber-700 to-amber-400" : "bg-white/10 group-hover:bg-white/20"}`}
            />
          </div>
          <span className="text-[9px] text-amber-100/40 sm:text-[10px]">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onChange} className={`relative h-7 w-12 shrink-0 rounded-full transition ${on ? "bg-emerald-500" : "bg-white/15"}`}>
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "start-6" : "start-1"}`} />
    </button>
  );
}

function Pulse() {
  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
    </span>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-300 text-xl font-bold text-[#1a0f08] shadow-lg shadow-amber-600/25">W</span>
      <div>
        <p className="text-lg font-bold leading-tight text-white">{COFFEE}</p>
        <p className="text-[11px] text-amber-300/90">{TAGLINE}</p>
      </div>
    </div>
  );
}

export function WingDemo() {
  const [tab, setTab] = useState<Tab>("overview");
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
  const [tables, setTables] = useState<TableQr[]>(initialTables);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const main = useRef<HTMLDivElement>(null);

  const notify = useCallback((text: string) => {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3800);
  }, []);

  const go = (t: Tab) => {
    setTab(t);
    main.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const current = tabs.find((t) => t.id === tab)!;

  return (
    <div className="font-tajawal min-h-screen bg-[#140d08] text-amber-50/90" style={{ colorScheme: "dark" }}>
      <div className="bg-gradient-to-l from-amber-600 via-amber-500 to-amber-400 px-4 py-2 text-center text-[11px] font-bold text-[#1a0f08] sm:text-xs">
        عرض تجريبي حي مقدّم من آثر ديجيتال — جميع الأسماء والأرقام توضيحية
      </div>

      <div className="mx-auto flex max-w-[1500px]">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-e border-white/[0.06] bg-[#120b07] p-5 lg:flex">
          <Brand />
          <nav className="mt-8 space-y-1.5">
            {tabs.map((t) => (
              <button key={t.id} type="button" onClick={() => go(t.id)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${tab === t.id ? "bg-gradient-to-l from-amber-600 to-amber-400 text-[#1a0f08] shadow-lg shadow-amber-600/20" : "text-amber-50/80 hover:bg-white/5"}`}>
                <Icon d={icons[t.id]} />
                <span className="flex-1 text-start">{t.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 text-xs">
            <p className="flex items-center gap-2 font-bold text-white"><Pulse /> المنيو مربوط بباركود الطلب</p>
            <p className="mt-1.5 text-amber-100/50">أي تعديل يظهر فوراً عند مسح العميل للباركود.</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#140d08]/85 backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <div className="lg:hidden"><Brand /></div>
              <div className="hidden lg:block">
                <h1 className="text-xl font-bold text-white">{current.label}</h1>
                <p className="text-xs text-amber-100/50">{TAGLINE}</p>
              </div>
              <span className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-300 md:flex">
                <Pulse /> نظام المنيو والباركود يعمل بكفاءة
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 pb-2 text-[11px] font-bold text-emerald-300 md:hidden">
              <Pulse /> نظام المنيو والباركود يعمل بكفاءة
            </div>
            <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden" aria-label="الأقسام">
              {tabs.map((t) => (
                <button key={t.id} type="button" onClick={() => go(t.id)} className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ${tab === t.id ? "bg-gradient-to-l from-amber-600 to-amber-400 text-[#1a0f08]" : "bg-white/5 text-amber-50/80"}`}>
                  <Icon d={icons[t.id]} className="h-4 w-4" />
                  {t.short}
                </button>
              ))}
            </nav>
          </header>

          <div ref={main} className="scroll-mt-40 px-4 py-6 sm:px-6 lg:py-8">
            <h1 className="mb-5 text-xl font-bold text-white lg:hidden">{current.label}</h1>
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                {tab === "overview" && <Overview menu={menu} tables={tables} go={go} />}
                {tab === "menu" && <Menu menu={menu} setMenu={setMenu} notify={notify} />}
                {tab === "qr" && <Qr tables={tables} setTables={setTables} notify={notify} />}
              </motion.div>
            </AnimatePresence>
            <Cta />
            <p className="mt-8 text-center text-[11px] text-amber-100/40">صُممت هذه المنصة التجريبية لـ {COFFEE} بواسطة آثر ديجيتال • الأرقام للعرض فقط</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="fixed inset-x-4 bottom-5 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-amber-400/30 bg-[#1d1410] p-4 text-sm text-white shadow-2xl shadow-black/50">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-400 text-[#1a0f08]">
              <Icon d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0" className="h-4 w-4" />
            </span>
            <span className="flex-1">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Overview({ menu, tables, go }: { menu: MenuItem[]; tables: TableQr[]; go: (t: Tab) => void }) {
  const top = [...menu].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const soldOut = menu.filter((m) => !m.available);
  const scans = tables.reduce((s, t) => s + t.scans, 0);
  const orders = tables.reduce((s, t) => s + t.orders, 0);
  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-l from-[#1d1410] via-[#241812] to-[#3a2413] p-6 sm:p-8">
        <div aria-hidden className="absolute -start-10 -top-20 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl" />
        <p className="relative text-sm text-amber-300">مساء الخير، إدارة {COFFEE} ☕</p>
        <h2 className="relative mt-2 max-w-2xl text-2xl font-bold leading-snug text-white sm:text-3xl">
          {soldOut.length ? `عندك ${soldOut.length} أصناف نافدة اليوم — حدّث المنيو بضغطة وينعكس على باركود الطلب فوراً.` : "كل أصناف المنيو متوفرة اليوم، وباركود الطلب يستقبل مسح العملاء الآن."}
        </h2>
        <div className="relative mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => go("menu")} className={primary}>تحديث المنيو والأسعار</button>
          <button type="button" onClick={() => go("qr")} className={ghost}>باركود الطلب</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="أصناف المنيو" value={String(menu.length)} sub={`${menu.length - soldOut.length} متوفرة الآن`} />
        <Stat label="مسحات الباركود اليوم" value={scans.toLocaleString("en-US")} sub="عميل فتح المنيو من الباركود" accent />
        <Stat label="طلبات عبر الباركود" value={String(orders)} sub={`معدل التحويل ${Math.round((orders / scans) * 100)}%`} />
        <Stat label="تقييم الكوفي" value="4.8 ★" sub="على خرائط جوجل" />
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        <div className={`${card} xl:col-span-3`}>
          <Title sub="عدد مسحات الباركود في كل ساعة اليوم">ذروة استخدام الباركود</Title>
          <Bars values={hourly.values} labels={hourly.labels} />
          <p className="mt-3 rounded-2xl bg-amber-400/10 p-3 text-xs text-amber-200">💡 الذروة الساعة 8 مساءً — فعّل عرض «مشروب + حلى» في المنيو قبلها بساعة.</p>
        </div>
        <div className={`${card} xl:col-span-2`}>
          <Title sub={soldOut.length ? `${soldOut.length} أصناف نافدة حالياً` : "كل الأصناف متوفرة"} end={<button type="button" onClick={() => go("menu")} className="text-xs font-bold text-amber-300">المنيو ←</button>}>الأكثر طلباً اليوم</Title>
          <ol className="space-y-2.5">
            {top.map((m, i) => (
              <li key={m.id} className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-[11px] font-bold text-amber-300">{i + 1}</span>
                <span className="flex-1">{m.name}</span>
                <b className="text-white">{m.sold}</b>
              </li>
            ))}
          </ol>
          {soldOut.length > 0 && (
            <p className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-200">
              ⚠️ نافد حالياً: {soldOut.map((m) => m.name).join("، ")} — ما يظهر للعميل عند مسح الباركود.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Menu({ menu, setMenu, notify }: { menu: MenuItem[]; setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>; notify: (t: string) => void }) {
  const [cat, setCat] = useState("الكل");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCat, setNewCat] = useState(categories[0]);
  const shown = menu.filter((m) => (cat === "الكل" || m.cat === cat) && m.name.includes(q.trim()));
  const available = menu.filter((m) => m.available).length;

  const toggle = (m: MenuItem) => {
    setMenu((ms) => ms.map((x) => (x.id === m.id ? { ...x, available: !x.available } : x)));
    notify(m.available ? `«${m.name}» صار غير متوفر — اختفى من منيو الباركود فوراً` : `«${m.name}» رجع متوفر ✅ — ظهر في منيو الباركود`);
  };
  const save = (m: MenuItem) => {
    const p = Number(draft);
    if (!Number.isFinite(p) || p <= 0) return;
    setMenu((ms) => ms.map((x) => (x.id === m.id ? { ...x, price: Math.round(p) } : x)));
    setEditing(null);
    notify(`تم تحديث سعر «${m.name}» إلى ${sar(Math.round(p))} — في كل باركودات الطلب`);
  };
  const remove = (m: MenuItem) => {
    setMenu((ms) => ms.filter((x) => x.id !== m.id));
    notify(`حُذف «${m.name}» من المنيو — اختفى من باركود الطلب`);
  };
  const addItem = () => {
    const p = Number(newPrice);
    if (!newName.trim() || !Number.isFinite(p) || p <= 0) return;
    setMenu((ms) => [{ id: `w${Date.now()}`, name: newName.trim(), cat: newCat, price: Math.round(p), available: true, sold: 0 }, ...ms]);
    setAdding(false); setNewName(""); setNewPrice("");
    notify(`✅ أُضيف «${newName.trim()}» للمنيو — ظهر مباشرة في باركود الطلب`);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="أصناف المنيو" value={String(menu.length)} sub={`في ${categories.length} أقسام`} />
        <Stat label="متوفر" value={String(available)} sub="يظهر للعملاء" />
        <Stat label="نفد" value={String(menu.length - available)} sub="مخفي عن الباركود" accent />
      </div>

      <div className={card}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن صنف..." className="w-full rounded-full border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-amber-100/40 focus:border-amber-400/60 focus:outline-none sm:max-w-xs" />
          <div className="flex gap-2 overflow-x-auto">
            {["الكل", ...categories].map((c) => (
              <button key={c} type="button" onClick={() => setCat(c)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold ${cat === c ? "bg-amber-400 text-[#1a0f08]" : "bg-white/5 text-amber-50/80"}`}>{c}</button>
            ))}
          </div>
          <button type="button" onClick={() => setAdding((a) => !a)} className={`${primary} sm:ms-auto`}>+ صنف جديد</button>
        </div>

        <AnimatePresence>
          {adding && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-3">
                <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="اسم الصنف (مثال: أيس سبانيش لاتيه)" className="min-w-52 flex-1 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white placeholder:text-amber-100/40 focus:border-amber-400/60 focus:outline-none" />
                <input value={newPrice} onChange={(e) => setNewPrice(e.target.value)} type="number" inputMode="numeric" placeholder="السعر" className="w-24 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-center text-sm text-white placeholder:text-amber-100/40 focus:border-amber-400/60 focus:outline-none" />
                <select value={newCat} onChange={(e) => setNewCat(e.target.value)} className="rounded-full border border-white/10 bg-[#241812] px-4 py-2 text-sm text-white focus:border-amber-400/60 focus:outline-none">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <button type="button" onClick={addItem} className={primary}>إضافة للمنيو</button>
                <button type="button" onClick={() => setAdding(false)} className="text-xs text-amber-100/50">إلغاء</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ul className="divide-y divide-white/5">
          {shown.map((m) => (
            <li key={m.id} className={`flex flex-wrap items-center gap-3 py-3.5 ${m.available ? "" : "opacity-60"}`}>
              <div className="w-full min-w-0 sm:w-auto sm:flex-1">
                <p className="font-bold text-white">{m.name}</p>
                <p className="flex flex-wrap items-center gap-2 text-[11px] text-amber-100/40">
                  {m.cat} • {m.sold} طلب اليوم
                  {m.hot && <span className="whitespace-nowrap rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">🔥 الأكثر طلباً</span>}
                </p>
              </div>
              {editing === m.id ? (
                <div className="flex items-center gap-2">
                  <input autoFocus type="number" inputMode="numeric" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save(m)} className="w-20 rounded-full border border-amber-400/50 bg-black/30 px-3 py-1.5 text-center text-sm text-white focus:outline-none" aria-label="السعر الجديد" />
                  <button type="button" onClick={() => save(m)} className={primary}>حفظ</button>
                  <button type="button" onClick={() => setEditing(null)} className="text-xs text-amber-100/50">إلغاء</button>
                </div>
              ) : (
                <button type="button" onClick={() => { setEditing(m.id); setDraft(String(m.price)); }} className="rounded-full border border-white/10 px-3 py-1.5 text-sm font-bold text-amber-300 hover:border-amber-400/50" title="تعديل السعر">
                  {sar(m.price)} <span className="text-[10px] text-amber-100/40">✎</span>
                </button>
              )}
              <div className="ms-auto flex items-center gap-2 sm:ms-0">
                <button type="button" onClick={() => remove(m)} className="rounded-full p-1.5 text-amber-100/40 transition hover:text-rose-300" title="حذف الصنف" aria-label={`حذف ${m.name}`}>
                  <Icon d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14" className="h-4 w-4" />
                </button>
                <span className={`w-14 text-end text-[11px] font-bold ${m.available ? "text-emerald-300" : "text-rose-300"}`}>{m.available ? "متوفر" : "نفد"}</span>
                <Toggle on={m.available} onChange={() => toggle(m)} label={`توفر ${m.name}`} />
              </div>
            </li>
          ))}
          {shown.length === 0 && <li className="py-8 text-center text-sm text-amber-100/40">لا توجد نتائج</li>}
        </ul>
      </div>
      <p className="text-center text-xs text-amber-100/40">أي إضافة أو تعديل سعر أو نفاد يتحدّث لحظياً في المنيو اللي يشوفه العميل من الباركود.</p>
    </div>
  );
}

function Qr({ tables, setTables, notify }: { tables: TableQr[]; setTables: React.Dispatch<React.SetStateAction<TableQr[]>>; notify: (t: string) => void }) {
  const [imgs, setImgs] = useState<Record<string, string>>({});
  const [newZone, setNewZone] = useState("داخل المحل");
  const zones = [...new Set(tables.map((t) => t.zone))];
  const active = tables.filter((t) => t.active).length;
  const scans = tables.reduce((s, t) => s + t.scans, 0);

  useEffect(() => {
    let alive = true;
    Promise.all(
      tables.map(async (t) => {
        const url = `https://wing-coffee.sa/menu?table=${t.id}`;
        const dataUrl = await QRCode.toDataURL(url, { width: 320, margin: 1, color: { dark: "#1a0f08", light: "#fffdf7" } });
        return [t.id, dataUrl] as const;
      }),
    ).then((entries) => { if (alive) setImgs(Object.fromEntries(entries)); });
    return () => { alive = false; };
  }, [tables]);

  const toggle = (t: TableQr) => {
    setTables((ts) => ts.map((x) => (x.id === t.id ? { ...x, active: !x.active } : x)));
    notify(t.active ? `باركود «${t.table}» توقّف — العميل بيحصل رسالة «الباركود غير مفعّل»` : `باركود «${t.table}» تفعّل ✅ — العميل يقدر يمسح ويطلب`);
  };
  const addTable = () => {
    const n = tables.length + 1;
    setTables((ts) => [...ts, { id: `t${Date.now()}`, table: `نقطة ${n}`, zone: newZone, scans: 0, orders: 0, active: true }]);
    notify(`✅ أُنشئ باركود جديد «${n}» في «${newZone}» — اطبعه والصقه في مكانه`);
  };
  const download = (t: TableQr) => {
    const img = imgs[t.id];
    if (!img) return;
    const a = document.createElement("a");
    a.href = img;
    a.download = `qr-${t.table}.png`;
    a.click();
    notify(`نزّلت باركود «${t.table}» PNG — جاهز للطباعة واللصق في مكانه`);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="باركودات الطلب" value={String(tables.length)} sub={`${zones.length} نقاط مسح`} />
        <Stat label="مفعّلة الآن" value={String(active)} sub="تستقبل مسح العملاء" accent />
        <Stat label="مسحات اليوم" value={scans.toLocaleString("en-US")} sub={`${tables.reduce((s, t) => s + t.orders, 0)} طلب عبر الباركود`} />
      </div>

      <div className={card}>
        <Title sub="كل نقطة لها باركود خاص — تعرف وين يمسح عملاؤك: المحل، الواجهة، الفلاير، أو السوشال">إضافة باركود جديد</Title>
        <div className="flex flex-wrap items-center gap-2">
          <select value={newZone} onChange={(e) => setNewZone(e.target.value)} className="rounded-full border border-white/10 bg-[#241812] px-4 py-2 text-sm text-white focus:border-amber-400/60 focus:outline-none">
            {zones.map((z) => <option key={z} value={z}>{z}</option>)}
            <option value="نقطة جديدة">+ نقطة جديدة</option>
          </select>
          <button type="button" onClick={addTable} className={primary}>+ إنشاء باركود</button>
          <button type="button" onClick={() => notify("في النسخة الفعلية: تضغط «طباعة الكل» ويطلع لك ملف PDF فيه كل باركود مع اسمه — تطبعه وتلصقه في مكانه")} className={ghost}>🖨️ طباعة كل الباركودات</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tables.map((t) => (
          <div key={t.id} className={`${card} ${t.active ? "" : "opacity-60"}`}>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">{t.table}</p>
                <p className="text-[11px] text-amber-100/40">{t.zone}</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${t.active ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"}`}>{t.active ? "مفعّل" : "موقّف"}</span>
            </div>
            <div className="overflow-hidden rounded-2xl bg-[#fffdf7] p-3">
              {imgs[t.id] ? <Image src={imgs[t.id]} alt={`باركود ${t.table}`} width={160} height={160} unoptimized className="mx-auto w-full max-w-40" /> : <div className="mx-auto h-40 w-40 animate-pulse rounded-xl bg-amber-100" />}
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-amber-100/50">
              <span>{t.scans} مسح</span><span>{t.orders} طلب</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button type="button" onClick={() => download(t)} className={`${ghost} flex-1`}>⬇ تحميل PNG</button>
              <Toggle on={t.active} onChange={() => toggle(t)} label={`تفعيل باركود ${t.table}`} />
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-amber-100/40">الباركود يفتح منيو محدّث لحظياً — لو عدّلت سعر أو نفد صنف، العميل يشوف التحديث مباشرة بدون ما تطبع شي جديد.</p>
    </div>
  );
}

function Cta() {
  return (
    <div className="mt-10 overflow-hidden rounded-3xl border border-amber-400/25 bg-gradient-to-l from-amber-700/30 via-[#241812] to-[#1d1410] p-6 text-center sm:p-8">
      <h3 className="text-xl font-bold text-white sm:text-2xl">خلّ عملاء {COFFEE} يطلبون من جوالهم بدون انتظار ☕</h3>
      <p className="mx-auto mt-2 max-w-2xl text-sm text-amber-100/60">
        هذا عرض تجريبي ببيانات وهمية. لو عجبك، نطلق نفس اللوحة باسم كوفيك ومنيوك وباركود طلباتك خلال أيام — مع صيانة ودعم فني مستمر.
      </p>
      <a href={whatsappLink("أهلاً، شفت العرض التجريبي للوحة تحكم الكوفي وأبي أفعّلها لمحلي")} target="_blank" rel="noreferrer" className={`${primary} mt-5`}>
        أبغى اللوحة لمحلي — كلمني واتساب
      </a>
    </div>
  );
}
