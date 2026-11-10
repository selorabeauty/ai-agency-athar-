"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { whatsappLink } from "@/lib/site";
import {
  activity, AGENCY, AGENCY_FULL, covers, fileKinds, incoming, initialBookings, initialChats, initialPosts, months, statuses, types,
  type BFile, type Booking, type BStatus, type BType, type Chat, type FileKind, type Post,
} from "./data";

type Tab = "overview" | "bookings" | "chat" | "blog";

const icons: Record<Tab, string> = {
  overview: "M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z",
  bookings: "M2 16.5 21 9l-2-3-7 3-5-4-2 1 3 5-4 2-2-1-1 1 3 3.5Z M3 21h18",
  chat: "M8 10h.01M12 10h.01M16 10h.01M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12Z",
  blog: "M4 4h16v16H4zM8 8h8M8 12h8M8 16h5",
};

const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "اللوحة الرئيسية" },
  { id: "bookings", label: "الحجوزات والخدمات" },
  { id: "chat", label: "الشات بوت والعملاء" },
  { id: "blog", label: "إدارة المدونة" },
];

const sar = (n: number) => `${n.toLocaleString("en-US")} ر.س`;
const card = "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(8,47,73,0.45)] sm:p-6";
const btn = "inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition active:scale-[0.98] disabled:opacity-50";
const primary = `${btn} bg-gradient-to-l from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-500/25 hover:brightness-105`;
const dark = `${btn} bg-[#082f49] text-white hover:bg-[#0c4a6e]`;
const ghost = `${btn} border border-slate-200 text-slate-700 hover:border-sky-400 hover:text-sky-700`;
const input = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-sky-500 focus:outline-none";

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function Title({ children, sub, end }: { children: React.ReactNode; sub?: string; end?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-bold text-[#082f49] sm:text-lg">{children}</h3>
        {sub && <p className="text-xs text-slate-500">{sub}</p>}
      </div>
      {end}
    </div>
  );
}

function StatusChip({ s }: { s: BStatus }) {
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statuses[s].chip}`}><span className={`h-1.5 w-1.5 rounded-full ${statuses[s].dot}`} />{statuses[s].label}</span>;
}

function TypeChip({ t }: { t: BType }) {
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold ${types[t].chip}`}>{types[t].emoji} {types[t].label}</span>;
}

