"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";
import { whatsappLink } from "@/lib/site";
import {
  categories, FIRM, FIRM_SHORT, FIRST_WEEKDAY, initialAppointments, keywords, leadsByCategory, modes, MONTH, MONTH_DAYS, monthlyVisitors, regions, sources, statusMeta, TODAY,
  type Appointment, type Category, type Mode, type Status,
} from "./data";

type Tab = "overview" | "appointments" | "clients" | "seo";

const icons: Record<Tab, string> = {
  overview: "M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z",
  appointments: "M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm4 9 2 2 4-4",
  clients: "M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm13 9v-1a4 4 0 0 0-3-3.9M16 4.1a3 3 0 0 1 0 5.8",
  seo: "M4 20V10m6 10V4m6 16v-7m4 7H2",
};

const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "نظرة عامة" },
  { id: "appointments", label: "المواعيد والاستشارات" },
  { id: "clients", label: "إدارة العملاء" },
  { id: "seo", label: "تحليل SEO وأداء الموقع" },
];

const weekdays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const shortDays = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
const card = "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_-20px_rgba(15,31,61,0.35)] sm:p-6";
const btn = "inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition active:scale-[0.98]";
const primary = `${btn} bg-[#0f1f3d] text-white hover:bg-[#162b52]`;
const gold = `${btn} bg-gradient-to-l from-[#b08d57] to-[#c9a96e] text-white shadow-md shadow-[#b08d57]/25 hover:brightness-105`;
const ghost = `${btn} border border-slate-200 text-slate-700 hover:border-[#b08d57] hover:text-[#8a6a3a]`;
const mins = (t: string) => {
  const [h, m] = t.split(" ")[0].split(":").map(Number);
  return ((h % 12) + (t.endsWith("م") ? 12 : 0)) * 60 + m;
};
const byTime = (p: Appointment, q: Appointment) => p.day - q.day || mins(p.time) - mins(q.time);
const dayLabel = (d: number) => (d === TODAY ? "اليوم" : d === TODAY + 1 ? "غداً" : `${d} نوفمبر`);

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
        <h3 className="text-base text-[#0f1f3d] sm:text-lg">{children}</h3>
        {sub && <p className="text-xs text-slate-500">{sub}</p>}
      </div>
      {end}
    </div>
  );
}

function Chip({ s }: { s: Status }) {
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusMeta[s].chip}`}><span className={`h-1.5 w-1.5 rounded-full ${statusMeta[s].dot}`} />{statusMeta[s].label}</span>;
}

function Kpi({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: string }) {
  return (
    <div className={card}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-slate-500">{label}</p>
        <span className="rounded-xl bg-[#b08d57]/10 p-2 text-[#8a6a3a]"><Icon d={icon} className="h-4 w-4" /></span>
      </div>
      <b className="mt-1 block font-display text-2xl text-[#0f1f3d] sm:text-3xl">{value}</b>
      <p className="mt-1 text-xs font-bold text-emerald-700">{sub}</p>
    </div>
  );
}

function Bars({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values);
  return (
    <div className="flex h-48 items-end gap-2 sm:gap-4">
      {values.map((v, i) => (
        <div key={labels[i]} className="group flex h-full flex-1 flex-col items-center gap-1.5">
          <span className="text-[10px] font-bold text-[#8a6a3a]">{v.toLocaleString("en-US")}</span>
          <div className="relative w-full flex-1">
            <motion.div initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }} transition={{ duration: 0.7, delay: i * 0.05 }} className={`absolute inset-x-0 bottom-0 rounded-t-lg ${i === values.length - 1 ? "bg-gradient-to-t from-[#9a7748] to-[#c9a96e]" : "bg-[#0f1f3d]/85 group-hover:bg-[#0f1f3d]"}`} />
          </div>
          <span className="text-[10px] text-slate-500">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function Meter({ label, value, max = 100, suffix = "%" }: { label: string; value: number; max?: number; suffix?: string }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs"><span className="text-slate-600">{label}</span><b className="text-[#0f1f3d]">{value}{suffix}</b></div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <motion.div initial={{ width: 0 }} animate={{ width: `${(value / max) * 100}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-l from-[#0f1f3d] to-[#b08d57]" />
      </div>
    </div>
  );
}

