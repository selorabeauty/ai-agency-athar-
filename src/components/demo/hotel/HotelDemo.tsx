"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { whatsappLink } from "@/lib/site";
import { Bars, Donut, Line, Ring, Spark } from "./charts";
import {
  activity, assistantScripts, bookingStatus, HOTEL, incoming, initialBookings, initialRooms, months, occupancy, revenue, reviews, roomStatus, roomTypes, sourceMix, sources,
  type Booking, type BookingStatus, type Room, type RoomStatus,
} from "./data";

type Tab = "overview" | "bookings" | "rooms" | "assistant" | "reputation" | "analytics" | "why";

const icons: Record<Tab, string> = {
  overview: "M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z",
  bookings: "M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm4 9 2 2 4-4",
  rooms: "M3 20V8l9-5 9 5v12M9 20v-6h6v6M3 20h18",
  assistant: "M8 10h.01M12 10h.01M16 10h.01M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12Z",
  reputation: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z",
  analytics: "M4 20V10m6 10V4m6 16v-7m4 7H2",
  why: "M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Zm-3-11 2 2 4-4",
};

const tabs: { id: Tab; label: string; short: string }[] = [
  { id: "overview", label: "لوحة التحكم الذكية", short: "الرئيسية" },
  { id: "bookings", label: "إدارة الحجوزات الفورية", short: "الحجوزات" },
  { id: "rooms", label: "حالة الغرف والأجنحة", short: "الغرف" },
  { id: "assistant", label: "المساعد الذكي 24/7", short: "المساعد" },
  { id: "reputation", label: "الظهور والسمعة", short: "السمعة" },
  { id: "analytics", label: "تحليلات النمو والنجاح", short: "التحليلات" },
  { id: "why", label: `لماذا ${HOTEL}؟`, short: "لماذا نحن" },
];

const sar = (n: number) => `${n.toLocaleString("en-US")} ر.س`;
const card = "rounded-3xl border border-violet-100 bg-white p-5 shadow-[0_10px_40px_-24px_rgba(76,29,149,0.35)] sm:p-6";
const btn = "inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-bold transition";
const primary = `${btn} bg-gradient-to-l from-violet-700 to-fuchsia-600 text-white shadow-md shadow-violet-300 hover:brightness-110`;
const ghost = `${btn} border border-violet-200 text-violet-700 hover:bg-violet-50`;

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function Stars({ n, className = "text-amber-400" }: { n: number; className?: string }) {
  return (
    <span className={className} aria-label={`${n} من 5`}>
      {"★★★★★".slice(0, Math.round(n))}
      <span className="text-slate-200">{"★★★★★".slice(Math.round(n))}</span>
    </span>
  );
}

function Kpi({ label, value, delta, spark, className = "" }: { label: string; value: string; delta?: string; spark?: number[]; className?: string }) {
  return (
    <div className={`${card} ${className}`}>
      <p className="text-xs text-slate-500">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <b className="font-display text-2xl text-slate-900 sm:text-[1.7rem]">{value}</b>
        {spark && <Spark values={spark} />}
      </div>
      {delta && <p className="mt-1 text-xs font-bold text-emerald-600">▲ {delta}</p>}
    </div>
  );
}

