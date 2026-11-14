"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { whatsappLink } from "@/lib/site";
import { categories, hourly, initialOffers, initialServices, SALON, TAGLINE, type Offer, type Service } from "./data";

type Tab = "overview" | "services" | "offers";

const icons: Record<Tab, string> = {
  overview: "M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z",
  services: "M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2ZM5 3l.8 2.2L8 6l-2.2.8L5 9l-.8-2.2L2 6l2.2-.8L5 3Zm14 14 .8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8.8-2.2Z",
  offers: "M12.6 2.6 21 11a2 2 0 0 1 0 2.8l-7.2 7.2a2 2 0 0 1-2.8 0l-8.4-8.4A2 2 0 0 1 2 11.2V4a2 2 0 0 1 2-2h7.2a2 2 0 0 1 1.4.6ZM7 7h.01",
};

const tabs: { id: Tab; label: string; short: string }[] = [
  { id: "overview", label: "لوحة التحكم والإحصائيات", short: "الرئيسية" },
  { id: "services", label: "الخدمات والأسعار", short: "الأسعار" },
  { id: "offers", label: "عروض المواسم", short: "العروض" },
];

const sar = (n: number) => `${n.toLocaleString("en-US")} ر.س`;
const card = "rounded-3xl border border-white/[0.07] bg-[#241019]/90 p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] sm:p-6";
const btn = "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition active:scale-[0.97]";
const primary = `${btn} bg-gradient-to-l from-rose-500 to-pink-400 text-white shadow-lg shadow-rose-500/25 hover:brightness-110`;
const ghost = `${btn} border border-white/10 text-rose-100/90 hover:border-rose-400/50 hover:text-rose-300`;

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
        {sub && <p className="text-xs text-rose-100/50">{sub}</p>}
      </div>
      {end}
    </div>
  );
}