export function LawDemo() {
  const [tab, setTab] = useState<Tab>("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [appts, setAppts] = useState<Appointment[]>(initialAppointments);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const nextId = useRef(128);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const notify = useCallback((t: string) => {
    setToast(t);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  const go = (t: Tab) => {
    setTab(t);
    setDrawer(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setStatus = (id: string, s: Status) => {
    setAppts((as) => as.map((x) => (x.id === id ? { ...x, status: s } : x)));
    notify(s === "confirmed" ? "تم تأكيد الموعد — وصل العميل تأكيد ورابط الموقع على الواتساب" : s === "completed" ? "تم تسجيل الاستشارة كمكتملة" : s === "cancelled" ? "تم إلغاء الموعد وإبلاغ العميل" : "تم تحديث الحالة");
  };

  const add = (x: Omit<Appointment, "id" | "status" | "source">) => {
    const id = `A-${nextId.current++}`;
    setAppts((as) => [...as, { ...x, id, status: "confirmed", source: "website" }]);
    setAdding(false);
    notify(`تم إضافة موعد ${x.client} (${dayLabel(x.day)} ${x.time}) — أُرسل تذكير تلقائي للعميل`);
  };

  const current = tabs.find((t) => t.id === tab)!;

  const nav = (compact: boolean) => (
    <nav className="mt-8 space-y-1.5">
      {tabs.map((t) => (
        <button key={t.id} type="button" onClick={() => go(t.id)} title={t.label} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition ${compact ? "justify-center" : ""} ${tab === t.id ? "bg-white text-[#0f1f3d] shadow-lg" : "text-slate-300 hover:bg-white/10"}`}>
          <Icon d={icons[t.id]} />
          {!compact && <span className="flex-1 text-start">{t.label}</span>}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f6f5f1] text-slate-800" style={{ colorScheme: "light" }}>
      <div className="bg-[#0f1f3d] px-4 py-2 text-center text-[11px] font-bold text-[#e6d3ae] sm:text-xs">
        عرض تجريبي مقدّم من آثر ديجيتال — جميع الأسماء والأرقام توضيحية
      </div>

      <div className="flex">
        <aside className={`sticky top-0 hidden h-screen shrink-0 flex-col bg-[#0f1f3d] p-4 text-white transition-[width] duration-300 lg:flex ${collapsed ? "w-20" : "w-72"}`}>
          <Brand compact={collapsed} />
          {nav(collapsed)}
          <button type="button" onClick={() => setCollapsed((c) => !c)} className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-xs text-slate-300 hover:bg-white/5" aria-label={collapsed ? "توسيع القائمة" : "طي القائمة"}>
            <Icon d={collapsed ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} className="h-4 w-4" />
            {!collapsed && "طي القائمة"}
          </button>
        </aside>

        <AnimatePresence>
          {drawer && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} className="fixed inset-0 z-40 bg-[#0f1f3d]/50 backdrop-blur-sm lg:hidden" />
              <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.25 }} className="fixed inset-y-0 start-0 z-50 flex w-72 flex-col bg-[#0f1f3d] p-4 text-white lg:hidden">
                <div className="flex items-start justify-between"><Brand /><button type="button" onClick={() => setDrawer(false)} className="p-1 text-slate-300" aria-label="إغلاق القائمة"><Icon d="M18 6 6 18M6 6l12 12" /></button></div>
                {nav(false)}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setDrawer(true)} className="rounded-xl border border-slate-200 p-2 text-[#0f1f3d] lg:hidden" aria-label="فتح القائمة"><Icon d="M4 6h16M4 12h16M4 18h16" /></button>
                <div>
                  <h1 className="text-lg text-[#0f1f3d] sm:text-xl">{current.label}</h1>
                  <p className="text-[11px] text-slate-500 sm:text-xs">{FIRM}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 sm:flex"><Icon d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" className="h-3.5 w-3.5" /> اتصال آمن ومشفّر</span>
                <button type="button" onClick={() => setAdding(true)} className={gold}><Icon d="M12 5v14M5 12h14" className="h-4 w-4" /><span className="hidden sm:inline">موعد جديد</span></button>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:py-8">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
                {tab === "overview" && <Overview appts={appts} go={go} onAdd={() => setAdding(true)} setStatus={setStatus} />}
                {tab === "appointments" && <Appointments appts={appts} setStatus={setStatus} onAdd={() => setAdding(true)} />}
                {tab === "clients" && <Clients appts={appts} />}
                {tab === "seo" && <Seo />}
              </motion.div>
            </AnimatePresence>
            <Cta />
            <p className="mt-8 text-center text-[11px] text-slate-400">صُممت هذه المنصة التجريبية لـ {FIRM} بواسطة آثر ديجيتال • لا تتضمن أي بيانات قضايا أو مستندات قانونية • الأرقام للعرض فقط</p>
          </main>
        </div>
      </div>

      <AnimatePresence>{adding && <AddModal onClose={() => setAdding(false)} onSave={add} />}</AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="fixed inset-x-4 bottom-5 z-[60] mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-[#0f1f3d] p-4 text-sm text-white shadow-2xl">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#b08d57]"><Icon d="m5 12 5 5L20 7" className="h-4 w-4" /></span>
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
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#c9a96e]/60 bg-gradient-to-br from-[#b08d57] to-[#8a6a3a] font-display text-lg text-white">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0L5 7Zm14 0-3 7a3 3 0 0 0 6 0l-3-7Z" /></svg>
      </span>
      {!compact && (
        <div>
          <p className="font-display text-base leading-tight text-white">{FIRM_SHORT}</p>
          <p className="text-[11px] text-[#e6d3ae]">محاماة واستشارات قانونية</p>
        </div>
      )}
    </div>
  );
}

function ApptRow({ x, setStatus }: { x: Appointment; setStatus: (id: string, s: Status) => void }) {
  return (
    <li className="flex flex-wrap items-center gap-3 py-3.5">
      <div className="w-16 shrink-0 text-center">
        <b className="block text-sm text-[#0f1f3d]">{x.time}</b>
        <span className="text-[10px] text-slate-500">{dayLabel(x.day)}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-[#0f1f3d]">{x.client}</p>
        <p className="text-[11px] text-slate-500">{categories[x.category]} • {modes[x.mode]}</p>
      </div>
      <Chip s={x.status} />
      <div className="flex w-full gap-2 sm:w-auto">
        {x.status === "pending" && <button type="button" onClick={() => setStatus(x.id, "confirmed")} className={primary}>تأكيد</button>}
        {x.status === "confirmed" && <button type="button" onClick={() => setStatus(x.id, "completed")} className={ghost}>تمت الاستشارة</button>}
        {(x.status === "pending" || x.status === "confirmed") && <button type="button" onClick={() => setStatus(x.id, "cancelled")} className="px-2 text-[11px] font-bold text-slate-400 hover:text-rose-600">إلغاء</button>}
      </div>
    </li>
  );
}

function Overview({ appts, go, onAdd, setStatus }: { appts: Appointment[]; go: (t: Tab) => void; onAdd: () => void; setStatus: (id: string, s: Status) => void }) {
  const today = appts.filter((x) => x.day === TODAY && x.status !== "cancelled").sort(byTime);
  const month = appts.filter((x) => x.status !== "cancelled").length + 71;
  const pending = appts.filter((x) => x.status === "pending").length;
  const todayPending = today.filter((x) => x.status === "pending").length;
  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl bg-[#0f1f3d] p-6 text-white sm:p-8">
        <div aria-hidden className="absolute -start-16 -top-24 h-64 w-64 rounded-full bg-[#b08d57]/25 blur-3xl" />
        <p className="relative text-sm text-[#e6d3ae]">صباح الخير، أ. ريم</p>
        <h2 className="relative mt-2 max-w-2xl text-2xl leading-snug sm:text-3xl">عندك اليوم {today.length} مواعيد استشارة{pending ? `، و${pending} طلبات تنتظر تأكيدك` : ""}.</h2>
        <div className="relative mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={onAdd} className={gold}><Icon d="M12 5v14M5 12h14" className="h-4 w-4" /> إضافة موعد جديد</button>
          <button type="button" onClick={() => go("seo")} className={`${btn} border border-white/25 text-white hover:bg-white/10`}>عرض تقرير SEO</button>
          <button type="button" onClick={() => go("clients")} className={`${btn} border border-white/25 text-white hover:bg-white/10`}>دليل العملاء</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Kpi label="استشارات هذا الشهر" value={String(month)} sub="▲ 18% عن الشهر الماضي" icon={icons.appointments} />
        <Kpi label="مواعيد اليوم" value={String(today.length)} sub={todayPending ? `${todayPending} بانتظار التأكيد` : "كلها مؤكدة"} icon="M12 8v4l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <Kpi label="عملاء جدد هذا الشهر" value="23" sub="▲ 9 عن الشهر الماضي" icon={icons.clients} />
        <Kpi label="زيارات الموقع" value="12.4K" sub="▲ 15% • 342 طلب استشارة" icon={icons.seo} />
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        <div className={`${card} xl:col-span-3`}>
          <Title sub={`${MONTH} • ${dayLabel(TODAY)}`} end={<button type="button" onClick={() => go("appointments")} className="text-xs font-bold text-[#8a6a3a]">كل المواعيد ←</button>}>مواعيد اليوم</Title>
          <ul className="divide-y divide-slate-100">
            {today.map((x) => <ApptRow key={x.id} x={x} setStatus={setStatus} />)}
            {today.length === 0 && <li className="py-8 text-center text-sm text-slate-400">لا توجد مواعيد اليوم</li>}
          </ul>
        </div>
        <div className={`${card} xl:col-span-2`}>
          <Title sub="من نماذج الموقع وجوجل والواتساب — آخر 30 يوم">طلبات الاستشارة الواردة</Title>
          <div className="mb-5 grid grid-cols-3 gap-2 text-center">
            {[["342", "طلب جديد"], ["41%", "تحوّل لموعد"], ["7 د", "متوسط الرد"]].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-[#f6f5f1] p-3"><b className="block font-display text-xl text-[#0f1f3d]">{v}</b><span className="text-[10px] text-slate-500">{l}</span></div>
            ))}
          </div>
          <div className="space-y-3.5">{leadsByCategory.map((l) => <Meter key={l.category} label={categories[l.category]} value={l.value} />)}</div>
        </div>
      </div>
    </div>
  );
}

function Appointments({ appts, setStatus, onAdd }: { appts: Appointment[]; setStatus: (id: string, s: Status) => void; onAdd: () => void }) {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [day, setDay] = useState(TODAY);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [q, setQ] = useState("");
  const byDay = useMemo(() => {
    const m: Record<number, Appointment[]> = {};
    appts.forEach((x) => (m[x.day] ??= []).push(x));
    return m;
  }, [appts]);
  const list = appts
    .filter((x) => (filter === "all" || x.status === filter) && x.client.includes(q.trim()))
    .sort(byTime);
  const counts = (s: Status) => appts.filter((x) => x.status === s).length;
  const cells = [...Array(FIRST_WEEKDAY).fill(null), ...Array.from({ length: MONTH_DAYS }, (_, i) => i + 1)];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(Object.keys(statusMeta) as Status[]).map((s) => (
          <button key={s} type="button" onClick={() => { setFilter(filter === s ? "all" : s); setView("list"); }} className={`${card} !p-4 text-start transition ${filter === s ? "ring-2 ring-[#b08d57]" : ""}`}>
            <Chip s={s} />
            <b className="mt-2 block font-display text-2xl text-[#0f1f3d]">{counts(s)}</b>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
          {(["calendar", "list"] as const).map((v) => (
            <button key={v} type="button" onClick={() => setView(v)} className={`rounded-lg px-4 py-2 text-xs font-bold transition ${view === v ? "bg-[#0f1f3d] text-white" : "text-slate-600"}`}>{v === "calendar" ? "التقويم" : "القائمة"}</button>
          ))}
        </div>
        <button type="button" onClick={onAdd} className={gold}><Icon d="M12 5v14M5 12h14" className="h-4 w-4" /> إضافة موعد</button>
      </div>

      {view === "calendar" ? (
        <div className="grid gap-5 xl:grid-cols-5">
          <div className={`${card} xl:col-span-3`}>
            <Title sub="اضغط على أي يوم لعرض مواعيده">{MONTH}</Title>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 sm:gap-2 sm:text-xs">
              {weekdays.map((w, i) => <span key={w} className="py-1"><span className="sm:hidden">{shortDays[i]}</span><span className="hidden sm:inline">{w}</span></span>)}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1 sm:gap-2">
              {cells.map((d, i) => {
                if (!d) return <span key={`e${i}`} />;
                const items = (byDay[d] ?? []).filter((x) => x.status !== "cancelled");
                const isFri = (FIRST_WEEKDAY + d - 1) % 7 === 5;
                return (
                  <button key={d} type="button" onClick={() => setDay(d)} className={`flex aspect-square flex-col items-center justify-start rounded-xl border p-1 text-xs transition sm:aspect-auto sm:h-20 sm:items-start sm:p-2 ${d === day ? "border-[#b08d57] bg-[#b08d57]/10" : "border-slate-100 hover:border-slate-300"} ${isFri ? "bg-slate-50 text-slate-400" : ""}`}>
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full font-bold ${d === TODAY ? "bg-[#0f1f3d] text-white" : "text-[#0f1f3d]"}`}>{d}</span>
                    {items.length > 0 && (
                      <>
                        <span className="mt-auto flex gap-0.5 sm:hidden">{items.slice(0, 3).map((x) => <span key={x.id} className={`h-1.5 w-1.5 rounded-full ${statusMeta[x.status].dot}`} />)}</span>
                        <span className="mt-1 hidden w-full truncate rounded-md bg-[#0f1f3d]/90 px-1.5 py-0.5 text-start text-[10px] text-white sm:block">{items.length} {items.length === 1 ? "موعد" : "مواعيد"}</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-slate-500">
              {(Object.keys(statusMeta) as Status[]).map((s) => <span key={s} className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${statusMeta[s].dot}`} />{statusMeta[s].label}</span>)}
            </div>
          </div>
          <div className={`${card} xl:col-span-2`}>
            <Title sub={`${(byDay[day] ?? []).length} مواعيد`}>{dayLabel(day)}</Title>
            <ul className="divide-y divide-slate-100">
              {(byDay[day] ?? []).sort(byTime).map((x) => <ApptRow key={x.id} x={x} setStatus={setStatus} />)}
              {!(byDay[day] ?? []).length && <li className="py-10 text-center text-sm text-slate-400">لا توجد مواعيد في هذا اليوم</li>}
            </ul>
          </div>
        </div>
      ) : (
        <div className={card}>
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث باسم العميل..." className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#b08d57] focus:outline-none sm:max-w-xs" />
            <div className="flex gap-2 overflow-x-auto">
              {(["all", ...Object.keys(statusMeta)] as (Status | "all")[]).map((s) => (
                <button key={s} type="button" onClick={() => setFilter(s)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold ${filter === s ? "bg-[#0f1f3d] text-white" : "bg-slate-100 text-slate-600"}`}>{s === "all" ? "الكل" : statusMeta[s].label}</button>
              ))}
            </div>
          </div>
          <ul className="divide-y divide-slate-100">
            {list.map((x) => <ApptRow key={x.id} x={x} setStatus={setStatus} />)}
            {list.length === 0 && <li className="py-8 text-center text-sm text-slate-400">لا توجد مواعيد بهذا الفلتر</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

type ClientRow = { name: string; phone: string; email: string; items: Appointment[]; last: Appointment };

function Clients({ appts }: { appts: Appointment[] }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const clients = useMemo(() => {
    const m = new Map<string, Appointment[]>();
    appts.forEach((x) => m.set(x.client, [...(m.get(x.client) ?? []), x]));
    return [...m.entries()].map(([name, items]): ClientRow => {
      const sorted = [...items].sort((p, r) => r.day - p.day);
      return { name, phone: items[0].phone, email: items[0].email, items: sorted, last: sorted[0] };
    }).sort((p, r) => r.last.day - p.last.day);
  }, [appts]);
  const shown = clients.filter((c) => c.name.includes(q.trim()) || c.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")));
  const sel = clients.find((c) => c.name === open);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Kpi label="إجمالي العملاء" value={String(clients.length + 148)} sub="في قاعدة البيانات" icon={icons.clients} />
        <Kpi label="عملاء متكررون" value="38%" sub="حجزوا أكثر من استشارة" icon="M4 4v5h5M20 20v-5h-5M5.5 15A7 7 0 0 0 18 17M18.5 9A7 7 0 0 0 6 7" />
        <Kpi label="من الموقع وجوجل" value="64%" sub="مصدر العملاء الجدد" icon={icons.seo} />
      </div>
      <div className={card}>
        <Title sub="بيانات تواصل وسجل مواعيد فقط — بدون أي تفاصيل قضايا" end={<span className="hidden items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 sm:flex"><Icon d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" className="h-3 w-3" /> بيانات مشفّرة</span>}>دليل العملاء</Title>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث بالاسم أو رقم الجوال..." className="mb-3 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#b08d57] focus:outline-none sm:max-w-sm" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-start text-[11px] text-slate-500">
                {["العميل", "الجوال", "البريد الإلكتروني", "آخر موعد", "عدد الاستشارات", ""].map((h) => <th key={h} className="px-2 py-2.5 text-start font-bold">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shown.map((c) => (
                <tr key={c.name} onClick={() => setOpen(c.name)} className="cursor-pointer hover:bg-[#f6f5f1]">
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0f1f3d] text-xs font-bold text-[#e6d3ae]">{c.name.charAt(0)}</span>
                      <b className="text-[#0f1f3d]">{c.name}</b>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-slate-600" dir="ltr">{c.phone}</td>
                  <td className="px-2 py-3 text-slate-600" dir="ltr">{c.email}</td>
                  <td className="px-2 py-3 text-slate-600">{dayLabel(c.last.day)}</td>
                  <td className="px-2 py-3"><span className="rounded-full bg-[#b08d57]/10 px-2.5 py-0.5 text-xs font-bold text-[#8a6a3a]">{c.items.length}</span></td>
                  <td className="px-2 py-3 text-xs font-bold text-[#8a6a3a]">عرض ←</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {sel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-[#0f1f3d]/50 p-4 backdrop-blur-sm sm:items-center" onClick={() => setOpen(null)}>
            <motion.div initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} onClick={(e) => e.stopPropagation()} className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f1f3d] font-bold text-[#e6d3ae]">{sel.name.charAt(0)}</span>
                  <div><p className="font-display text-lg text-[#0f1f3d]">{sel.name}</p><p className="text-xs text-slate-500">عميل منذ {sel.items[sel.items.length - 1].day} نوفمبر • المصدر: {sources[sel.items[0].source]}</p></div>
                </div>
                <button type="button" onClick={() => setOpen(null)} className="text-slate-400" aria-label="إغلاق"><Icon d="M18 6 6 18M6 6l12 12" /></button>
              </div>
              <div className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                <a href={`tel:${sel.phone.replace(/\s/g, "")}`} className="rounded-xl bg-[#f6f5f1] p-3"><span className="block text-[10px] text-slate-500">الجوال</span><b dir="ltr" className="text-[#0f1f3d]">{sel.phone}</b></a>
                <a href={`mailto:${sel.email}`} className="rounded-xl bg-[#f6f5f1] p-3"><span className="block text-[10px] text-slate-500">البريد</span><b dir="ltr" className="text-[#0f1f3d]">{sel.email}</b></a>
              </div>
              <h4 className="mt-6 text-sm text-[#0f1f3d]">سجل المواعيد والاستشارات</h4>
              <ol className="mt-3 space-y-3 border-s-2 border-[#b08d57]/30 ps-4">
                {sel.items.map((x) => (
                  <li key={x.id} className="relative">
                    <span className={`absolute -start-[1.4rem] top-1.5 h-2.5 w-2.5 rounded-full ${statusMeta[x.status].dot}`} />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <b className="text-sm text-[#0f1f3d]">{dayLabel(x.day)} • {x.time}</b>
                      <Chip s={x.status} />
                    </div>
                    <p className="text-xs text-slate-500">استشارة {categories[x.category]} • {modes[x.mode]}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-5 rounded-xl bg-amber-50 p-3 text-[11px] text-amber-800">🔒 للحفاظ على سرية العملاء، اللوحة لا تحفظ أي تفاصيل قضايا أو مستندات — بيانات التواصل والمواعيد فقط.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Seo() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Kpi label="زوار الموقع هذا الشهر" value="12.4K" sub="▲ 15% عن أكتوبر" icon={icons.seo} />
        <Kpi label="الظهور في جوجل" value="186K" sub="▲ 42% مرات الظهور" icon="M21 21l-4.3-4.3M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
        <Kpi label="طلبات من نموذج الموقع" value="342" sub="▲ 27% هذا الشهر" icon={icons.appointments} />
        <Kpi label="سرعة الموقع" value="96/100" sub="ممتاز على الجوال" icon="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
      </div>
      <div className="grid gap-5 xl:grid-cols-5">
        <div className={`${card} xl:col-span-3`}>
          <Title sub="عدد الزوار الشهري — آخر 6 أشهر">نمو زيارات الموقع</Title>
          <Bars values={monthlyVisitors.values} labels={monthlyVisitors.labels} />
        </div>
        <div className={`${card} xl:col-span-2`}>
          <Title sub="من وين يجون الزوار داخل المملكة">التوزيع الجغرافي</Title>
          <div className="space-y-3.5">{regions.map((r) => <Meter key={r.name} label={r.name} value={r.value} />)}</div>
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-5">
        <div className={`${card} xl:col-span-3`}>
          <Title sub="ترتيب الموقع في جوجل للكلمات القانونية المستهدفة">أداء الكلمات المفتاحية</Title>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px] text-sm">
              <thead><tr className="border-b border-slate-200 text-[11px] text-slate-500">{["الكلمة", "البحث الشهري", "قبل", "الآن"].map((h) => <th key={h} className="px-2 py-2 text-start font-bold">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100">
                {keywords.map((k) => (
                  <tr key={k.k}>
                    <td className="px-2 py-3 font-bold text-[#0f1f3d]">{k.k}</td>
                    <td className="px-2 py-3 text-slate-500">{k.volume}</td>
                    <td className="px-2 py-3 text-slate-400 line-through">#{k.before}</td>
                    <td className="px-2 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${k.now <= 3 ? "bg-[#b08d57] text-white" : "bg-[#0f1f3d]/10 text-[#0f1f3d]"}`}>#{k.now}</span> <span className="text-[11px] font-bold text-emerald-700">▲ {k.before - k.now}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={`${card} xl:col-span-2`}>
          <Title sub="آخر 30 يوم">ملخص العملاء المحتملين من الموقع</Title>
          <ul className="space-y-3">
            {[["نموذج طلب استشارة", 214], ["زر الواتساب في الموقع", 87], ["الاتصال من خرائط جوجل", 41]].map(([l, v]) => (
              <li key={l} className="flex items-center justify-between rounded-xl bg-[#f6f5f1] px-4 py-3 text-sm"><span>{l}</span><b className="font-display text-lg text-[#0f1f3d]">{v}</b></li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl border border-[#b08d57]/30 bg-[#b08d57]/5 p-4">
            <p className="text-xs text-slate-600">نسبة تحويل الزوار إلى طلب استشارة</p>
            <b className="font-display text-3xl text-[#0f1f3d]">2.8%</b>
            <p className="text-[11px] text-emerald-700">▲ من 1.1% قبل تحسين الموقع</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddModal({ onClose, onSave }: { onClose: () => void; onSave: (x: Omit<Appointment, "id" | "status" | "source">) => void }) {
  const [f, setF] = useState({ client: "", phone: "", email: "", category: "labor" as Category, mode: "office" as Mode, day: TODAY + 1, time: "11:00 ص" });
  const [err, setErr] = useState<string | null>(null);
  const input = "w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#b08d57] focus:outline-none";
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (f.client.trim().length < 3) return setErr("اكتب اسم العميل");
    if (!/^05\d{8}$/.test(f.phone.replace(/\s/g, ""))) return setErr("رقم الجوال لازم يبدأ بـ 05 ويتكون من 10 أرقام");
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) return setErr("البريد الإلكتروني غير صحيح");
    onSave({ ...f, client: f.client.trim(), email: f.email || "—" });
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-[#0f1f3d]/50 p-4 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <motion.form initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} onClick={(e) => e.stopPropagation()} onSubmit={submit} className="max-h-[90vh] w-full max-w-lg space-y-3 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between"><h3 className="text-lg text-[#0f1f3d]">موعد استشارة جديد</h3><button type="button" onClick={onClose} className="text-slate-400" aria-label="إغلاق"><Icon d="M18 6 6 18M6 6l12 12" /></button></div>
        <label className="block text-xs font-bold text-slate-600">اسم العميل<input className={`${input} mt-1`} value={f.client} onChange={(e) => setF({ ...f, client: e.target.value })} /></label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-bold text-slate-600">الجوال<input className={`${input} mt-1`} dir="ltr" inputMode="tel" placeholder="05XXXXXXXX" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
          <label className="block text-xs font-bold text-slate-600">البريد الإلكتروني<input className={`${input} mt-1`} dir="ltr" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-bold text-slate-600">تصنيف الاستشارة<select className={`${input} mt-1`} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as Category })}>{(Object.keys(categories) as Category[]).map((c) => <option key={c} value={c}>{categories[c]}</option>)}</select></label>
          <label className="block text-xs font-bold text-slate-600">نوع الموعد<select className={`${input} mt-1`} value={f.mode} onChange={(e) => setF({ ...f, mode: e.target.value as Mode })}>{(Object.keys(modes) as Mode[]).map((m) => <option key={m} value={m}>{modes[m]}</option>)}</select></label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-bold text-slate-600">اليوم ({MONTH})<select className={`${input} mt-1`} value={f.day} onChange={(e) => setF({ ...f, day: Number(e.target.value) })}>{Array.from({ length: MONTH_DAYS - TODAY + 1 }, (_, i) => TODAY + i).map((d) => <option key={d} value={d}>{dayLabel(d)}</option>)}</select></label>
          <label className="block text-xs font-bold text-slate-600">الوقت<select className={`${input} mt-1`} value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })}>{["9:00 ص", "10:00 ص", "11:00 ص", "12:00 م", "1:00 م", "4:00 م", "5:00 م", "6:00 م", "7:00 م", "8:00 م"].map((t) => <option key={t}>{t}</option>)}</select></label>
        </div>
        <p className="rounded-xl bg-[#f6f5f1] p-3 text-[11px] text-slate-500">🔒 نسجل بيانات التواصل وتصنيف الاستشارة فقط. لا تكتب أي تفاصيل عن القضية هنا.</p>
        {err && <p className="text-xs font-bold text-rose-600">{err}</p>}
        <button type="submit" className={`${gold} w-full py-3 text-sm`}>حفظ الموعد وإرسال التأكيد</button>
      </motion.form>
    </motion.div>
  );
}

function Cta() {
  return (
    <div className="mt-8 rounded-2xl border border-[#b08d57]/30 bg-white p-6 text-center sm:p-8">
      <h3 className="text-xl text-[#0f1f3d] sm:text-2xl">جاهزين نشغّلها لمكتبكم؟</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">هذي نسخة عرض، والنسخة الحقيقية نربطها بنموذج حجز الاستشارات في موقعكم والواتساب، مع حماية كاملة لبيانات العملاء.</p>
      <a href={whatsappLink(`مرحباً، شفت لوحة التحكم التجريبية لـ ${FIRM} وأبغى أعرف أكثر`)} target="_blank" rel="noopener noreferrer" className={`${primary} mt-5 px-8 py-3.5 text-sm`}>تواصل معنا على واتساب</a>
    </div>
  );
}