function Title({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-base text-slate-900 sm:text-lg">{children}</h3>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

type Msg = { from: "guest" | "bot"; text: string };

export function HotelDemo() {
  const [tab, setTab] = useState<Tab>("overview");
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [feed, setFeed] = useState<{ id: number; text: string; fresh?: boolean }[]>(activity.slice(0, 4).map((t, i) => ({ id: i, text: t })));
  const [toast, setToast] = useState<string | null>(null);
  const [unread, setUnread] = useState(2);
  const nextId = useRef(4823);
  const tick = useRef(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const main = useRef<HTMLDivElement>(null);

  const notify = useCallback((text: string) => {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3800);
  }, []);

  const pushFeed = useCallback((text: string) => setFeed((f) => [{ id: Date.now(), text, fresh: true }, ...f].slice(0, 7)), []);

  const addBooking = useCallback(
    (b: Omit<Booking, "id">, id?: string) => {
      const bid = id ?? `RL-${nextId.current++}`;
      setBookings((bs) => [{ ...b, id: bid }, ...bs]);
      setUnread((u) => u + 1);
      return bid;
    },
    [],
  );

  useEffect(() => {
    const t = setInterval(() => {
      tick.current += 1;
      const n = tick.current;
      if (n % 2 === 1 && (n - 1) / 2 < incoming.length) {
        const b = incoming[(n - 1) / 2];
        addBooking(b);
        notify(`حجز جديد عبر ${sources[b.source].label} — ${b.guest}`);
        pushFeed(`حجز جديد: ${b.guest} • ${b.room} • ${sar(b.amount)}`);
      } else {
        pushFeed(activity[(n + 3) % activity.length]);
      }
    }, 9000);
    return () => clearInterval(t);
  }, [addBooking, notify, pushFeed]);

  const go = (t: Tab) => {
    setTab(t);
    if (t === "bookings") setUnread(0);
    main.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const counts = useMemo(() => {
    const c: Record<RoomStatus, number> = { available: 0, occupied: 0, arriving: 0, cleaning: 0, maintenance: 0 };
    rooms.forEach((r) => c[r.status]++);
    return c;
  }, [rooms]);
  const occ = Math.round(((counts.occupied + counts.arriving) / rooms.length) * 100);

  const setBooking = (id: string, status: BookingStatus) => setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));

  const current = tabs.find((t) => t.id === tab)!;

  return (
    <div className="min-h-screen bg-[#f6f3ff] text-slate-800" style={{ colorScheme: "light" }}>
      <div className="bg-gradient-to-l from-violet-800 via-violet-700 to-fuchsia-600 px-4 py-2 text-center text-[11px] font-bold text-white sm:text-xs">
        ✨ عرض تجريبي حي مقدّم من آثر ديجيتال — جميع الأسماء والأرقام توضيحية
      </div>

      <div className="mx-auto flex max-w-[1500px]">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col bg-gradient-to-b from-[#2e1065] via-[#3b0f80] to-[#4c1d95] p-5 text-white lg:flex">
          <Brand />
          <nav className="mt-8 space-y-1.5">
            {tabs.map((t) => (
              <button key={t.id} type="button" onClick={() => go(t.id)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${tab === t.id ? "bg-white text-violet-800 shadow-lg" : "text-violet-100 hover:bg-white/10"}`}>
                <Icon d={icons[t.id]} />
                <span className="flex-1 text-start">{t.label}</span>
                {t.id === "bookings" && unread > 0 && <span className="rounded-full bg-fuchsia-500 px-2 text-[10px] text-white">{unread}</span>}
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl bg-white/10 p-4 text-xs">
            <p className="flex items-center gap-2 font-bold">
              <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" /></span>
              المساعد الذكي يعمل الآن
            </p>
            <p className="mt-1.5 text-violet-200">يرد على ضيوفك بالعربي والإنجليزي على مدار الساعة.</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-violet-100 bg-white/85 backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <div className="lg:hidden"><Brand dark /></div>
              <div className="hidden lg:block">
                <h1 className="text-xl text-slate-900">{current.label}</h1>
                <p className="text-xs text-slate-500">مرحباً بإدارة {HOTEL} • البيانات تتحدث لحظياً</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 sm:flex">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> مباشر
                </span>
                <button type="button" onClick={() => go("bookings")} className="relative rounded-full border border-violet-100 p-2 text-violet-700" aria-label="الإشعارات">
                  <Icon d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0" />
                  {unread > 0 && <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-fuchsia-600 px-1 text-[10px] font-bold text-white">{unread}</span>}
                </button>
              </div>
            </div>
            <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden" aria-label="الأقسام">
              {tabs.map((t) => (
                <button key={t.id} type="button" onClick={() => go(t.id)} className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ${tab === t.id ? "bg-violet-700 text-white shadow-md shadow-violet-300" : "bg-violet-50 text-violet-700"}`}>
                  <Icon d={icons[t.id]} className="h-4 w-4" />
                  {t.short}
                  {t.id === "bookings" && unread > 0 && <span className="rounded-full bg-fuchsia-500 px-1.5 text-[10px] text-white">{unread}</span>}
                </button>
              ))}
            </nav>
          </header>

          <div ref={main} className="scroll-mt-32 px-4 py-6 sm:px-6 lg:py-8">
            <h1 className="mb-5 text-xl text-slate-900 lg:hidden">{current.label}</h1>
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                {tab === "overview" && <Overview occ={occ} counts={counts} bookings={bookings} feed={feed} go={go} />}
                {tab === "bookings" && <Bookings bookings={bookings} setBooking={setBooking} addBooking={addBooking} notify={notify} />}
                {tab === "rooms" && <Rooms rooms={rooms} setRooms={setRooms} counts={counts} notify={notify} />}
                {tab === "assistant" && <Assistant onBook={() => { const id = addBooking({ guest: "ضيف واتساب", room: "جناح عائلي", nights: 2, date: "السبت", source: "ai", amount: 1780, status: "confirmed", guests: 4 }); notify(`المساعد الذكي أكّد حجزاً جديداً ${id} — بدون أي تدخل من الموظفين`); pushFeed(`المساعد الذكي أكّد الحجز ${id} تلقائياً`); return id; }} />}
                {tab === "reputation" && <Reputation notify={notify} />}
                {tab === "analytics" && <Analytics />}
                {tab === "why" && <Why />}
              </motion.div>
            </AnimatePresence>
            <p className="mt-10 text-center text-[11px] text-slate-400">صُممت هذه المنصة التجريبية لـ {HOTEL} بواسطة آثر ديجيتال • الأرقام للعرض فقط</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="fixed inset-x-4 bottom-5 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-[#2e1065] p-4 text-sm text-white shadow-2xl">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fuchsia-500">🔔</span>
            <span className="flex-1">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Brand({ dark }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-700 font-display text-xl font-extrabold text-white shadow-lg shadow-violet-900/30">ر</span>
      <div>
        <p className={`font-display text-lg font-extrabold leading-tight ${dark ? "text-slate-900" : "text-white"}`}>{HOTEL}</p>
        <p className={`text-[11px] ${dark ? "text-violet-600" : "text-violet-200"}`}>منصة الإدارة الذكية</p>
      </div>
    </div>
  );
}

function SourceTag({ s }: { s: Booking["source"] }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-600">
      <span className="h-2 w-2 rounded-full" style={{ background: sources[s].color }} />
      {sources[s].label}
    </span>
  );
}

function Overview({ occ, counts, bookings, feed, go }: { occ: number; counts: Record<RoomStatus, number>; bookings: Booking[]; feed: { id: number; text: string; fresh?: boolean }[]; go: (t: Tab) => void }) {
  const today = bookings.filter((b) => b.date === "اليوم").length + counts.arriving;
  const newCount = bookings.filter((b) => b.status === "new").length;
  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#3b0f80] via-violet-700 to-fuchsia-600 p-6 text-white sm:p-8">
        <div aria-hidden className="absolute -start-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <p className="text-sm text-violet-100">صباح الخير، إدارة {HOTEL} 👋</p>
        <h2 className="mt-2 max-w-xl text-2xl leading-snug sm:text-3xl">الليلة الإشغال {occ}%، وعندك {today} وصول و{newCount > 0 ? `${newCount} حجوزات جديدة تنتظر التأكيد` : "كل الحجوزات مؤكدة"}.</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => go("bookings")} className={`${btn} bg-white text-violet-800 hover:bg-violet-50`}>عرض الحجوزات</button>
          <button type="button" onClick={() => go("rooms")} className={`${btn} border border-white/40 text-white hover:bg-white/10`}>حالة الغرف</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <div className={`${card} col-span-2 flex items-center gap-4 sm:col-span-1`}>
          <Ring value={occ} label="إشغال" />
          <div>
            <p className="text-xs text-slate-500">نسبة الإشغال الليلة</p>
            <p className="mt-1 text-xs font-bold text-emerald-600">▲ 9% عن الأسبوع الماضي</p>
          </div>
        </div>
        <Kpi label="إيرادات اليوم" value={sar(18450)} delta="12% عن أمس" spark={[11, 13, 12, 15, 14, 17, 18]} />
        <Kpi label="حجوزات اليوم" value={String(9 + newCount)} delta="4 منها عبر المساعد الذكي" spark={[5, 7, 6, 8, 7, 9, 10]} />
        <Kpi label="متوسط سعر الليلة" value={sar(612)} delta="5% هذا الشهر" spark={[560, 575, 590, 584, 600, 605, 612]} className="col-span-2 sm:col-span-1" />
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        <div className={`${card} xl:col-span-3`}>
          <div className="flex items-center justify-between">
            <Title>آخر الحجوزات</Title>
            <button type="button" onClick={() => go("bookings")} className="text-xs font-bold text-violet-700">عرض الكل ←</button>
          </div>
          <ul className="divide-y divide-violet-50">
            {bookings.slice(0, 5).map((b) => (
              <motion.li layout key={b.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{b.guest}</p>
                  <p className="text-[11px] text-slate-500">{b.room} • {b.nights} ليالٍ • {b.date}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${bookingStatus[b.status].chip}`}>{bookingStatus[b.status].label}</span>
                  <span className="text-xs font-bold text-slate-700">{sar(b.amount)}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
        <div className={`${card} xl:col-span-2`}>
          <Title sub="يتحدث تلقائياً">النشاط المباشر</Title>
          <ul className="space-y-3">
            <AnimatePresence initial={false}>
              {feed.map((f) => (
                <motion.li key={f.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`flex gap-3 rounded-2xl p-3 text-xs leading-relaxed ${f.fresh ? "bg-violet-50" : ""}`}>
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                  <span className="text-slate-700">{f.text}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>

      <div className={card}>
        <div className="flex items-center justify-between">
          <Title>الغرف والأجنحة الآن</Title>
          <button type="button" onClick={() => go("rooms")} className="text-xs font-bold text-violet-700">إدارة الغرف ←</button>
        </div>
        <div className="flex h-4 overflow-hidden rounded-full">
          {(Object.keys(roomStatus) as RoomStatus[]).map((s) => (
            <div key={s} className={roomStatus[s].dot} style={{ width: `${(counts[s] / 50) * 100}%` }} />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {(Object.keys(roomStatus) as RoomStatus[]).map((s) => (
            <div key={s} className="flex items-center gap-2 text-xs">
              <span className={`h-2.5 w-2.5 rounded-full ${roomStatus[s].dot}`} />
              <span className="text-slate-600">{roomStatus[s].label}</span>
              <b className="text-slate-900">{counts[s]}</b>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[["86", "محادثة ردّ عليها المساعد اليوم"], ["4 ثوانٍ", "متوسط زمن الرد على الضيوف"], ["4.7 ★", "تقييم الفندق على Google"]].map(([v, l]) => (
          <button key={l} type="button" onClick={() => go(l.includes("Google") ? "reputation" : "assistant")} className={`${card} text-start transition hover:border-violet-300`}>
            <b className="font-display text-2xl text-violet-700">{v}</b>
            <p className="mt-1 text-xs text-slate-500">{l}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Bookings({ bookings, setBooking, addBooking, notify }: { bookings: Booking[]; setBooking: (id: string, s: BookingStatus) => void; addBooking: (b: Omit<Booking, "id">) => string; notify: (t: string) => void }) {
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ guest: "", room: roomTypes[0].id as string, nights: 1 });
  const shown = bookings.filter((b) => (filter === "all" || b.status === filter) && b.guest.includes(q.trim()));

  const action = (b: Booking) => {
    if (b.status === "new") return { label: "تأكيد الحجز", run: () => { setBooking(b.id, "confirmed"); notify(`تم تأكيد ${b.id} وإرسال رسالة تأكيد للضيف على واتساب`); } };
    if (b.status === "pending") return { label: "إرسال رابط الدفع", run: () => { setBooking(b.id, "confirmed"); notify(`تم إرسال رابط الدفع لـ ${b.guest}، وتأكد الحجز بعد السداد`); } };
    if (b.status === "confirmed") return { label: "تسجيل وصول", run: () => { setBooking(b.id, "checked_in"); notify(`أهلاً ${b.guest}! تم تسجيل الوصول`); } };
    if (b.status === "checked_in") return { label: "تسجيل مغادرة", run: () => { setBooking(b.id, "checked_out"); notify(`تم تسجيل مغادرة ${b.guest} وإرسال طلب تقييم تلقائي`); } };
    return null;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = roomTypes.find((r) => r.id === form.room)!;
    const id = addBooking({ guest: form.guest.trim() || "ضيف جديد", room: t.name, nights: form.nights, date: "اليوم", source: "phone", amount: t.price * form.nights, status: "confirmed", guests: 2 });
    notify(`تمت إضافة الحجز ${id} وحجز الغرفة تلقائياً`);
    setOpen(false);
    setForm({ guest: "", room: roomTypes[0].id, nights: 1 });
  };

  const stat = (s: BookingStatus) => bookings.filter((b) => b.status === s).length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="حجوزات هذا الأسبوع" value={String(bookings.length + 38)} delta="18% عن الأسبوع الماضي" />
        <Kpi label="جديدة تنتظر التأكيد" value={String(stat("new"))} />
        <Kpi label="بانتظار الدفع" value={String(stat("pending"))} />
        <Kpi label="ضيوف داخل الفندق" value={String(stat("checked_in") + 41)} />
      </div>

      <div className={card}>
        <div className="flex flex-wrap items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث باسم الضيف..." className="min-w-0 flex-1 rounded-full border border-violet-100 bg-violet-50/50 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
          <button type="button" onClick={() => setOpen(true)} className={primary}>+ حجز جديد</button>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {(["all", ...Object.keys(bookingStatus)] as (BookingStatus | "all")[]).map((s) => (
            <button key={s} type="button" onClick={() => setFilter(s)} className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold ${filter === s ? "bg-violet-700 text-white" : "bg-violet-50 text-violet-700"}`}>
              {s === "all" ? `الكل (${bookings.length})` : `${bookingStatus[s].label} (${stat(s)})`}
            </button>
          ))}
        </div>

        <ul className="mt-4 space-y-3">
          <AnimatePresence initial={false}>
            {shown.map((b) => {
              const a = action(b);
              return (
                <motion.li layout key={b.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-2xl border p-4 ${b.status === "new" ? "border-fuchsia-200 bg-fuchsia-50/40" : "border-violet-50"}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-slate-900">{b.guest}</p>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${bookingStatus[b.status].chip}`}>{bookingStatus[b.status].label}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500"><span dir="ltr">{b.id}</span> • {b.room} • {b.nights} ليالٍ • {b.guests} ضيوف • الوصول {b.date}</p>
                      <div className="mt-1.5"><SourceTag s={b.source} /></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <b className="text-sm text-slate-900">{sar(b.amount)}</b>
                      {a && <button type="button" onClick={a.run} className={b.status === "new" ? primary : ghost}>{a.label}</button>}
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
          {shown.length === 0 && <li className="py-8 text-center text-sm text-slate-400">لا توجد حجوزات بهذا الفلتر</li>}
        </ul>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-end justify-center bg-[#2e1065]/40 p-4 sm:items-center" onClick={() => setOpen(false)}>
            <motion.form initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 shadow-2xl">
              <h3 className="text-lg text-slate-900">حجز جديد</h3>
              <label className="block text-xs font-bold text-slate-600">اسم الضيف
                <input autoFocus value={form.guest} onChange={(e) => setForm({ ...form, guest: e.target.value })} className="mt-1 w-full rounded-xl border border-violet-100 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none" />
              </label>
              <label className="block text-xs font-bold text-slate-600">نوع الغرفة
                <select value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} className="mt-1 w-full rounded-xl border border-violet-100 bg-white px-3 py-2.5 text-sm">
                  {roomTypes.map((r) => <option key={r.id} value={r.id}>{r.name} — {sar(r.price)}</option>)}
                </select>
              </label>
              <label className="block text-xs font-bold text-slate-600">عدد الليالي
                <input type="number" min={1} max={30} value={form.nights} onChange={(e) => setForm({ ...form, nights: Math.max(1, Number(e.target.value) || 1) })} className="mt-1 w-full rounded-xl border border-violet-100 px-3 py-2.5 text-sm" />
              </label>
              <p className="rounded-xl bg-violet-50 p-3 text-sm text-violet-800">الإجمالي: <b>{sar(roomTypes.find((r) => r.id === form.room)!.price * form.nights)}</b></p>
              <div className="flex gap-2">
                <button type="submit" className={`${primary} flex-1 py-3`}>تأكيد الحجز</button>
                <button type="button" onClick={() => setOpen(false)} className={`${ghost} py-3`}>إلغاء</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Rooms({ rooms, setRooms, counts, notify }: { rooms: Room[]; setRooms: React.Dispatch<React.SetStateAction<Room[]>>; counts: Record<RoomStatus, number>; notify: (t: string) => void }) {
  const [status, setStatus] = useState<RoomStatus | "all">("all");
  const [type, setType] = useState<string>("all");
  const [sel, setSel] = useState<string | null>(null);
  const room = rooms.find((r) => r.no === sel);
  const floors = [...new Set(rooms.map((r) => r.floor))];
  const typeName = (id: string) => roomTypes.find((t) => t.id === id)!.name;

  const change = (s: RoomStatus) => {
    if (!room) return;
    setRooms((rs) => rs.map((r) => (r.no === room.no ? { ...r, status: s, guest: s === "available" || s === "cleaning" || s === "maintenance" ? undefined : r.guest ?? "ضيف" } : r)));
    notify(`الغرفة ${room.no} صارت «${roomStatus[s].label}»${s === "cleaning" ? " وتم إشعار فريق النظافة" : s === "maintenance" ? " وتم فتح طلب صيانة" : ""}`);
    setSel(null);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {(Object.keys(roomStatus) as RoomStatus[]).map((s) => (
          <button key={s} type="button" onClick={() => setStatus(status === s ? "all" : s)} className={`${card} !p-4 text-start transition ${status === s ? "!border-violet-500 ring-2 ring-violet-200" : ""}`}>
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${roomStatus[s].dot}`} />
            <b className="mt-2 block font-display text-2xl text-slate-900">{counts[s]}</b>
            <p className="text-xs text-slate-500">{roomStatus[s].label}</p>
          </button>
        ))}
      </div>

      <div className={card}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Title sub="اضغط على أي غرفة لتغيير حالتها">خريطة الغرف حسب الطوابق</Title>
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-full border border-violet-100 bg-white px-3 py-2 text-xs" aria-label="نوع الغرفة">
            <option value="all">كل الأنواع</option>
            {roomTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="space-y-4">
          {floors.map((f) => (
            <div key={f}>
              <p className="mb-2 text-[11px] font-bold text-slate-400">الطابق {f}</p>
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                {rooms.filter((r) => r.floor === f).map((r) => {
                  const dim = (status !== "all" && r.status !== status) || (type !== "all" && r.type !== type);
                  const suite = roomTypes.find((t) => t.id === r.type)!.suite;
                  return (
                    <button key={r.no} type="button" onClick={() => setSel(r.no)} className={`relative rounded-xl border p-2 text-center transition ${roomStatus[r.status].chip} ${dim ? "opacity-25" : "hover:-translate-y-0.5 hover:shadow-md"} ${sel === r.no ? "ring-2 ring-violet-500" : ""}`}>
                      <b className="block text-xs" dir="ltr">{r.no}</b>
                      <span className="block truncate text-[9px]">{suite ? "جناح" : "غرفة"}</span>
                      {suite && <span className="absolute end-1 top-1 text-[8px]">♛</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={card}>
        <Title>الأنواع والأسعار</Title>
        <ul className="divide-y divide-violet-50">
          {roomTypes.map((t) => {
            const list = rooms.filter((r) => r.type === t.id);
            const free = list.filter((r) => r.status === "available").length;
            return (
              <li key={t.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-bold text-slate-900">{t.name}</p>
                  <p className="text-[11px] text-slate-500">{sar(t.price)} / الليلة</p>
                </div>
                <div className="w-32">
                  <div className="h-2 overflow-hidden rounded-full bg-violet-50"><div className="h-full rounded-full bg-violet-600" style={{ width: `${((list.length - free) / list.length) * 100}%` }} /></div>
                  <p className="mt-1 text-[11px] text-slate-500">متاح {free} من {list.length}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <AnimatePresence>
        {room && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-end justify-center bg-[#2e1065]/40 p-4 sm:items-center" onClick={() => setSel(null)}>
            <motion.div initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg text-slate-900">الغرفة <span dir="ltr">{room.no}</span></h3>
                  <p className="text-xs text-slate-500">{typeName(room.type)} • الطابق {room.floor}{room.guest ? ` • الضيف: ${room.guest}` : ""}</p>
                </div>
                <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${roomStatus[room.status].chip}`}>{roomStatus[room.status].label}</span>
              </div>
              <p className="mt-5 text-xs font-bold text-slate-600">تغيير الحالة إلى:</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(Object.keys(roomStatus) as RoomStatus[]).filter((s) => s !== room.status).map((s) => (
                  <button key={s} type="button" onClick={() => change(s)} className={`rounded-xl border px-3 py-2.5 text-xs font-bold ${roomStatus[s].chip}`}>{roomStatus[s].label}</button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Assistant({ onBook }: { onBook: () => string }) {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: `أهلاً بك في ${HOTEL} 🌙\nأنا المساعد الذكي، أقدر أساعدك في الأسعار والتوفر والحجز على مدار الساعة.` }]);
  const [typing, setTyping] = useState(false);
  const [used, setUsed] = useState<number[]>([]);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const ask = async (i: number) => {
    if (typing) return;
    const s = assistantScripts[i];
    setUsed((u) => [...u, i]);
    setMsgs((m) => [...m, { from: "guest", text: s.q }]);
    for (const line of s.a) {
      setTyping(true);
      await new Promise((r) => setTimeout(r, 900 + Math.min(line.length * 12, 900)));
      setTyping(false);
      const text = s.books && line.includes("RL-4822") ? line.replace("RL-4822", onBook()) : line;
      setMsgs((m) => [...m, { from: "bot", text }]);
      await new Promise((r) => setTimeout(r, 250));
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-5">
      <div className="xl:col-span-2">
        <div className="mx-auto max-w-sm overflow-hidden rounded-[2.2rem] border-[6px] border-[#2e1065] bg-[#efeae2] shadow-2xl">
          <div className="flex items-center gap-3 bg-[#3b0f80] px-4 py-3 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-700 font-bold">ر</span>
            <div className="flex-1">
              <p className="text-sm font-bold">{HOTEL}</p>
              <p className="text-[10px] text-violet-200">{typing ? "يكتب..." : "مساعد ذكي • متصل الآن"}</p>
            </div>
          </div>
          <div ref={box} className="h-[380px] space-y-2 overflow-y-auto p-3">
            {msgs.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-[13px] leading-relaxed shadow-sm ${m.from === "bot" ? "me-auto rounded-ss-sm bg-white text-slate-800" : "ms-auto rounded-se-sm bg-[#e9ddff] text-slate-900"}`} dir={/^[A-Za-z]/.test(m.text) ? "ltr" : "rtl"}>
                {m.text}
              </motion.div>
            ))}
            {typing && (
              <div className="me-auto flex w-16 items-center justify-center gap-1 rounded-2xl bg-white px-3 py-3 shadow-sm">
                {[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: `${d * 0.15}s` }} />)}
              </div>
            )}
          </div>
          <div className="space-y-1.5 bg-white p-3">
            <p className="text-[10px] font-bold text-slate-400">جرّب تسأل كأنك ضيف:</p>
            <div className="flex flex-wrap gap-1.5">
              {assistantScripts.map((s, i) => (
                <button key={s.q} type="button" disabled={typing || used.includes(i)} onClick={() => ask(i)} className="rounded-full border border-violet-200 px-3 py-1.5 text-[11px] font-bold text-violet-700 disabled:opacity-40" dir={/^[A-Za-z]/.test(s.q) ? "ltr" : "rtl"}>
                  {s.q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 xl:col-span-3">
        <div className="grid grid-cols-2 gap-3">
          <Kpi label="محادثات هذا الشهر" value="1,284" delta="27% عن الشهر الماضي" />
          <Kpi label="متوسط زمن الرد" value="4 ثوانٍ" />
          <Kpi label="حجوزات أكّدها المساعد" value="146" delta={`≈ ${sar(178400)} إيرادات`} />
          <Kpi label="محادثات بعد الدوام" value="38%" delta="كانت تضيع قبل المساعد" />
        </div>
        <div className={card}>
          <Title>وش يسوي المساعد الذكي لفندقكم؟</Title>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              ["يرد فوراً 24/7", "على واتساب والموقع، بالعربي والإنجليزي، حتى الساعة 3 الفجر."],
              ["يعرف غرفكم وأسعاركم", "يقرأ التوفر لحظياً من المنصة، وما يحجز غرفة غير متاحة."],
              ["يحجز ويرسل رابط الدفع", "يكمل الحجز كاملاً، ويرسل تأكيد وتذكير قبل الوصول."],
              ["يحوّل للموظف عند الحاجة", "الطلبات الخاصة والشكاوى تنتقل للاستقبال مع ملخص المحادثة."],
              ["يجمع التقييمات", "يرسل للضيف بعد المغادرة رابط تقييم Google تلقائياً."],
              ["يعطيكم تقارير", "وش أكثر شي يسأل عنه الضيوف، ووين تضيع الحجوزات."],
            ].map(([t, d]) => (
              <li key={t} className="rounded-2xl bg-violet-50/60 p-4">
                <p className="text-sm font-bold text-violet-800">✓ {t}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Reputation({ notify }: { notify: (t: string) => void }) {
  const [posted, setPosted] = useState<number[]>([]);
  const dist = [72, 18, 6, 2, 2];
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <div className={`${card} text-center`}>
          <p className="text-xs text-slate-500">تقييم {HOTEL} على Google</p>
          <b className="mt-2 block font-display text-5xl text-slate-900">4.7</b>
          <Stars n={5} className="text-2xl text-amber-400" />
          <p className="mt-1 text-xs text-slate-500">612 تقييم • ▲ من 4.2 قبل 6 أشهر</p>
          <div className="mt-5 space-y-1.5 text-start">
            {dist.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="w-3">{5 - i}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-violet-50"><motion.div initial={{ width: 0 }} animate={{ width: `${p}%` }} transition={{ duration: 0.8, delay: i * 0.08 }} className="h-full rounded-full bg-amber-400" /></div>
                <span className="w-8 text-end">{p}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:col-span-2">
          <Kpi label="مشاهدات الفندق في خرائط جوجل" value="18.4K" delta="34% هذا الشهر" spark={[9, 10, 12, 11, 14, 16, 18]} />
          <Kpi label="اتصالات من Google" value="732" delta="21%" spark={[400, 450, 470, 520, 600, 680, 732]} />
          <Kpi label="طلبات الاتجاهات للفندق" value="1,940" delta="29%" spark={[1, 1.2, 1.3, 1.5, 1.6, 1.8, 1.94]} />
          <Kpi label="زيارات الموقع من البحث" value="2,310" delta="41%" spark={[1.1, 1.3, 1.4, 1.7, 1.9, 2.1, 2.31]} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <div className={`${card} lg:col-span-3`}>
          <Title sub="المساعد الذكي يقترح الرد، وأنتم توافقون بضغطة">أحدث التقييمات</Title>
          <ul className="space-y-4">
            {reviews.map((r, i) => (
              <li key={r.name} className="rounded-2xl border border-violet-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">{r.name}</p>
                  <Stars n={r.stars} />
                </div>
                <p className="mt-2 text-sm text-slate-600" dir={/^[A-Za-z]/.test(r.text) ? "ltr" : "rtl"}>{r.text}</p>
                <div className="mt-3 rounded-xl bg-violet-50 p-3">
                  <p className="text-[10px] font-bold text-violet-600">✨ رد مقترح بالذكاء الاصطناعي</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-700" dir={/^[A-Za-z]/.test(r.reply) ? "ltr" : "rtl"}>{r.reply}</p>
                </div>
                <div className="mt-3 flex justify-end">
                  {posted.includes(i) ? (
                    <span className="text-xs font-bold text-emerald-600">✓ تم نشر الرد على Google</span>
                  ) : (
                    <button type="button" onClick={() => { setPosted((p) => [...p, i]); notify("تم نشر الرد على Google ✓"); }} className={primary}>نشر الرد</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className={`${card} lg:col-span-2`}>
          <Title sub="ترتيب الفندق في نتائج البحث المحلية">الكلمات اللي يلقونكم فيها</Title>
          <ul className="space-y-3">
            {[["فندق قريب مني", 2, 9], ["أجنحة فندقية عائلية", 1, 6], ["فندق 4 نجوم", 3, 11], ["فندق مع فطور", 2, 8], ["hotel near me", 4, 15]].map(([k, now, before]) => (
              <li key={k as string} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-slate-700" dir={/^[A-Za-z]/.test(k as string) ? "ltr" : "rtl"}>{k}</span>
                <span className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 line-through">#{before}</span>
                  <b className="rounded-full bg-violet-700 px-2.5 py-0.5 text-white">#{now}</b>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-2xl bg-gradient-to-l from-violet-700 to-fuchsia-600 p-4 text-white">
            <p className="text-xs text-violet-100">طلبات تقييم أُرسلت تلقائياً هذا الشهر</p>
            <b className="font-display text-2xl">214</b>
            <p className="text-xs text-violet-100">رجع منها 63 تقييم جديد</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Analytics() {
  const total = revenue.reduce((s, v) => s + v, 0);
  const avgOcc = Math.round(occupancy.reduce((s, v) => s + v, 0) / occupancy.length);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="إيرادات السنة" value={`${(total / 1000).toFixed(2)}M ر.س`} delta="22% عن السنة الماضية" />
        <Kpi label="متوسط الإشغال" value={`${avgOcc}%`} delta="11 نقطة" />
        <Kpi label="الإيراد لكل غرفة متاحة" value={sar(486)} delta="15%" />
        <Kpi label="حجوزات مباشرة بدون عمولة" value="55%" delta="كانت 28%" />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className={card}>
          <Title sub="بالألف ريال">الإيرادات الشهرية</Title>
          <Bars values={revenue} labels={months} unit="K" />
        </div>
        <div className={card}>
          <Title sub="نسبة الإشغال الشهرية">الإشغال عبر السنة</Title>
          <Line values={occupancy} labels={months} />
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-5">
        <div className={`${card} xl:col-span-3`}>
          <Title sub="من وين تجيكم الحجوزات">مصادر الحجوزات</Title>
          <Donut parts={sourceMix.map(([s, v]) => ({ label: sources[s].label, value: v, color: sources[s].color }))} />
        </div>
        <div className="space-y-5 xl:col-span-2">
          <div className="rounded-3xl bg-gradient-to-br from-[#3b0f80] to-fuchsia-600 p-6 text-white">
            <p className="text-xs text-violet-100">عمولات منصات الحجز اللي وفّرتوها (تقديري)</p>
            <b className="mt-2 block font-display text-3xl">{sar(146300)}</b>
            <p className="mt-1 text-xs text-violet-100">لأن 55% من الحجوزات صارت مباشرة عبر المساعد والموقع</p>
          </div>
          <div className={card}>
            <Title>✨ توصيات ذكية</Title>
            <ul className="space-y-3 text-xs leading-relaxed text-slate-700">
              <li className="rounded-xl bg-violet-50 p-3">الطلب على الأجنحة العائلية يرتفع 40% في الإجازات — نقترح رفع سعرها 8% في نهاية الأسبوع.</li>
              <li className="rounded-xl bg-violet-50 p-3">توقع الإشغال للـ30 يوم القادمة: <b>82%</b>. فيه 3 أيام منخفضة — نقترح عرض «ليلة ثالثة بنصف السعر».</li>
              <li className="rounded-xl bg-violet-50 p-3">أكثر سؤال من الضيوف: «هل فيه موقف سيارات؟» — أضفناه للمساعد والموقع.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Why() {
  const points = [
    ["💜", "حجوزات مباشرة بدون عمولات", "كل حجز يجي من الواتساب أو موقعكم يوفر لكم عمولة منصات الحجز اللي توصل 15–25%."],
    ["⚡", "ولا استفسار يضيع", "المساعد الذكي يرد خلال ثوانٍ حتى بعد منتصف الليل، ويحوّل الاستفسار لحجز مؤكد."],
    ["🛏️", "صورة كاملة للفندق لحظياً", "كل غرفة وجناح: متاحة، مشغولة، تنظيف، أو صيانة — من جوالك وأنت برّا الفندق."],
    ["⭐", "سمعة أقوى في جوجل", "طلب تقييم تلقائي بعد كل إقامة، وردود احترافية جاهزة، وظهور أعلى في الخرائط."],
    ["📈", "قرارات مبنية على أرقام", "إيرادات وإشغال ومصادر الحجوزات وتوصيات تسعير في شاشة وحدة."],
    ["🤝", "فريقكم يرتاح", "الأسئلة المتكررة يرد عليها المساعد، وفريق الاستقبال يتفرغ لضيوف الفندق."],
  ];
  const steps = ["نجهّز المنصة بهوية الفندق وغرفه وأسعاره", "نربط المساعد الذكي برقم واتساب الفندق وموقعه", "ندرّب فريق الاستقبال (جلسة واحدة تكفي)", "إطلاق ومتابعة ودعم مستمر"];
  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#2e1065] via-violet-700 to-fuchsia-600 p-7 text-white sm:p-10">
        <div aria-hidden className="absolute -end-10 -bottom-20 h-64 w-64 rounded-full bg-fuchsia-400/30 blur-3xl" />
        <p className="text-sm text-violet-100">لماذا {HOTEL}؟</p>
        <h2 className="mt-2 max-w-2xl text-2xl leading-snug sm:text-4xl">لأن ضيوفكم يستاهلون رد فوري، وفندقكم يستاهل كل حجز بدون عمولة.</h2>
        <p className="mt-4 max-w-2xl text-sm text-violet-100">منصة وحدة تدير الحجوزات والغرف والمحادثات والسمعة، مصممة خصيصاً لـ {HOTEL}، وتشتغل من الجوال.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {points.map(([e, t, d]) => (
          <div key={t} className={card}>
            <span className="text-2xl">{e}</span>
            <p className="mt-3 font-bold text-slate-900">{t}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{d}</p>
          </div>
        ))}
      </div>
      <div className={card}>
        <Title>كيف نبدأ؟</Title>
        <ol className="grid gap-3 sm:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s} className="rounded-2xl bg-violet-50/70 p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-700 text-sm font-bold text-white">{i + 1}</span>
              <p className="mt-3 text-sm font-bold text-slate-800">{s}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="rounded-3xl border-2 border-dashed border-violet-300 bg-white p-6 text-center sm:p-8">
        <h3 className="text-xl text-slate-900">جاهزين نشغّلها لـ {HOTEL}؟</h3>
        <p className="mt-2 text-sm text-slate-600">هذي نسخة عرض، والنسخة الفعلية تنبني على بيانات فندقكم الحقيقية.</p>
        <a href={whatsappLink(`مرحباً، شفت لوحة التحكم التجريبية لـ ${HOTEL} وأبغى أعرف أكثر`)} target="_blank" rel="noopener noreferrer" className={`${primary} mt-5 px-8 py-3.5 text-sm`}>
          تواصل معنا على واتساب
        </a>
      </div>
    </div>
  );
}