function Kpi({ label, value, sub, icon, accent }: { label: string; value: string; sub: string; icon: string; accent?: boolean }) {
  return (
    <div className={`${card} ${accent ? "!border-sky-200 bg-gradient-to-br from-sky-50 to-white" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-slate-500">{label}</p>
        <span className="rounded-xl bg-sky-50 p-2 text-sky-700"><Icon d={icon} className="h-4 w-4" /></span>
      </div>
      <motion.b key={value} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 block text-2xl font-extrabold text-[#082f49] sm:text-3xl">{value}</motion.b>
      <p className="mt-1 text-xs font-bold text-emerald-600">{sub}</p>
    </div>
  );
}

export function TravelDemo() {
  const [tab, setTab] = useState<Tab>("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [toast, setToast] = useState<string | null>(null);
  const [botTotal, setBotTotal] = useState(2316);
  const nextId = useRef(3419);
  const tick = useRef(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const notify = useCallback((t: string) => {
    setToast(t);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      tick.current += 1;
      const n = tick.current;
      if (n % 3 === 0 && n / 3 - 1 < incoming.length) {
        const b = incoming[n / 3 - 1];
        const id = `SQ-${nextId.current++}`;
        setBookings((bs) => [{ ...b, id, status: "new", files: [] }, ...bs]);
        notify(`طلب جديد ${types[b.type].emoji} ${id} — ${b.customer} (${types[b.type].label})`);
      }
      setChats((cs) => cs.map((c) => {
        if (c.status !== "bot" || !c.script.length) return c;
        const [next, ...rest] = c.script;
        const handoff = next.text.includes("أحوّلك لموظف");
        return { ...c, msgs: [...c.msgs, next], script: rest, unread: c.unread + 1, status: handoff ? "waiting" : c.status };
      }));
      setBotTotal((x) => x + 1);
    }, 5000);
    return () => clearInterval(t);
  }, [notify]);

  const go = (t: Tab) => {
    setTab(t);
    setDrawer(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateBooking = (id: string, patch: Partial<Booking> | ((b: Booking) => Partial<Booking>)) =>
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, ...(typeof patch === "function" ? patch(b) : patch) } : b)));

  const waiting = chats.filter((c) => c.status === "waiting").length;
  const current = tabs.find((t) => t.id === tab)!;

  const nav = (compact: boolean) => (
    <nav className="mt-8 space-y-1.5">
      {tabs.map((t) => (
        <button key={t.id} type="button" onClick={() => go(t.id)} title={t.label} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition ${compact ? "justify-center" : ""} ${tab === t.id ? "bg-white text-[#082f49] shadow-lg" : "text-sky-100/80 hover:bg-white/10"}`}>
          <span className="relative">
            <Icon d={icons[t.id]} />
            {compact && t.id === "chat" && waiting > 0 && <span className="absolute -end-1 -top-1 h-2.5 w-2.5 rounded-full bg-rose-500" />}
          </span>
          {!compact && <span className="flex-1 text-start">{t.label}</span>}
          {!compact && t.id === "chat" && waiting > 0 && <span className="rounded-full bg-rose-500 px-2 text-[10px] text-white">{waiting}</span>}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="font-cairo min-h-screen bg-[#f3f7fb] text-slate-800" style={{ colorScheme: "light" }}>
      <div className="bg-gradient-to-l from-[#082f49] to-sky-700 px-4 py-2 text-center text-[11px] font-bold text-sky-50 sm:text-xs">
        عرض تجريبي مقدّم من آثر ديجيتال — جميع الأسماء والأرقام توضيحية
      </div>

      <div className="flex">
        <aside className={`sticky top-0 hidden h-screen shrink-0 flex-col bg-gradient-to-b from-[#082f49] to-[#0c4a6e] p-4 text-white transition-[width] duration-300 lg:flex ${collapsed ? "w-20" : "w-72"}`}>
          <Brand compact={collapsed} />
          {nav(collapsed)}
          <button type="button" onClick={() => setCollapsed((c) => !c)} className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-xs text-sky-100/80 hover:bg-white/5" aria-label={collapsed ? "توسيع القائمة" : "طي القائمة"}>
            <Icon d={collapsed ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} className="h-4 w-4" />
            {!collapsed && "طي القائمة"}
          </button>
        </aside>

        <AnimatePresence>
          {drawer && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} className="fixed inset-0 z-40 bg-[#082f49]/50 backdrop-blur-sm lg:hidden" />
              <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.25 }} className="fixed inset-y-0 start-0 z-50 flex w-72 flex-col bg-gradient-to-b from-[#082f49] to-[#0c4a6e] p-4 text-white lg:hidden">
                <div className="flex items-start justify-between"><Brand /><button type="button" onClick={() => setDrawer(false)} className="p-1 text-sky-100" aria-label="إغلاق القائمة"><Icon d="M18 6 6 18M6 6l12 12" /></button></div>
                {nav(false)}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setDrawer(true)} className="rounded-xl border border-slate-200 p-2 text-[#082f49] lg:hidden" aria-label="فتح القائمة"><Icon d="M4 6h16M4 12h16M4 18h16" /></button>
                <div>
                  <h1 className="text-lg font-bold text-[#082f49] sm:text-xl">{current.label}</h1>
                  <p className="text-[11px] text-slate-500 sm:text-xs">{AGENCY_FULL}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 sm:flex"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> البوت متصل الآن</span>
                <button type="button" onClick={() => go("chat")} className="relative rounded-xl border border-slate-200 p-2 text-sky-700" aria-label="محادثات تنتظر موظف">
                  <Icon d={icons.chat} />
                  {waiting > 0 && <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{waiting}</span>}
                </button>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:py-8">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
                {tab === "overview" && <Overview bookings={bookings} botTotal={botTotal} go={go} />}
                {tab === "bookings" && <Bookings bookings={bookings} update={updateBooking} notify={notify} />}
                {tab === "chat" && <ChatCrm chats={chats} setChats={setChats} bookings={bookings} notify={notify} />}
                {tab === "blog" && <Blog posts={posts} setPosts={setPosts} notify={notify} />}
              </motion.div>
            </AnimatePresence>
            <Cta />
            <p className="mt-8 text-center text-[11px] text-slate-400">صُممت هذه المنصة التجريبية لـ {AGENCY_FULL} بواسطة آثر ديجيتال • الأرقام للعرض فقط</p>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="fixed inset-x-4 bottom-5 z-[70] mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-[#082f49] p-4 text-sm text-white shadow-2xl">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500"><Icon d="m5 12 5 5L20 7" className="h-4 w-4" /></span>
            <span className="flex-1">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Brand({ compact }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? "justify-center" : ""}`}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-900/30">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M2 12c4-1 7-4 9-8 1 3 0 6-2 8 3 0 7-1 11-4-1 5-5 9-10 10l-2 4-1-4c-2 0-4-2-5-6Z" /></svg>
      </span>
      {!compact && (
        <div>
          <p className="text-lg font-extrabold leading-tight text-white">{AGENCY}</p>
          <p className="text-[11px] text-sky-200">للسفر والسياحة</p>
        </div>
      )}
    </div>
  );
}

function StackedBars() {
  const totals = months.map((_, i) => (Object.keys(activity) as BType[]).reduce((s, t) => s + activity[t][i], 0));
  const max = Math.max(...totals);
  return (
    <div>
      <div className="flex h-52 items-end gap-1.5 sm:gap-3">
        {months.map((m, i) => (
          <div key={m} className="group flex h-full flex-1 flex-col items-center gap-1.5">
            <span className="text-[9px] font-bold text-sky-700 opacity-0 transition group-hover:opacity-100 sm:text-[10px]">{totals[i]}</span>
            <div className="relative w-full flex-1">
              <motion.div initial={{ height: 0 }} animate={{ height: `${(totals[i] / max) * 100}%` }} transition={{ duration: 0.7, delay: i * 0.04 }} className="absolute inset-x-0 bottom-0 flex flex-col-reverse overflow-hidden rounded-t-md">
                {(Object.keys(activity) as BType[]).map((t) => <span key={t} style={{ height: `${(activity[t][i] / totals[i]) * 100}%`, background: types[t].color }} />)}
              </motion.div>
            </div>
            <span className="text-[9px] text-slate-500 sm:text-[10px]">{m}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-slate-600">
        {(Object.keys(types) as BType[]).map((t) => <span key={t} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: types[t].color }} />{types[t].label}</span>)}
      </div>
    </div>
  );
}

function Overview({ bookings, botTotal, go }: { bookings: Booking[]; botTotal: number; go: (t: Tab) => void }) {
  const fresh = bookings.filter((b) => b.status === "new").length;
  const revenue = 486300 + bookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.amount, 0);
  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-[#082f49] via-[#0c4a6e] to-sky-600 p-6 text-white sm:p-8">
        <div aria-hidden className="absolute -start-16 -top-24 h-64 w-64 rounded-full bg-amber-400/25 blur-3xl" />
        <p className="relative text-sm text-sky-100">صباح الخير، فريق {AGENCY} ✈️</p>
        <h2 className="relative mt-2 max-w-2xl text-2xl font-extrabold leading-snug sm:text-3xl">عندكم {fresh} طلبات جديدة، والبوت رد على {botTotal.toLocaleString("en-US")} محادثة هذا الشهر.</h2>
        <div className="relative mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => go("bookings")} className={`${btn} bg-white text-[#082f49]`}>إدارة الحجوزات</button>
          <button type="button" onClick={() => go("chat")} className={`${btn} border border-white/30 text-white hover:bg-white/10`}>المحادثات الحية</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Kpi label="إجمالي الحجوزات" value={(1274 + bookings.length).toLocaleString("en-US")} sub="▲ 21% عن الشهر الماضي" icon={icons.bookings} />
        <Kpi label="الطلبات الجديدة" value={String(fresh)} sub="تنتظر المعالجة" icon="M12 8v4l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" accent />
        <Kpi label="الإيرادات (هذا الشهر)" value={sar(revenue)} sub="▲ 17% عن الشهر الماضي" icon="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        <Kpi label="محادثات البوت" value={botTotal.toLocaleString("en-US")} sub="86% بدون تدخل موظف" icon={icons.chat} />
      </div>

      <div className={card}>
        <Title sub="عدد الحجوزات الشهري حسب نوع الخدمة — آخر 12 شهر">نشاط الحجوزات</Title>
        <StackedBars />
      </div>

      <div className={card}>
        <Title sub="آخر الطلبات الواردة" end={<button type="button" onClick={() => go("bookings")} className="text-xs font-bold text-sky-700">كل الحجوزات ←</button>}>أحدث الحجوزات</Title>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead><tr className="border-b border-slate-200 text-[11px] text-slate-500">{["رقم الطلب", "العميل", "الخدمة", "تاريخ السفر", "المبلغ", "الحالة"].map((h) => <th key={h} className="px-2 py-2.5 text-start font-bold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.slice(0, 6).map((b) => (
                <motion.tr layout key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="px-2 py-3 text-xs text-slate-500" dir="ltr">{b.id}</td>
                  <td className="px-2 py-3 font-bold text-[#082f49]">{b.customer}</td>
                  <td className="px-2 py-3"><TypeChip t={b.type} /><p className="mt-1 text-[11px] text-slate-500">{b.title}</p></td>
                  <td className="px-2 py-3 text-slate-600">{b.date}</td>
                  <td className="px-2 py-3 font-bold text-[#082f49]">{sar(b.amount)}</td>
                  <td className="px-2 py-3"><StatusChip s={b.status} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Bookings({ bookings, update, notify }: { bookings: Booking[]; update: (id: string, p: Partial<Booking> | ((b: Booking) => Partial<Booking>)) => void; notify: (t: string) => void }) {
  const [type, setType] = useState<BType | "all">("all");
  const [status, setStatus] = useState<BStatus | "all">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const shown = bookings.filter((b) => (type === "all" || b.type === type) && (status === "all" || b.status === status) && (b.customer.includes(q.trim()) || b.id.includes(q.trim().toUpperCase())));
  const sel = bookings.find((b) => b.id === open);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(Object.keys(types) as BType[]).map((t) => (
          <button key={t} type="button" onClick={() => setType(type === t ? "all" : t)} className={`${card} !p-4 text-start transition ${type === t ? "ring-2 ring-sky-500" : ""}`}>
            <span className="text-2xl">{types[t].emoji}</span>
            <b className="mt-1 block text-2xl font-extrabold text-[#082f49]">{bookings.filter((b) => b.type === t).length}</b>
            <span className="text-xs text-slate-500">{types[t].label}</span>
          </button>
        ))}
      </div>
      <div className={card}>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث باسم العميل أو رقم الطلب..." className={`${input} lg:max-w-xs`} />
          <div className="flex gap-2 overflow-x-auto">
            {(["all", ...Object.keys(statuses)] as (BStatus | "all")[]).map((s) => (
              <button key={s} type="button" onClick={() => setStatus(s)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold ${status === s ? "bg-[#082f49] text-white" : "bg-slate-100 text-slate-600"}`}>
                {s === "all" ? "كل الحالات" : statuses[s].label} <span className="opacity-60">{s === "all" ? bookings.length : bookings.filter((b) => b.status === s).length}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead><tr className="border-b border-slate-200 text-[11px] text-slate-500">{["رقم الطلب", "العميل", "الخدمة", "السفر", "المسافرون", "المبلغ", "الحالة", "الملفات", ""].map((h) => <th key={h} className="px-2 py-2.5 text-start font-bold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {shown.map((b) => (
                <tr key={b.id} onClick={() => setOpen(b.id)} className="cursor-pointer hover:bg-sky-50/50">
                  <td className="px-2 py-3 text-xs text-slate-500" dir="ltr">{b.id}</td>
                  <td className="px-2 py-3"><b className="text-[#082f49]">{b.customer}</b><p className="text-[11px] text-slate-500" dir="ltr">{b.phone}</p></td>
                  <td className="px-2 py-3"><TypeChip t={b.type} /><p className="mt-1 text-[11px] text-slate-500">{b.title}</p></td>
                  <td className="px-2 py-3 text-slate-600">{b.date}</td>
                  <td className="px-2 py-3 text-slate-600">{b.travelers}</td>
                  <td className="px-2 py-3 font-bold text-[#082f49]">{sar(b.amount)}</td>
                  <td className="px-2 py-3"><StatusChip s={b.status} /></td>
                  <td className="px-2 py-3 text-xs text-slate-500">{b.files.length ? `📎 ${b.files.length}` : "—"}</td>
                  <td className="px-2 py-3 text-xs font-bold text-sky-700">إدارة ←</td>
                </tr>
              ))}
              {shown.length === 0 && <tr><td colSpan={9} className="py-8 text-center text-sm text-slate-400">لا توجد طلبات بهذا الفلتر</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <AnimatePresence>{sel && <BookingPanel b={sel} update={update} notify={notify} onClose={() => setOpen(null)} />}</AnimatePresence>
    </div>
  );
}

function BookingPanel({ b, update, notify, onClose }: { b: Booking; update: (id: string, p: Partial<Booking> | ((b: Booking) => Partial<Booking>)) => void; notify: (t: string) => void; onClose: () => void }) {
  const [kind, setKind] = useState<FileKind>(b.type === "flight" ? "ticket" : b.type === "visa" ? "waiver" : "voucher");
  const [over, setOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    const added: BFile[] = Array.from(list).slice(0, 5).map((f, i) => ({ id: `${Date.now()}-${i}`, name: f.name, size: f.size > 1e6 ? `${(f.size / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(f.size / 1e3))} KB`, kind, url: URL.createObjectURL(f) }));
    update(b.id, (x) => ({ files: [...x.files, ...added] }));
    notify(`تم رفع ${added.length} ملف (${fileKinds[kind]}) للطلب ${b.id}`);
  };
  const demoFile = () => {
    const name = `${fileKinds[kind]}-${b.customer.split(" ")[0]}-${b.id}.pdf`;
    update(b.id, (x) => ({ files: [...x.files, { id: String(Date.now()), name, size: "260 KB", kind }] }));
    notify(`تم رفع ${name}`);
  };
  const send = () => {
    const pending = b.files.filter((f) => !f.sent).length;
    if (!pending) return notify("ما فيه ملفات جديدة للإرسال");
    update(b.id, (x) => ({ files: x.files.map((f) => ({ ...f, sent: true })), status: x.status === "processing" || x.status === "new" ? "confirmed" : x.status }));
    notify(`📲 أُرسلت ${pending} ملفات لـ ${b.customer} على الواتساب والإيميل، وتأكد الطلب`);
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end bg-[#082f49]/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "tween", duration: 0.25 }} onClick={(e) => e.stopPropagation()} className="me-auto h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500" dir="ltr">{b.id}</p>
            <h3 className="text-lg font-extrabold text-[#082f49]">{b.customer}</h3>
            <p className="text-xs text-slate-500" dir="ltr">{b.phone}</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400" aria-label="إغلاق"><Icon d="M18 6 6 18M6 6l12 12" /></button>
        </div>
        <div className="mt-4 rounded-2xl bg-[#f3f7fb] p-4">
          <TypeChip t={b.type} />
          <p className="mt-2 font-bold text-[#082f49]">{b.title}</p>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-600">
            <span>📅 {b.date}</span><span>👥 {b.travelers} مسافرين</span><b className="text-[#082f49]">{sar(b.amount)}</b>
          </div>
        </div>

        <h4 className="mt-6 text-sm font-bold text-[#082f49]">حالة الطلب</h4>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(Object.keys(statuses) as BStatus[]).map((s) => (
            <button key={s} type="button" onClick={() => { update(b.id, { status: s }); notify(`تم تحديث ${b.id} إلى «${statuses[s].label}» — وصل العميل إشعار تلقائي`); }} className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition ${b.status === s ? `${statuses[s].chip} ring-2 ring-offset-1 ring-sky-400` : "border-slate-200 text-slate-600 hover:border-sky-300"}`}>{statuses[s].label}</button>
          ))}
        </div>

        <h4 className="mt-6 text-sm font-bold text-[#082f49]">ملفات التسليم للعميل</h4>
        <div className="mt-2 flex gap-2">
          {(Object.keys(fileKinds) as FileKind[]).map((k) => (
            <button key={k} type="button" onClick={() => setKind(k)} className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold ${kind === k ? "bg-[#082f49] text-white" : "bg-slate-100 text-slate-600"}`}>{fileKinds[k]}</button>
          ))}
        </div>
        <div
          onDragOver={(e) => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => { e.preventDefault(); setOver(false); addFiles(e.dataTransfer.files); }}
          className={`mt-3 rounded-2xl border-2 border-dashed p-5 text-center transition ${over ? "border-sky-500 bg-sky-50" : "border-slate-200"}`}
        >
          <Icon d="M12 16V4m0 0-4 4m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" className="mx-auto h-7 w-7 text-sky-600" />
          <p className="mt-2 text-xs text-slate-600">اسحب ملف {fileKinds[kind]} هنا أو</p>
          <div className="mt-2 flex justify-center gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} className={ghost}>اختر من جهازك</button>
            <button type="button" onClick={demoFile} className={ghost}>ملف تجريبي</button>
          </div>
          <input ref={fileRef} type="file" multiple accept=".pdf,image/*" className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
          <p className="mt-2 text-[10px] text-slate-400">PDF أو صور • في العرض التجريبي الملف يبقى على جهازك ولا يُرفع لأي خادم</p>
        </div>
        <ul className="mt-3 space-y-2">
          {b.files.map((f) => (
            <li key={f.id} className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-xs">
              <span className="rounded-lg bg-sky-50 px-2 py-1 font-bold text-sky-700">{fileKinds[f.kind]}</span>
              <span className="min-w-0 flex-1 truncate" dir="auto">{f.url ? <a href={f.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{f.name}</a> : f.name}</span>
              <span className="text-slate-400">{f.size}</span>
              <span className={f.sent ? "font-bold text-emerald-600" : "text-amber-600"}>{f.sent ? "أُرسل ✓" : "جاهز"}</span>
              <button type="button" onClick={() => update(b.id, (x) => ({ files: x.files.filter((y) => y.id !== f.id) }))} className="text-slate-400 hover:text-rose-600" aria-label={`حذف ${f.name}`}><Icon d="M18 6 6 18M6 6l12 12" className="h-4 w-4" /></button>
            </li>
          ))}
          {b.files.length === 0 && <li className="py-3 text-center text-xs text-slate-400">ما فيه ملفات مرفوعة لهذا الطلب</li>}
        </ul>
        <button type="button" onClick={send} className={`${primary} mt-4 w-full py-3 text-sm`}>إرسال الملفات للعميل (واتساب + إيميل)</button>
      </motion.div>
    </motion.div>
  );
}

function ChatCrm({ chats, setChats, bookings, notify }: { chats: Chat[]; setChats: React.Dispatch<React.SetStateAction<Chat[]>>; bookings: Booking[]; notify: (t: string) => void }) {
  const [active, setActive] = useState(chats[0].id);
  const [draft, setDraft] = useState("");
  const [client, setClient] = useState<string | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const c = chats.find((x) => x.id === active)!;

  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight, behavior: "smooth" });
  }, [c.msgs.length, active]);

  useEffect(() => {
    if (c.unread) setChats((cs) => cs.map((x) => (x.id === active ? { ...x, unread: 0 } : x)));
  }, [active, c.unread, setChats]);

  const patch = (p: Partial<Chat>) => setChats((cs) => cs.map((x) => (x.id === active ? { ...x, ...p } : x)));
  const takeover = () => { patch({ status: "staff" }); notify(`تدخلت في محادثة ${c.customer} — البوت متوقف مؤقتاً`); };
  const release = () => { patch({ status: "bot" }); notify("رجعت المحادثة للبوت"); };
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const t = draft.trim();
    if (!t) return;
    setChats((cs) => cs.map((x) => (x.id === active ? { ...x, msgs: [...x.msgs, { from: "staff", text: t }] } : x)));
    setDraft("");
    setTimeout(() => setChats((cs) => cs.map((x) => (x.id === active ? { ...x, msgs: [...x.msgs, { from: "customer", text: x.phone.startsWith("0537") ? "Perfect, thank you!" : "تمام، الله يعطيك العافية 🙏" }] } : x))), 2200);
  };

  const clients = useMemo(() => {
    const m = new Map<string, Booking[]>();
    bookings.forEach((b) => m.set(b.customer, [...(m.get(b.customer) ?? []), b]));
    return [...m.entries()].map(([name, list]) => ({ name, phone: list[0].phone, list, spend: list.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.amount, 0) }));
  }, [bookings]);
  const selClient = clients.find((x) => x.name === client);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-3">
        <div className={`${card} min-w-0 !p-3 xl:col-span-1`}>
          <p className="px-2 pb-2 pt-1 text-sm font-bold text-[#082f49]">المحادثات الحية</p>
          <ul className="space-y-1.5">
            {chats.map((x) => (
              <li key={x.id}>
                <button type="button" onClick={() => setActive(x.id)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-start transition ${active === x.id ? "bg-sky-50 ring-1 ring-sky-200" : "hover:bg-slate-50"}`}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#082f49] text-sm font-bold text-white">{x.customer.charAt(0)}</span>
                  <span className="min-w-0 flex-1">
                    <b className="block truncate text-sm text-[#082f49]">{x.customer}</b>
                    <span className="block truncate text-[11px] text-slate-500" dir="auto">{x.msgs[x.msgs.length - 1].text}</span>
                  </span>
                  <span className="flex flex-col items-end gap-1">
                    <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold ${x.status === "waiting" ? "bg-rose-50 text-rose-600" : x.status === "staff" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{x.status === "waiting" ? "يطلب موظف" : x.status === "staff" ? "موظف" : "البوت"}</span>
                    {x.unread > 0 && active !== x.id && <span className="rounded-full bg-sky-600 px-1.5 text-[10px] font-bold text-white">{x.unread}</span>}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${card} min-w-0 !p-0 overflow-hidden xl:col-span-2`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
            <div>
              <b className="text-[#082f49]">{c.customer}</b>
              <p className="text-[11px] text-slate-500">{c.topic} • <span dir="ltr">{c.phone}</span></p>
            </div>
            {c.status === "staff" ? (
              <button type="button" onClick={release} className={ghost}>🤖 إرجاع للبوت</button>
            ) : (
              <button type="button" onClick={takeover} className={c.status === "waiting" ? `${btn} animate-pulse bg-rose-600 text-white` : dark}>👤 تدخل مباشر من الموظف</button>
            )}
          </div>
          <div ref={box} className="h-[360px] space-y-2 overflow-y-auto bg-[#f3f7fb] p-4">
            {c.msgs.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${m.from === "customer" ? "items-start" : "items-end"}`}>
                <span className="mb-0.5 text-[10px] text-slate-400">{m.from === "customer" ? c.customer : m.from === "bot" ? "🤖 البوت" : "👤 الموظف"}</span>
                <span dir="auto" className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${m.from === "customer" ? "rounded-ss-sm bg-white text-slate-800 shadow-sm" : m.from === "bot" ? "rounded-se-sm bg-sky-600 text-white" : "rounded-se-sm bg-amber-500 text-white"}`}>{m.text}</span>
              </motion.div>
            ))}
            {c.status === "bot" && c.script.length > 0 && <p className="text-center text-[11px] text-slate-400">العميل يكتب...</p>}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-slate-100 p-3">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} disabled={c.status !== "staff"} placeholder={c.status === "staff" ? "اكتب ردك للعميل..." : "اضغط «تدخل مباشر» عشان ترد بنفسك"} className={`${input} disabled:bg-slate-50`} />
            <button type="submit" disabled={c.status !== "staff" || !draft.trim()} className={primary}>إرسال</button>
          </form>
        </div>
      </div>

      <div className={card}>
        <Title sub="بيانات العملاء وحجوزاتهم السابقة">قائمة العملاء</Title>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead><tr className="border-b border-slate-200 text-[11px] text-slate-500">{["العميل", "الجوال", "عدد الحجوزات", "إجمالي الإنفاق", "آخر خدمة", ""].map((h) => <th key={h} className="px-2 py-2.5 text-start font-bold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((x) => (
                <tr key={x.name} onClick={() => setClient(x.name)} className="cursor-pointer hover:bg-sky-50/50">
                  <td className="px-2 py-3"><div className="flex items-center gap-2.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-800">{x.name.charAt(0)}</span><b className="text-[#082f49]">{x.name}</b></div></td>
                  <td className="px-2 py-3 text-slate-600" dir="ltr">{x.phone}</td>
                  <td className="px-2 py-3"><span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-bold text-sky-700">{x.list.length + (x.name.length % 3)}</span></td>
                  <td className="px-2 py-3 font-bold text-[#082f49]">{sar(x.spend)}</td>
                  <td className="px-2 py-3"><TypeChip t={x.list[0].type} /></td>
                  <td className="px-2 py-3 text-xs font-bold text-sky-700">السجل ←</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selClient && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setClient(null)} className="fixed inset-0 z-50 flex items-end justify-center bg-[#082f49]/40 p-4 backdrop-blur-sm sm:items-center">
            <motion.div initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} onClick={(e) => e.stopPropagation()} className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#082f49] font-bold text-white">{selClient.name.charAt(0)}</span>
                  <div><p className="text-lg font-extrabold text-[#082f49]">{selClient.name}</p><p className="text-xs text-slate-500" dir="ltr">{selClient.phone}</p></div>
                </div>
                <button type="button" onClick={() => setClient(null)} className="text-slate-400" aria-label="إغلاق"><Icon d="M18 6 6 18M6 6l12 12" /></button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-xl bg-[#f3f7fb] p-3"><b className="block text-xl text-[#082f49]">{sar(selClient.spend)}</b><span className="text-[10px] text-slate-500">إجمالي الإنفاق</span></div>
                <div className="rounded-xl bg-[#f3f7fb] p-3"><b className="block text-xl text-[#082f49]">{selClient.list.length}</b><span className="text-[10px] text-slate-500">حجوزات هذا الموسم</span></div>
              </div>
              <h4 className="mt-5 text-sm font-bold text-[#082f49]">الحجوزات السابقة</h4>
              <ul className="mt-2 space-y-2">
                {[...selClient.list, { id: "SQ-2981", customer: selClient.name, phone: selClient.phone, type: "flight" as BType, title: "الرياض ← دبي (ذهاب وعودة)", date: "مارس 2026", travelers: 2, amount: 1980, status: "confirmed" as BStatus, files: [] }].map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
                    <div><TypeChip t={b.type} /><p className="mt-1 text-xs font-bold text-[#082f49]">{b.title}</p><p className="text-[11px] text-slate-500">{b.date} • {sar(b.amount)}</p></div>
                    <StatusChip s={b.status} />
                  </li>
                ))}
              </ul>
              <a href={`https://wa.me/966${selClient.phone.replace(/\s/g, "").slice(1)}`} target="_blank" rel="noopener noreferrer" className={`${primary} mt-5 w-full py-3`}>مراسلة العميل على واتساب</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Blog({ posts, setPosts, notify }: { posts: Post[]; setPosts: React.Dispatch<React.SetStateAction<Post[]>>; notify: (t: string) => void }) {
  const [editing, setEditing] = useState<Post | null>(null);
  const blank = (): Post => ({ id: `P${Date.now()}`, title: "", body: "", cover: covers[3], status: "draft", views: 0, date: "مسودة" });
  const save = (p: Post, publish: boolean) => {
    const next = { ...p, status: publish ? ("published" as const) : p.status, date: publish ? "اليوم" : p.date };
    setPosts((ps) => (ps.some((x) => x.id === p.id) ? ps.map((x) => (x.id === p.id ? next : x)) : [next, ...ps]));
    setEditing(null);
    notify(publish ? `🌐 تم نشر «${p.title}» في المدونة — وأُرسل لجوجل للأرشفة` : "تم حفظ المسودة");
  };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Kpi label="المقالات المنشورة" value={String(posts.filter((p) => p.status === "published").length + 21)} sub="في المدونة" icon={icons.blog} />
        <Kpi label="زيارات المدونة" value="38.6K" sub="▲ 34% هذا الشهر" icon="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <Kpi label="طلبات من المدونة" value="412" sub="زائر تحوّل لعميل" icon={icons.bookings} accent />
      </div>
      <div className={card}>
        <Title sub="مقالات سياحية تجيب زوار من جوجل" end={<button type="button" onClick={() => setEditing(blank())} className={primary}><Icon d="M12 5v14M5 12h14" className="h-4 w-4" /> مقال جديد</button>}>المقالات</Title>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence initial={false}>
            {posts.map((p) => (
              <motion.li layout key={p.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="h-32 bg-cover bg-center" style={{ backgroundImage: p.cover.startsWith("linear") ? p.cover : `url(${p.cover})` }} />
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className={`rounded-full px-2 py-0.5 font-bold ${p.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{p.status === "published" ? "منشور" : "مسودة"}</span>
                    <span className="text-slate-400">{p.date}{p.views ? ` • ${p.views.toLocaleString("en-US")} مشاهدة` : ""}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 font-bold text-[#082f49]">{p.title}</p>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => setEditing(p)} className={ghost}>تعديل</button>
                    <button type="button" onClick={() => { setPosts((ps) => ps.filter((x) => x.id !== p.id)); notify("تم حذف المقال"); }} className="px-2 text-xs font-bold text-slate-400 hover:text-rose-600">حذف</button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <AnimatePresence>{editing && <Editor post={editing} onClose={() => setEditing(null)} onSave={save} />}</AnimatePresence>
    </div>
  );
}

function Editor({ post, onClose, onSave }: { post: Post; onClose: () => void; onSave: (p: Post, publish: boolean) => void }) {
  const [p, setP] = useState(post);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const slug = p.title.trim().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, "-").slice(0, 50) || "عنوان-المقال";
  const desc = p.body.trim().slice(0, 155) || "اكتب نص المقال عشان يطلع وصف الصفحة في جوجل هنا...";
  const submit = (publish: boolean) => {
    if (p.title.trim().length < 8) return setErr("العنوان قصير — اكتب عنوان واضح (8 أحرف على الأقل)");
    if (publish && p.body.trim().length < 40) return setErr("نص المقال قصير للنشر");
    onSave({ ...p, title: p.title.trim() }, publish);
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 flex items-end justify-center bg-[#082f49]/40 p-4 backdrop-blur-sm sm:items-center">
      <motion.div initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold text-[#082f49]">{post.title ? "تعديل المقال" : "مقال جديد"}</h3><button type="button" onClick={onClose} className="text-slate-400" aria-label="إغلاق"><Icon d="M18 6 6 18M6 6l12 12" /></button></div>
        <div>
          <p className="mb-1.5 text-xs font-bold text-slate-600">الصورة الرئيسية</p>
          <div className="h-36 rounded-2xl bg-cover bg-center" style={{ backgroundImage: p.cover.startsWith("linear") ? p.cover : `url(${p.cover})` }} />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} className={ghost}>رفع صورة</button>
            {covers.map((c) => <button key={c} type="button" onClick={() => setP({ ...p, cover: c })} className={`h-8 w-8 rounded-lg ${p.cover === c ? "ring-2 ring-sky-500 ring-offset-2" : ""}`} style={{ background: c }} aria-label="غلاف جاهز" />)}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setP({ ...p, cover: URL.createObjectURL(f) }); }} />
          </div>
        </div>
        <label className="block text-xs font-bold text-slate-600">العنوان <span className={`font-normal ${p.title.length > 60 ? "text-rose-600" : "text-slate-400"}`}>({p.title.length}/60)</span>
          <input className={`${input} mt-1`} value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} placeholder="مثال: أفضل وجهات شهر العسل في 2026" />
        </label>
        <label className="block text-xs font-bold text-slate-600">نص المقال
          <textarea className={`${input} mt-1 min-h-40 leading-relaxed`} value={p.body} onChange={(e) => setP({ ...p, body: e.target.value })} placeholder="اكتب المقال هنا..." />
        </label>
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="mb-2 text-[11px] font-bold text-slate-500">معاينة الظهور في جوجل</p>
          <p className="text-[12px] text-emerald-700" dir="ltr">alsaqr-travel.sa › blog › <span dir="rtl">{slug}</span></p>
          <p className="mt-0.5 text-base text-[#1a0dab]">{p.title || "عنوان المقال"} | {AGENCY}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{desc}{p.body.length > 155 ? "..." : ""}</p>
        </div>
        {err && <p className="text-xs font-bold text-rose-600">{err}</p>}
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" onClick={() => submit(false)} className={ghost}>حفظ كمسودة</button>
          <button type="button" onClick={() => submit(true)} className={primary}>نشر المقال</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Cta() {
  return (
    <div className="mt-8 rounded-2xl border border-sky-200 bg-white p-6 text-center sm:p-8">
      <h3 className="text-xl font-extrabold text-[#082f49] sm:text-2xl">جاهزين نشغّلها لـ {AGENCY}؟</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">هذي نسخة عرض، والنسخة الحقيقية نربطها بموقعكم وواتساب المكتب والشات بوت على خدماتكم وأسعاركم الحقيقية.</p>
      <a href={whatsappLink(`مرحباً، شفت لوحة التحكم التجريبية لـ ${AGENCY} وأبغى أعرف أكثر`)} target="_blank" rel="noopener noreferrer" className={`${dark} mt-5 px-8 py-3.5 text-sm`}>تواصل معنا على واتساب</a>
    </div>
  );
}