function Stat({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`${card} ${accent ? "border-rose-400/30 bg-gradient-to-br from-rose-500/15 to-[#241019]/90" : ""}`}>
      <p className="text-xs text-rose-100/50">{label}</p>
      <motion.b key={value} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 block text-2xl font-bold text-white sm:text-3xl">{value}</motion.b>
      <p className="mt-1 text-xs font-bold text-rose-300">{sub}</p>
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
          <span className="text-[9px] font-bold text-rose-300 opacity-0 transition group-hover:opacity-100">{v.toLocaleString("en-US")}</span>
          <div className="relative w-full flex-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(v / max) * 100}%` }}
              transition={{ duration: 0.7, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute inset-x-0 bottom-0 rounded-t-md ${i === top ? "bg-gradient-to-t from-rose-600 to-pink-400" : "bg-white/10 group-hover:bg-white/20"}`}
            />
          </div>
          <span className="text-[9px] text-rose-100/40 sm:text-[10px]">{labels[i]}</span>
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
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-400 text-xl font-bold text-white shadow-lg shadow-rose-500/25">س</span>
      <div>
        <p className="text-lg font-bold leading-tight text-white">{SALON}</p>
        <p className="text-[11px] text-rose-300/90">{TAGLINE}</p>
      </div>
    </div>
  );
}

export function SalonDemo() {
  const [tab, setTab] = useState<Tab>("overview");
  const [services, setServices] = useState<Service[]>(initialServices);
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
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
    <div className="font-tajawal min-h-screen bg-[#180b12] text-rose-50/90" style={{ colorScheme: "dark" }}>
      <div className="bg-gradient-to-l from-rose-600 via-rose-500 to-pink-400 px-4 py-2 text-center text-[11px] font-bold text-white sm:text-xs">
        عرض تجريبي حي مقدّم من آثر ديجيتال — جميع الأسماء والأرقام توضيحية
      </div>

      <div className="mx-auto flex max-w-[1500px]">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-e border-white/[0.06] bg-[#130a0f] p-5 lg:flex">
          <Brand />
          <nav className="mt-8 space-y-1.5">
            {tabs.map((t) => (
              <button key={t.id} type="button" onClick={() => go(t.id)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${tab === t.id ? "bg-gradient-to-l from-rose-500 to-pink-400 text-white shadow-lg shadow-rose-500/25" : "text-rose-50/80 hover:bg-white/5"}`}>
                <Icon d={icons[t.id]} />
                <span className="flex-1 text-start">{t.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 text-xs">
            <p className="flex items-center gap-2 font-bold text-white"><Pulse /> الأسعار والعروض مربوطة بالموقع</p>
            <p className="mt-1.5 text-rose-100/50">أي تعديل يظهر فوراً لعملائك على الموقع والحجوزات.</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#180b12]/85 backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <div className="lg:hidden"><Brand /></div>
              <div className="hidden lg:block">
                <h1 className="text-xl font-bold text-white">{current.label}</h1>
                <p className="text-xs text-rose-100/50">{TAGLINE}</p>
              </div>
              <span className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-300 md:flex">
                <Pulse /> نظام الأسعار والعروض يعمل بكفاءة
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 pb-2 text-[11px] font-bold text-emerald-300 md:hidden">
              <Pulse /> نظام الأسعار والعروض يعمل بكفاءة
            </div>
            <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden" aria-label="الأقسام">
              {tabs.map((t) => (
                <button key={t.id} type="button" onClick={() => go(t.id)} className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ${tab === t.id ? "bg-gradient-to-l from-rose-500 to-pink-400 text-white" : "bg-white/5 text-rose-50/80"}`}>
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
                {tab === "overview" && <Overview services={services} offers={offers} go={go} />}
                {tab === "services" && <Services services={services} setServices={setServices} notify={notify} />}
                {tab === "offers" && <Offers offers={offers} setOffers={setOffers} notify={notify} />}
              </motion.div>
            </AnimatePresence>
            <Cta />
            <p className="mt-8 text-center text-[11px] text-rose-100/40">صُممت هذه المنصة التجريبية لـ {SALON} بواسطة آثر ديجيتال • الأرقام للعرض فقط</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="fixed inset-x-4 bottom-5 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-rose-400/30 bg-[#241019] p-4 text-sm text-white shadow-2xl shadow-black/50">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-400 text-white">
              <Icon d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0" className="h-4 w-4" />
            </span>
            <span className="flex-1">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Overview({ services, offers, go }: { services: Service[]; offers: Offer[]; go: (t: Tab) => void }) {
  const top = [...services].sort((a, b) => b.booked - a.booked).slice(0, 5);
  const activeOffers = offers.filter((o) => o.active);
  const paused = services.filter((s) => !s.available);
  const bookings = services.reduce((s, x) => s + x.booked, 0);
  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl border border-rose-400/20 bg-gradient-to-l from-[#241019] via-[#2e1420] to-[#4a1a30] p-6 sm:p-8">
        <div aria-hidden className="absolute -start-10 -top-20 h-64 w-64 rounded-full bg-rose-500/15 blur-3xl" />
        <p className="relative text-sm text-rose-300">مساء الخير، إدارة {SALON} ✨</p>
        <h2 className="relative mt-2 max-w-2xl text-2xl font-bold leading-snug text-white sm:text-3xl">
          عندك {activeOffers.length} عروض شغّالة الآن — وأسعارك وخدماتك تتعدّل بضغطة وتنعكس على الموقع فوراً.
        </h2>
        <div className="relative mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => go("services")} className={primary}>تعديل الأسعار</button>
          <button type="button" onClick={() => go("offers")} className={ghost}>عروض المواسم</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="خدمات الصالون" value={String(services.length)} sub={`${services.length - paused.length} متاحة للحجز`} />
        <Stat label="عروض نشطة" value={String(activeOffers.length)} sub={`${offers.length - activeOffers.length} مجدولة أو منتهية`} accent />
        <Stat label="حجوزات هذا الأسبوع" value={String(bookings)} sub="▲ 19% عن الأسبوع الماضي" />
        <Stat label="تقييم الصالون" value="4.9 ★" sub="على خرائط جوجل" />
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        <div className={`${card} xl:col-span-3`}>
          <Title sub="حجوزات كل ساعة اليوم">ذروة الحجوزات</Title>
          <Bars values={hourly.values} labels={hourly.labels} />
          <p className="mt-3 rounded-2xl bg-rose-400/10 p-3 text-xs text-rose-200">💡 الذروة الساعة 8 مساءً — فعّلي «خميس الجمال» لتوزيع الضغط على باقي الأسبوع.</p>
        </div>
        <div className={`${card} xl:col-span-2`}>
          <Title sub={paused.length ? `${paused.length} خدمات موقّفة مؤقتاً` : "كل الخدمات متاحة"} end={<button type="button" onClick={() => go("services")} className="text-xs font-bold text-rose-300">الأسعار ←</button>}>الأكثر حجزاً هذا الأسبوع</Title>
          <ol className="space-y-2.5">
            {top.map((m, i) => (
              <li key={m.id} className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-[11px] font-bold text-rose-300">{i + 1}</span>
                <span className="flex-1">{m.name}</span>
                <b className="text-white">{m.booked}</b>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Services({ services, setServices, notify }: { services: Service[]; setServices: React.Dispatch<React.SetStateAction<Service[]>>; notify: (t: string) => void }) {
  const [cat, setCat] = useState("الكل");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCat, setNewCat] = useState(categories[0]);
  const [adding, setAdding] = useState(false);
  const shown = services.filter((m) => (cat === "الكل" || m.cat === cat) && m.name.includes(q.trim()));
  const available = services.filter((m) => m.available).length;

  const toggle = (m: Service) => {
    setServices((ms) => ms.map((x) => (x.id === m.id ? { ...x, available: !x.available } : x)));
    notify(m.available ? `«${m.name}» توقّفت — اختفت من صفحة الحجوزات فوراً` : `«${m.name}» رجعت متاحة ✅ — ظهرت في صفحة الحجوزات`);
  };
  const save = (m: Service) => {
    const p = Number(draft);
    if (!Number.isFinite(p) || p <= 0) return;
    setServices((ms) => ms.map((x) => (x.id === m.id ? { ...x, price: Math.round(p) } : x)));
    setEditing(null);
    notify(`تم تحديث سعر «${m.name}» إلى ${sar(Math.round(p))} — في الموقع والحجوزات`);
  };
  const remove = (m: Service) => {
    setServices((ms) => ms.filter((x) => x.id !== m.id));
    notify(`حُذفت «${m.name}» من قائمة الخدمات`);
  };
  const addService = () => {
    const p = Number(newPrice);
    if (!newName.trim() || !Number.isFinite(p) || p <= 0) return;
    setServices((ms) => [{ id: `s${Date.now()}`, name: newName.trim(), cat: newCat, price: Math.round(p), available: true, booked: 0 }, ...ms]);
    setAdding(false); setNewName(""); setNewPrice("");
    notify(`✅ أُضيفت «${newName.trim()}» للخدمات — صارت متاحة للحجز مباشرة`);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="الخدمات" value={String(services.length)} sub={`في ${categories.length} أقسام`} />
        <Stat label="متاحة" value={String(available)} sub="تظهر للعميلات" />
        <Stat label="موقّفة" value={String(services.length - available)} sub="مخفية مؤقتاً" accent />
      </div>

      <div className={card}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحثي عن خدمة..." className="w-full rounded-full border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-rose-100/40 focus:border-rose-400/60 focus:outline-none sm:max-w-xs" />
          <div className="flex gap-2 overflow-x-auto">
            {["الكل", ...categories].map((c) => (
              <button key={c} type="button" onClick={() => setCat(c)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold ${cat === c ? "bg-gradient-to-l from-rose-500 to-pink-400 text-white" : "bg-white/5 text-rose-50/80"}`}>{c}</button>
            ))}
          </div>
          <button type="button" onClick={() => setAdding((a) => !a)} className={`${primary} sm:ms-auto`}>+ خدمة جديدة</button>
        </div>

        <AnimatePresence>
          {adding && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-rose-400/30 bg-rose-400/5 p-3">
                <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="اسم الخدمة (مثال: تسريحة سهرة)" className="min-w-52 flex-1 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white placeholder:text-rose-100/40 focus:border-rose-400/60 focus:outline-none" />
                <input value={newPrice} onChange={(e) => setNewPrice(e.target.value)} type="number" inputMode="numeric" placeholder="السعر" className="w-24 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-center text-sm text-white placeholder:text-rose-100/40 focus:border-rose-400/60 focus:outline-none" />
                <select value={newCat} onChange={(e) => setNewCat(e.target.value)} className="rounded-full border border-white/10 bg-[#2e1420] px-4 py-2 text-sm text-white focus:border-rose-400/60 focus:outline-none">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <button type="button" onClick={addService} className={primary}>إضافة للخدمات</button>
                <button type="button" onClick={() => setAdding(false)} className="text-xs text-rose-100/50">إلغاء</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ul className="divide-y divide-white/5">
          {shown.map((m) => (
            <li key={m.id} className={`flex flex-wrap items-center gap-3 py-3.5 ${m.available ? "" : "opacity-60"}`}>
              <div className="w-full min-w-0 sm:w-auto sm:flex-1">
                <p className="font-bold text-white">{m.name}</p>
                <p className="flex flex-wrap items-center gap-2 text-[11px] text-rose-100/40">
                  {m.cat} • {m.booked} حجز هذا الأسبوع
                  {m.hot && <span className="whitespace-nowrap rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-300">🔥 الأكثر طلباً</span>}
                </p>
              </div>
              {editing === m.id ? (
                <div className="flex items-center gap-2">
                  <input autoFocus type="number" inputMode="numeric" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save(m)} className="w-20 rounded-full border border-rose-400/50 bg-black/30 px-3 py-1.5 text-center text-sm text-white focus:outline-none" aria-label="السعر الجديد" />
                  <button type="button" onClick={() => save(m)} className={primary}>حفظ</button>
                  <button type="button" onClick={() => setEditing(null)} className="text-xs text-rose-100/50">إلغاء</button>
                </div>
              ) : (
                <button type="button" onClick={() => { setEditing(m.id); setDraft(String(m.price)); }} className="rounded-full border border-white/10 px-3 py-1.5 text-sm font-bold text-rose-300 hover:border-rose-400/50" title="تعديل السعر">
                  {sar(m.price)} <span className="text-[10px] text-rose-100/40">✎</span>
                </button>
              )}
              <div className="ms-auto flex items-center gap-2 sm:ms-0">
                <button type="button" onClick={() => remove(m)} className="rounded-full p-1.5 text-rose-100/40 transition hover:text-rose-300" title="حذف الخدمة" aria-label={`حذف ${m.name}`}>
                  <Icon d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14" className="h-4 w-4" />
                </button>
                <span className={`w-14 text-end text-[11px] font-bold ${m.available ? "text-emerald-300" : "text-rose-300"}`}>{m.available ? "متاحة" : "موقّفة"}</span>
                <Toggle on={m.available} onChange={() => toggle(m)} label={`تفعيل ${m.name}`} />
              </div>
            </li>
          ))}
          {shown.length === 0 && <li className="py-8 text-center text-sm text-rose-100/40">لا توجد نتائج</li>}
        </ul>
      </div>
      <p className="text-center text-xs text-rose-100/40">أي تعديل سعر أو إيقاف خدمة ينعكس فوراً على صفحة الحجز اللي تشوفها عميلاتك.</p>
    </div>
  );
}

function Offers({ offers, setOffers, notify }: { offers: Offer[]; setOffers: React.Dispatch<React.SetStateAction<Offer[]>>; notify: (t: string) => void }) {
  const [nName, setNName] = useState("");
  const [nDesc, setNDesc] = useState("");
  const [nDisc, setNDisc] = useState("");
  const [nStart, setNStart] = useState("");
  const [nEnd, setNEnd] = useState("");
  const active = offers.filter((o) => o.active).length;
  const used = offers.reduce((s, o) => s + o.used, 0);

  const toggle = (o: Offer) => {
    setOffers((os) => os.map((x) => (x.id === o.id ? { ...x, active: !x.active } : x)));
    notify(o.active ? `توقّف «${o.name}» — اختفى العرض من الموقع والحجوزات` : `✅ «${o.name}» شغّال الآن — ظهر للعميلات في الموقع والحجوزات`);
  };
  const remove = (o: Offer) => {
    setOffers((os) => os.filter((x) => x.id !== o.id));
    notify(`حُذف «${o.name}» من العروض`);
  };
  const add = () => {
    const d = Number(nDisc);
    if (!nName.trim() || !Number.isFinite(d) || d <= 0 || d >= 100) return;
    setOffers((os) => [{ id: `o${Date.now()}`, name: nName.trim(), desc: nDesc.trim() || "عرض موسمي", discount: Math.round(d), starts: nStart.trim() || "اليوم", ends: nEnd.trim() || "مستمر", active: true, used: 0 }, ...os]);
    setNName(""); setNDesc(""); setNDisc(""); setNStart(""); setNEnd("");
    notify(`✅ انطلق «${nName.trim()}» بخصم ${Math.round(d)}% — ظهر للعميلات فوراً`);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="عروض شغّالة" value={String(active)} sub="تظهر للعميلات الآن" accent />
        <Stat label="مجدولة/منتهية" value={String(offers.length - active)} sub="تفعّلينها بضغطة" />
        <Stat label="استخدامات العروض" value={used.toLocaleString("en-US")} sub="حجز استفاد من عرض" />
      </div>

      <div className={card}>
        <Title sub="عرض جديد ينطلق فوراً أو يتجدول لموسم (اليوم الوطني، رمضان، العيد، التخرج...)">إطلاق عرض موسمي</Title>
        <div className="flex flex-wrap items-center gap-2">
          <input value={nName} onChange={(e) => setNName(e.target.value)} placeholder="اسم العرض (مثال: عرض التخرج)" className="min-w-44 flex-1 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white placeholder:text-rose-100/40 focus:border-rose-400/60 focus:outline-none" />
          <input value={nDesc} onChange={(e) => setNDesc(e.target.value)} placeholder="الوصف (اختياري)" className="min-w-44 flex-1 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white placeholder:text-rose-100/40 focus:border-rose-400/60 focus:outline-none" />
          <input value={nDisc} onChange={(e) => setNDisc(e.target.value)} type="number" inputMode="numeric" placeholder="خصم %" className="w-24 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-center text-sm text-white placeholder:text-rose-100/40 focus:border-rose-400/60 focus:outline-none" />
          <input value={nStart} onChange={(e) => setNStart(e.target.value)} placeholder="يبدأ" className="w-24 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-center text-sm text-white placeholder:text-rose-100/40 focus:border-rose-400/60 focus:outline-none" />
          <input value={nEnd} onChange={(e) => setNEnd(e.target.value)} placeholder="ينتهي" className="w-24 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-center text-sm text-white placeholder:text-rose-100/40 focus:border-rose-400/60 focus:outline-none" />
          <button type="button" onClick={add} className={primary}>إطلاق العرض</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {offers.map((o) => (
          <div key={o.id} className={`${card} ${o.active ? "border-rose-400/25" : "opacity-60"}`}>
            <div className="mb-3 flex items-center justify-between">
              <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${o.active ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-rose-100/60"}`}>
                {o.active ? "● شغّال الآن" : "موقّف"}
              </span>
              <span className="rounded-full bg-gradient-to-l from-rose-500 to-pink-400 px-3 py-1 text-xs font-bold text-white">خصم {o.discount}%</span>
            </div>
            <p className="font-bold text-white">{o.name}</p>
            <p className="mt-0.5 text-xs text-rose-100/50">{o.desc}</p>
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-100/40">
              <Icon d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" className="h-3.5 w-3.5" />
              {o.starts} — {o.ends}
            </p>
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/5 pt-3">
              <span className="text-[11px] text-rose-100/50">{o.used} حجز استخدم العرض</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => remove(o)} className="rounded-full p-1.5 text-rose-100/40 transition hover:text-rose-300" title="حذف العرض" aria-label={`حذف ${o.name}`}>
                  <Icon d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14" className="h-4 w-4" />
                </button>
                <Toggle on={o.active} onChange={() => toggle(o)} label={`تفعيل ${o.name}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-rose-100/40">فعّلي عرض الموسم قبل المناسبة بيوم — بانر العرض يظهر تلقائياً في أعلى الموقع ومع الأسعار في الحجز.</p>
    </div>
  );
}

function Cta() {
  return (
    <div className="mt-10 overflow-hidden rounded-3xl border border-rose-400/25 bg-gradient-to-l from-rose-600/25 via-[#2e1420] to-[#241019] p-6 text-center sm:p-8">
      <h3 className="text-xl font-bold text-white sm:text-2xl">خلّي أسعارك وعروضك تتحدث قبل ما تتصل بك المصممة ✨</h3>
      <p className="mx-auto mt-2 max-w-2xl text-sm text-rose-100/60">
        هذا عرض تجريبي ببيانات وهمية. لو عجبك، نطلق نفس اللوحة باسم صالونك وخدماتك وعروضك خلال أيام — مع صيانة ودعم فني مستمر.
      </p>
      <a href={whatsappLink("أهلاً، شفت العرض التجريبي للوحة تحكم الصالون وأبي أفعّلها لصالوني")} target="_blank" rel="noreferrer" className={`${primary} mt-5`}>
        أبغى اللوحة لصالوني — كلميني واتساب
      </a>
    </div>
  );
}
