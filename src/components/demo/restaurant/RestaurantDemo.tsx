"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { whatsappLink } from "@/lib/site";
import {
  categories, channelMix, channels, hourly, incomingOrders, initialMenu, initialOrders, initialReviews, keywords, orderTypes, RESTAURANT, statusMeta, TAGLINE, weekViews,
  type MenuItem, type Order, type OrderStatus, type Review,
} from "./data";

type Tab = "overview" | "orders" | "menu" | "seo" | "bot" | "reviews";
type Active = Exclude<OrderStatus, "done">;

const icons: Record<Tab, string> = {
  overview: "M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z",
  orders: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6Zm-3 4h18M16 10a4 4 0 0 1-8 0",
  menu: "M3 2v7c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2V2M6 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7",
  seo: "M12 21s-7-6.2-7-12a7 7 0 1 1 14 0c0 5.8-7 12-7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  bot: "M8 10h.01M12 10h.01M16 10h.01M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12Z",
  reviews: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z",
};

const tabs: { id: Tab; label: string; short: string }[] = [
  { id: "overview", label: "لوحة التحكم والإحصائيات", short: "الرئيسية" },
  { id: "orders", label: "إدارة الطلبات الفورية", short: "الطلبات" },
  { id: "menu", label: "إدارة المنيو والوجبات", short: "المنيو" },
  { id: "seo", label: "تحليلات البحث وخرائط جوجل", short: "جوجل" },
  { id: "bot", label: "الشات بوت الذكي 24/7", short: "الشات بوت" },
  { id: "reviews", label: "إدارة التقييمات البارزة", short: "التقييمات" },
];

const sar = (n: number) => `${n.toLocaleString("en-US")} ر.س`;
const card = "rounded-3xl border border-white/[0.07] bg-slate-900/70 p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.8)] sm:p-6";
const btn = "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition active:scale-[0.97]";
const primary = `${btn} bg-gradient-to-l from-orange-500 to-amber-400 text-slate-950 shadow-lg shadow-orange-500/20 hover:brightness-110`;
const ghost = `${btn} border border-white/10 text-slate-200 hover:border-amber-400/50 hover:text-amber-300`;
const nextStatus: Record<Active, OrderStatus> = { new: "preparing", preparing: "ready", ready: "done" };

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
        {sub && <p className="text-xs text-slate-400">{sub}</p>}
      </div>
      {end}
    </div>
  );
}

function Bars({ values, labels, highlight }: { values: number[]; labels: string[]; highlight?: number }) {
  const max = Math.max(...values);
  const top = highlight ?? values.indexOf(max);
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
              className={`absolute inset-x-0 bottom-0 rounded-t-md ${i === top ? "bg-gradient-to-t from-orange-600 to-amber-400" : "bg-slate-700 group-hover:bg-slate-600"}`}
            />
          </div>
          <span className="text-[9px] text-slate-500 sm:text-[10px]">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onChange} className={`relative h-7 w-12 shrink-0 rounded-full transition ${on ? "bg-emerald-500" : "bg-slate-700"}`}>
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "start-6" : "start-1"}`} />
    </button>
  );
}

export function RestaurantDemo() {
  const [tab, setTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [created, setCreated] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [revenue, setRevenue] = useState(18940);
  const [toast, setToast] = useState<string | null>(null);
  const [unread, setUnread] = useState(3);
  const nextId = useRef(2051);
  const tick = useRef(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const main = useRef<HTMLDivElement>(null);

  const notify = useCallback((text: string) => {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3800);
  }, []);

  const addOrder = useCallback((o: Omit<Order, "id" | "minutes" | "status">) => {
    const id = `RS-${nextId.current++}`;
    setOrders((os) => [{ ...o, id, minutes: 0, status: "new" }, ...os]);
    setCreated((c) => c + 1);
    setUnread((u) => u + 1);
    return id;
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      tick.current += 1;
      const n = tick.current;
      setOrders((os) => os.map((o) => (o.status === "done" ? o : { ...o, minutes: o.minutes + 1 })));
      if (n % 2 === 1 && (n - 1) / 2 < incomingOrders.length) {
        const o = incomingOrders[(n - 1) / 2];
        const id = addOrder(o);
        notify(`🔴 طلب جديد ${id} عبر ${channels[o.channel].label} — ${sar(o.total)}`);
      }
    }, 10000);
    return () => clearInterval(t);
  }, [addOrder, notify]);

  const go = (t: Tab) => {
    setTab(t);
    if (t === "orders") setUnread(0);
    main.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const advance = (id: string) => {
    const o = orders.find((x) => x.id === id);
    if (!o || o.status === "done") return;
    const to = nextStatus[o.status];
    setOrders((os) => os.map((x) => (x.id === id ? { ...x, status: to } : x)));
    if (to === "preparing") notify(`تم قبول ${id} وإرساله للمطبخ 👨‍🍳 — وصل العميل إشعار تلقائي على الواتساب`);
    if (to === "ready") notify(`${id} جاهز ✅ — أُبلغ ${o.type === "delivery" ? "المندوب والعميل" : "العميل"} تلقائياً`);
    if (to === "done") {
      setCompleted((c) => c + 1);
      setRevenue((r) => r + o.total);
      notify(`${id} ${o.type === "delivery" ? "خرج للتوصيل" : "تم تسليمه"} — أُضيف ${sar(o.total)} للمبيعات`);
    }
  };

  const active = orders.filter((o) => o.status !== "done");
  const current = tabs.find((t) => t.id === tab)!;
  const stats = { total: 148 + created, active: active.length, revenue, completed };

  return (
    <div className="font-tajawal min-h-screen bg-[#0b1120] text-slate-200" style={{ colorScheme: "dark" }}>
      <div className="bg-gradient-to-l from-orange-600 via-orange-500 to-amber-500 px-4 py-2 text-center text-[11px] font-bold text-slate-950 sm:text-xs">
        عرض تجريبي حي مقدّم من آثر ديجيتال — جميع الأسماء والأرقام توضيحية
      </div>

      <div className="mx-auto flex max-w-[1500px]">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-e border-white/[0.06] bg-[#0a0f1c] p-5 lg:flex">
          <Brand />
          <nav className="mt-8 space-y-1.5">
            {tabs.map((t) => (
              <button key={t.id} type="button" onClick={() => go(t.id)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${tab === t.id ? "bg-gradient-to-l from-orange-500 to-amber-400 text-slate-950 shadow-lg shadow-orange-500/20" : "text-slate-300 hover:bg-white/5"}`}>
                <Icon d={icons[t.id]} />
                <span className="flex-1 text-start">{t.label}</span>
                {t.id === "orders" && unread > 0 && <span className="rounded-full bg-rose-500 px-2 text-[10px] text-white">{unread}</span>}
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 text-xs">
            <p className="flex items-center gap-2 font-bold text-white">
              <Pulse /> الشات بوت يستقبل الطلبات الآن
            </p>
            <p className="mt-1.5 text-slate-400">يرد على عملائك على الواتساب على مدار الساعة.</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#0b1120]/85 backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <div className="lg:hidden"><Brand /></div>
              <div className="hidden lg:block">
                <h1 className="text-xl font-bold text-white">{current.label}</h1>
                <p className="text-xs text-slate-400">{TAGLINE}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-300 md:flex">
                  <Pulse /> نظام إدارة المطعم والطلبات يعمل بكفاءة
                </span>
                <button type="button" onClick={() => go("orders")} className="relative rounded-full border border-white/10 p-2 text-amber-300" aria-label="الإشعارات">
                  <Icon d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0" />
                  {unread > 0 && <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{unread}</span>}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 pb-2 text-[11px] font-bold text-emerald-300 md:hidden">
              <Pulse /> نظام إدارة المطعم والطلبات يعمل بكفاءة
            </div>
            <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden" aria-label="الأقسام">
              {tabs.map((t) => (
                <button key={t.id} type="button" onClick={() => go(t.id)} className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ${tab === t.id ? "bg-gradient-to-l from-orange-500 to-amber-400 text-slate-950" : "bg-white/5 text-slate-300"}`}>
                  <Icon d={icons[t.id]} className="h-4 w-4" />
                  {t.short}
                  {t.id === "orders" && unread > 0 && <span className="rounded-full bg-rose-500 px-1.5 text-[10px] text-white">{unread}</span>}
                </button>
              ))}
            </nav>
          </header>

          <div ref={main} className="scroll-mt-40 px-4 py-6 sm:px-6 lg:py-8">
            <h1 className="mb-5 text-xl font-bold text-white lg:hidden">{current.label}</h1>
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                {tab === "overview" && <Overview stats={stats} orders={active} menu={menu} go={go} />}
                {tab === "orders" && <Orders orders={active} advance={advance} />}
                {tab === "menu" && <Menu menu={menu} setMenu={setMenu} notify={notify} />}
                {tab === "seo" && <Seo />}
                {tab === "bot" && (
                  <Bot
                    menu={menu}
                    orders={active}
                    onOrder={(o) => {
                      const id = addOrder(o);
                      notify(`🤖 الشات بوت استلم طلب ${id} وأرسله للمطبخ — بدون أي تدخل من الموظفين`);
                      return id;
                    }}
                  />
                )}
                {tab === "reviews" && <Reviews reviews={reviews} setReviews={setReviews} notify={notify} />}
              </motion.div>
            </AnimatePresence>
            <Cta />
            <p className="mt-8 text-center text-[11px] text-slate-500">صُممت هذه المنصة التجريبية لـ {RESTAURANT} بواسطة آثر ديجيتال • الأرقام للعرض فقط</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="fixed inset-x-4 bottom-5 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-amber-400/30 bg-slate-900 p-4 text-sm text-white shadow-2xl shadow-black/50">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-slate-950">
              <Icon d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0" className="h-4 w-4" />
            </span>
            <span className="flex-1">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-xl font-bold text-slate-950 shadow-lg shadow-orange-500/25">ر</span>
      <div>
        <p className="text-lg font-bold leading-tight text-white">{RESTAURANT}</p>
        <p className="text-[11px] text-amber-300/90">{TAGLINE}</p>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`${card} ${accent ? "border-amber-400/30 bg-gradient-to-br from-orange-500/15 to-slate-900/70" : ""}`}>
      <p className="text-xs text-slate-400">{label}</p>
      <motion.b key={value} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 block text-2xl font-bold text-white sm:text-3xl">{value}</motion.b>
      <p className="mt-1 text-xs font-bold text-amber-300">{sub}</p>
    </div>
  );
}

function Overview({ stats, orders, menu, go }: { stats: { total: number; active: number; revenue: number; completed: number }; orders: Order[]; menu: MenuItem[]; go: (t: Tab) => void }) {
  const top = [...menu].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const soldOut = menu.filter((m) => !m.available).length;
  const counts = { new: 0, preparing: 0, ready: 0 } as Record<Active, number>;
  orders.forEach((o) => { if (o.status !== "done") counts[o.status]++; });
  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-l from-slate-900 via-slate-900 to-orange-950/60 p-6 sm:p-8">
        <div aria-hidden className="absolute -start-10 -top-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
        <p className="relative text-sm text-amber-300">مساء الخير، إدارة {RESTAURANT}</p>
        <h2 className="relative mt-2 max-w-2xl text-2xl font-bold leading-snug text-white sm:text-3xl">
          عندك الحين {stats.active} طلب نشط{counts.new > 0 ? `، منها ${counts.new} جديدة تنتظر القبول` : "، وكلها في المطبخ أو جاهزة"}.
        </h2>
        <div className="relative mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => go("orders")} className={primary}>فتح الطلبات الفورية</button>
          <button type="button" onClick={() => go("menu")} className={ghost}>إدارة المنيو</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="إجمالي طلبات اليوم" value={`${stats.total} طلب`} sub="▲ 23% عن نفس اليوم الأسبوع الماضي" />
        <Stat label="الطلبات النشطة الآن" value={`${stats.active} طلب`} sub="قيد التحضير والتوصيل" accent />
        <Stat label="مبيعات اليوم" value={sar(stats.revenue)} sub={`متوسط الطلب ${sar(Math.round(stats.revenue / stats.total))}`} />
        <Stat label="رضا العملاء" value="4.9 ★" sub="من 1,284 تقييم على Google" />
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        <div className={`${card} xl:col-span-3`}>
          <Title sub="عدد الطلبات في كل ساعة اليوم">ذروة الطلبات</Title>
          <Bars values={hourly.values} labels={hourly.labels} />
          <p className="mt-3 rounded-2xl bg-amber-400/10 p-3 text-xs text-amber-200">💡 الذروة الساعة 9 مساءً — النظام يقترح تجهيز المندي مسبقاً من الساعة 8.</p>
        </div>
        <div className={`${card} xl:col-span-2`}>
          <Title sub="من وين تجيكم الطلبات">قنوات الطلب</Title>
          <ul className="space-y-4">
            {channelMix.map((c) => (
              <li key={c.key}>
                <div className="mb-1.5 flex justify-between text-xs"><span>{channels[c.key].label}</span><b className="text-white">{c.value}%</b></div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${c.value}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ background: channels[c.key].color }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-400">طلبات الواتساب والاتصال والموقع بدون عمولة تطبيقات = <b className="text-amber-300">73%</b> من الطلبات.</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className={card}>
          <Title sub="حالة الطلبات النشطة" end={<button type="button" onClick={() => go("orders")} className="text-xs font-bold text-amber-300">عرض الكل ←</button>}>الطلبات الآن</Title>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(statusMeta) as Active[]).map((s) => (
              <div key={s} className={`rounded-2xl border ${statusMeta[s].ring} ${statusMeta[s].bg} p-3 text-center`}>
                <p className="text-lg">{statusMeta[s].emoji}</p>
                <b className="block text-2xl text-white">{counts[s]}</b>
                <p className={`text-[11px] font-bold ${statusMeta[s].text}`}>{statusMeta[s].label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={card}>
          <Title sub={soldOut ? `${soldOut} أصناف نفدت اليوم` : "كل الأصناف متوفرة"} end={<button type="button" onClick={() => go("menu")} className="text-xs font-bold text-amber-300">المنيو ←</button>}>الأكثر مبيعاً اليوم</Title>
          <ol className="space-y-2.5">
            {top.map((m, i) => (
              <li key={m.id} className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-[11px] font-bold text-amber-300">{i + 1}</span>
                <span className="flex-1">{m.name}</span>
                <b className="text-white">{m.sold}</b>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Orders({ orders, advance }: { orders: Order[]; advance: (id: string) => void }) {
  const [col, setCol] = useState<Active>("new");
  const cols = Object.keys(statusMeta) as Active[];
  const action = (o: Order) =>
    o.status === "new" ? "قبول وإرسال للمطبخ" : o.status === "preparing" ? "جاهز ✓" : o.type === "delivery" ? "سُلّم للمندوب" : "تم التسليم";
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto lg:hidden">
        {cols.map((s) => (
          <button key={s} type="button" onClick={() => setCol(s)} className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold ${col === s ? `${statusMeta[s].ring} ${statusMeta[s].bg} text-white` : "border-white/10 text-slate-400"}`}>
            {statusMeta[s].emoji} {statusMeta[s].label} <span className="rounded-full bg-white/10 px-1.5">{orders.filter((o) => o.status === s).length}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {cols.map((s) => {
          const list = orders.filter((o) => o.status === s);
          return (
            <section key={s} className={`rounded-3xl border ${statusMeta[s].ring} bg-slate-900/50 p-3 sm:p-4 ${col === s ? "" : "hidden lg:block"}`}>
              <header className="mb-3 flex items-center justify-between px-1">
                <h3 className={`text-sm font-bold ${statusMeta[s].text}`}>{statusMeta[s].emoji} {statusMeta[s].label}</h3>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-white">{list.length}</span>
              </header>
              <ul className="space-y-3">
                <AnimatePresence initial={false}>
                  {list.map((o) => (
                    <motion.li layout key={o.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="rounded-2xl border border-white/[0.07] bg-slate-900 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-white">{o.customer}</p>
                          <p className="text-[11px] text-slate-500" dir="ltr">#{o.id}</p>
                        </div>
                        <div className="text-end">
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px]">{orderTypes[o.type].emoji} {orderTypes[o.type].label}</span>
                          <p className={`mt-1 text-[11px] ${o.minutes > 20 ? "text-rose-300" : "text-slate-500"}`}>منذ {o.minutes} د</p>
                        </div>
                      </div>
                      <ul className="mt-3 space-y-0.5 text-xs text-slate-300">
                        {o.items.map((it) => <li key={it}>• {it}</li>)}
                      </ul>
                      <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/5 pt-3">
                        <div>
                          <b className="text-sm text-amber-300">{sar(o.total)}</b>
                          <p className="text-[10px] text-slate-500">{channels[o.channel].label}</p>
                        </div>
                        <button type="button" onClick={() => advance(o.id)} className={o.status === "new" ? primary : ghost}>{action(o)}</button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
                {list.length === 0 && <li className="py-8 text-center text-xs text-slate-500">لا توجد طلبات هنا الآن</li>}
              </ul>
            </section>
          );
        })}
      </div>
      <p className="text-center text-xs text-slate-500">كل تغيير في الحالة يرسل للعميل إشعار تلقائي على الواتساب: «طلبك في المطبخ» ← «طلبك جاهز» ← «طلبك في الطريق».</p>
    </div>
  );
}

function Menu({ menu, setMenu, notify }: { menu: MenuItem[]; setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>; notify: (t: string) => void }) {
  const [cat, setCat] = useState("الكل");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const shown = menu.filter((m) => (cat === "الكل" || m.cat === cat) && m.name.includes(q.trim()));
  const available = menu.filter((m) => m.available).length;

  const toggle = (m: MenuItem) => {
    setMenu((ms) => ms.map((x) => (x.id === m.id ? { ...x, available: !x.available } : x)));
    notify(m.available ? `«${m.name}» صار غير متوفر — اختفى من الموقع والشات بوت فوراً` : `«${m.name}» رجع متوفر ✅ — ظهر في الموقع والشات بوت`);
  };
  const save = (m: MenuItem) => {
    const p = Number(draft);
    if (!Number.isFinite(p) || p <= 0) return;
    setMenu((ms) => ms.map((x) => (x.id === m.id ? { ...x, price: Math.round(p) } : x)));
    setEditing(null);
    notify(`تم تحديث سعر «${m.name}» إلى ${sar(Math.round(p))} — في الموقع والشات بوت`);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="أصناف المنيو" value={String(menu.length)} sub="في 5 أقسام" />
        <Stat label="متوفر" value={String(available)} sub="يظهر للعملاء" />
        <Stat label="نفد" value={String(menu.length - available)} sub="مخفي تلقائياً" accent />
      </div>
      <div className={card}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن وجبة..." className="w-full rounded-full border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-400/60 focus:outline-none sm:max-w-xs" />
          <div className="flex gap-2 overflow-x-auto">
            {["الكل", ...categories].map((c) => (
              <button key={c} type="button" onClick={() => setCat(c)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold ${cat === c ? "bg-amber-400 text-slate-950" : "bg-white/5 text-slate-300"}`}>{c}</button>
            ))}
          </div>
        </div>
        <ul className="divide-y divide-white/5">
          {shown.map((m) => (
            <li key={m.id} className={`flex flex-wrap items-center gap-3 py-3.5 ${m.available ? "" : "opacity-60"}`}>
              <div className="w-full min-w-0 sm:w-auto sm:flex-1">
                <p className="font-bold text-white">{m.name}</p>
                <p className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  {m.cat} • {m.sold} طلب اليوم
                  {m.hot && <span className="whitespace-nowrap rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-bold text-orange-300">🔥 الأكثر طلباً</span>}
                </p>
              </div>
              {editing === m.id ? (
                <div className="flex items-center gap-2">
                  <input autoFocus type="number" inputMode="numeric" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save(m)} className="w-20 rounded-full border border-amber-400/50 bg-slate-950 px-3 py-1.5 text-center text-sm text-white focus:outline-none" aria-label="السعر الجديد" />
                  <button type="button" onClick={() => save(m)} className={primary}>حفظ</button>
                  <button type="button" onClick={() => setEditing(null)} className="text-xs text-slate-400">إلغاء</button>
                </div>
              ) : (
                <button type="button" onClick={() => { setEditing(m.id); setDraft(String(m.price)); }} className="rounded-full border border-white/10 px-3 py-1.5 text-sm font-bold text-amber-300 hover:border-amber-400/50" title="تعديل السعر">
                  {sar(m.price)} <span className="text-[10px] text-slate-500">✎</span>
                </button>
              )}
              <div className="ms-auto flex items-center gap-2 sm:ms-0">
                <span className={`w-14 text-end text-[11px] font-bold ${m.available ? "text-emerald-300" : "text-rose-300"}`}>{m.available ? "متوفر" : "نفد"}</span>
                <Toggle on={m.available} onChange={() => toggle(m)} label={`توفر ${m.name}`} />
              </div>
            </li>
          ))}
          {shown.length === 0 && <li className="py-8 text-center text-sm text-slate-500">لا توجد نتائج</li>}
        </ul>
      </div>
      <p className="text-center text-xs text-slate-500">أي تغيير هنا يتحدث مباشرة في موقع المطعم والشات بوت — جرّب تخلي صنف «نفد» واسأل الشات بوت عن المنيو.</p>
    </div>
  );
}

function Seo() {
  const metrics = [
    { label: "مشاهدات المطعم على خرائط جوجل", value: "21.4K", delta: "38%" },
    { label: "النقرات على الموقع والمنيو", value: "3,180", delta: "44%" },
    { label: "طلبات الاتجاهات للمطعم", value: "2,410", delta: "29%" },
    { label: "طلبات مباشرة عبر الاتصال", value: "1,126", delta: "52%" },
  ];
  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-l from-orange-600 to-amber-500 p-6 text-slate-950 sm:p-8">
        <div aria-hidden className="absolute -end-10 -top-16 h-56 w-56 rounded-full bg-white/20 blur-2xl" />
        <p className="relative text-sm font-bold">ترتيب {RESTAURANT} في نتائج البحث المحلي</p>
        <p className="relative mt-2 text-4xl font-bold sm:text-5xl">#1 في بحث الوجه والمنطقة</p>
        <p className="relative mt-2 text-sm font-bold opacity-80">لكلمات مثل «مطعم في الوجه» و«أفضل مطعم قريب مني» — خلال آخر 30 يوم</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {metrics.map((m) => <Stat key={m.label} label={m.label} value={m.value} sub={`▲ ${m.delta} هذا الشهر`} />)}
      </div>
      <div className="grid gap-5 xl:grid-cols-5">
        <div className={`${card} xl:col-span-3`}>
          <Title sub="مشاهدات ملف المطعم على جوجل يومياً — آخر أسبوع">الظهور على خرائط جوجل</Title>
          <Bars values={weekViews.values} labels={weekViews.labels} />
        </div>
        <div className={`${card} xl:col-span-2`}>
          <Title sub="الترتيب الحالي مقابل قبل التحسين">الكلمات اللي يلقونكم فيها</Title>
          <ul className="space-y-2.5">
            {keywords.map(([k, now, before]) => (
              <li key={k} className="flex items-center gap-3 rounded-2xl bg-white/[0.03] px-3 py-2.5 text-sm">
                <span className="flex-1">{k}</span>
                <span className="text-[11px] text-slate-500 line-through">#{before}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${now === 1 ? "bg-amber-400 text-slate-950" : "bg-white/10 text-amber-300"}`}>#{now}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={card}>
        <Title sub="وش تسوي آثر ديجيتال عشان توصلون للمركز الأول">خطة الظهور المحلي</Title>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["ملف Google احترافي", "صور الأطباق والمنيو وأوقات العمل محدّثة دائماً."],
            ["زر اتصال وطلب مباشر", "العميل يتصل أو يطلب من الخرائط بضغطة وحدة."],
            ["موقع سريع ومتوافق", "صفحات «مطعم في الوجه» ومنيو قابل للبحث."],
            ["تقييمات مستمرة", "رابط تقييم تلقائي بعد كل طلب لرفع الترتيب."],
          ].map(([t, d]) => (
            <li key={t} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="font-bold text-amber-300">✓ {t}</p>
              <p className="mt-1 text-xs text-slate-400">{d}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type Msg = { from: "bot" | "user"; text: string };

function Bot({ menu, orders, onOrder }: { menu: MenuItem[]; orders: Order[]; onOrder: (o: Omit<Order, "id" | "minutes" | "status">) => string }) {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: `هلا والله في ${RESTAURANT} 🌟\nأنا المساعد الذكي، أقدر أساعدك في المنيو والأسعار وأوقات العمل والتوصيل، وأستقبل طلبك على طول.` }]);
  const [typing, setTyping] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const replies = useMemo(() => {
    const avail = menu.filter((m) => m.available);
    const out = menu.filter((m) => !m.available);
    const mandi = menu.find((m) => m.id === "m1")!;
    const chicken = menu.find((m) => m.id === "m2")!;
    const tracked = orders.find((o) => o.status === "preparing") ?? orders[0];
    return [
      {
        q: "وش عندكم في المنيو؟",
        a: [
          `أشهر أطباقنا اليوم:\n${avail.filter((m) => m.hot || m.sold > 30).slice(0, 5).map((m) => `• ${m.name} — ${sar(m.price)}`).join("\n")}`,
          out.length ? `⚠️ اليوم نفد: ${out.map((m) => m.name).join("، ")}` : "وكل الأصناف متوفرة اليوم 👌",
          "تبي أرسل لك المنيو كامل أو أسجل طلبك؟",
        ],
      },
      { q: "متى تفتحون؟", a: ["نستقبلكم يومياً من 12 الظهر إلى 2 بعد منتصف الليل 🕛", "ويوم الجمعة من 1:30 الظهر بعد الصلاة."] },
      { q: "كم رسوم التوصيل؟", a: ["التوصيل داخل الوجه بـ 10 ر.س، ومجاني للطلبات فوق 120 ر.س 🛵", "ومدة التوصيل عادةً من 30 إلى 40 دقيقة."] },
      {
        q: "وين وصل طلبي؟",
        a: tracked
          ? [`طلبك رقم ${tracked.id} ${tracked.status === "new" ? "استلمناه وبيدخل المطبخ الحين" : tracked.status === "preparing" ? "في المطبخ الحين 👨‍🍳" : "جاهز وطالع لك 🛵"}`, "متوقع يوصلك خلال 15 دقيقة تقريباً، وبيوصلك إشعار أول ما يطلع."]
          : ["ما لقيت طلب نشط على رقمك حالياً، تبي تطلب الحين؟"],
      },
      {
        q: "أبي نص مندي لحم توصيل",
        order: true,
        a: mandi.available
          ? [`أبشر! نص مندي لحم حاشي بـ ${sar(mandi.price)} + توصيل 10 ر.س`, "أرسل لي موقعك وطريقة الدفع (كاش أو شبكة عند الاستلام) 📍", "__ORDER__"]
          : ["للأسف نص مندي اللحم نفد اليوم 😔", `أقترح عليك مندي دجاج (نص حبة) بـ ${sar(chicken.price)} — طازج وجاهز. أسجله لك؟`, "__ORDER__"],
      },
    ];
  }, [menu, orders]);

  const [used, setUsed] = useState<string[]>([]);

  const ask = async (i: number) => {
    if (typing) return;
    const r = replies[i];
    setUsed((u) => [...u, r.q]);
    setMsgs((m) => [...m, { from: "user", text: r.q }]);
    for (const line of r.a) {
      setTyping(true);
      await new Promise((res) => setTimeout(res, 800 + Math.min(line.length * 10, 900)));
      setTyping(false);
      let text = line;
      if (line === "__ORDER__") {
        const mandi = menu.find((m) => m.id === "m1")!;
        const chicken = menu.find((m) => m.id === "m2")!;
        const item = mandi.available ? mandi : chicken;
        const total = item.price + 10;
        const id = onOrder({ customer: "عميل واتساب", items: [item.name], total, type: "delivery", channel: "bot" });
        text = `✅ تم تسجيل طلبك رقم ${id}\nالمجموع ${sar(total)} شامل التوصيل، ووصل للمطبخ الحين. بنرسل لك أول ما يطلع 🛵`;
      }
      setMsgs((m) => [...m, { from: "bot", text }]);
      await new Promise((res) => setTimeout(res, 200));
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-5">
      <div className="xl:col-span-2">
        <div className="mx-auto max-w-sm overflow-hidden rounded-[2.2rem] border-[6px] border-slate-800 bg-[#0d1418] shadow-2xl shadow-black/60">
          <div className="flex items-center gap-3 bg-[#1f2c34] px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 font-bold text-slate-950">ر</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">{RESTAURANT}</p>
              <p className="text-[10px] text-emerald-300">{typing ? "يكتب..." : "مساعد ذكي • متصل الآن"}</p>
            </div>
          </div>
          <div ref={box} className="h-[380px] space-y-2 overflow-y-auto p-3">
            {msgs.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${m.from === "bot" ? "me-auto rounded-ss-sm bg-[#1f2c34] text-slate-100" : "ms-auto rounded-se-sm bg-[#005c4b] text-white"}`}>
                {m.text}
              </motion.div>
            ))}
            {typing && (
              <div className="me-auto flex w-16 items-center justify-center gap-1 rounded-2xl bg-[#1f2c34] px-3 py-3">
                {[0, 1, 2].map((d) => <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-slate-400" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.15 }} />)}
              </div>
            )}
          </div>
          <div className="border-t border-white/5 bg-[#111b21] p-3">
            <p className="mb-2 text-[11px] text-slate-400">جرّب تسأل كأنك عميل:</p>
            <div className="flex flex-wrap gap-1.5">
              {replies.map((r, i) => (
                <button key={r.q} type="button" disabled={typing} onClick={() => ask(i)} className={`rounded-full border px-3 py-1.5 text-[11px] font-bold transition disabled:opacity-50 ${used.includes(r.q) ? "border-white/10 text-slate-500" : "border-amber-400/40 text-amber-300 hover:bg-amber-400/10"}`}>
                  {r.q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-5 xl:col-span-3">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Stat label="محادثات هذا الشهر" value="2,946" sub="▲ 31% عن الشهر الماضي" />
          <Stat label="متوسط زمن الرد" value="3 ثوانٍ" sub="ليل ونهار" />
          <Stat label="طلبات استلمها البوت" value="1,038" sub={`≈ ${sar(87400)} مبيعات`} accent />
          <Stat label="أسئلة بدون تدخل موظف" value="92%" sub="الباقي يتحوّل للكاشير" />
        </div>
        <div className={card}>
          <Title sub="بدون ما يرد أي موظف">وش يسوي الشات بوت لمطعمكم؟</Title>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              ["يرد على المنيو والأسعار", "مربوط بالمنيو، فإذا نفد صنف ما يعرضه."],
              ["يوضح أوقات العمل والموقع", "ويرسل رابط خرائط جوجل للمطعم."],
              ["يحسب رسوم التوصيل", "ويقول للعميل المدة المتوقعة."],
              ["يتابع حالة الطلب", "العميل يسأل «وين طلبي؟» ويجيه الرد فوراً."],
              ["يستقبل الطلب كامل", "ويدخله على شاشة المطبخ مباشرة."],
              ["يطلب تقييم بعد التوصيل", "عشان ترتفع تقييماتكم في جوجل."],
            ].map(([t, d]) => (
              <li key={t} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="font-bold text-amber-300">✓ {t}</p>
                <p className="mt-1 text-xs text-slate-400">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Reviews({ reviews, setReviews, notify }: { reviews: Review[]; setReviews: React.Dispatch<React.SetStateAction<Review[]>>; notify: (t: string) => void }) {
  const pinned = reviews.filter((r) => r.pinned);
  const toggle = (r: Review) => {
    if (!r.pinned && pinned.length >= 3) {
      notify("الحد الأقصى 3 تقييمات مثبّتة في الصفحة الرئيسية — ألغِ تثبيت واحد أولاً");
      return;
    }
    setReviews((rs) => rs.map((x) => (x.id === r.id ? { ...x, pinned: !x.pinned } : x)));
    notify(r.pinned ? `تم إلغاء تثبيت تقييم ${r.name}` : `📌 تم تثبيت تقييم ${r.name} في موقع المطعم`);
  };
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <div className={`${card} text-center`}>
          <p className="text-xs text-slate-400">تقييم {RESTAURANT} على Google</p>
          <p className="mt-2 text-6xl font-bold text-white">4.9</p>
          <p className="mt-1 text-xl text-amber-400">★★★★★</p>
          <p className="mt-1 text-xs text-slate-400">1,284 تقييم • ▲ من 4.3 قبل 6 أشهر</p>
          <div className="mt-5 space-y-1.5 text-start">
            {[[5, 89], [4, 8], [3, 2], [2, 1], [1, 0]].map(([s, p]) => (
              <div key={s} className="flex items-center gap-2 text-[11px]">
                <span className="w-3">{s}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800"><motion.div initial={{ width: 0 }} animate={{ width: `${p}%` }} className="h-full rounded-full bg-amber-400" /></div>
                <span className="w-8 text-slate-500">{p}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className={`${card} lg:col-span-2`}>
          <Title sub="هكذا تظهر التقييمات المثبّتة لزوار موقع المطعم">معاينة موقع المطعم</Title>
          <div className="rounded-2xl bg-[#fffaf3] p-4 text-slate-800 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-bold">وش يقولون عملاؤنا؟</p>
              <span className="text-xs text-amber-600">★ 4.9 على Google</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <AnimatePresence>
                {pinned.map((r) => (
                  <motion.div layout key={r.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="rounded-xl bg-white p-3 shadow-sm">
                    <p className="text-xs text-amber-500">★★★★★</p>
                    <p className="mt-1 line-clamp-4 text-xs leading-relaxed" dir={/^[A-Za-z]/.test(r.text) ? "ltr" : "rtl"}>«{r.text}»</p>
                    <p className="mt-2 text-[11px] font-bold text-slate-500">— {r.name}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {pinned.length === 0 && <p className="col-span-3 py-6 text-center text-xs text-slate-400">ثبّت تقييمات من القائمة تحت عشان تظهر هنا</p>}
            </div>
          </div>
        </div>
      </div>
      <div className={card}>
        <Title sub={`مثبّت ${pinned.length} من 3 • اضغط «تثبيت في الموقع» لعرض التقييم في الصفحة الرئيسية`}>أبرز تقييمات 5 نجوم</Title>
        <ul className="grid gap-3 md:grid-cols-2">
          {reviews.map((r) => (
            <li key={r.id} className={`rounded-2xl border p-4 transition ${r.pinned ? "border-amber-400/50 bg-amber-400/[0.06]" : "border-white/[0.07] bg-white/[0.02]"}`}>
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold text-white">{r.name}</p>
                <span className="text-sm text-amber-400">★★★★★</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-300" dir={/^[A-Za-z]/.test(r.text) ? "ltr" : "rtl"}>{r.text}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Google • {r.when}</span>
                <button type="button" onClick={() => toggle(r)} className={r.pinned ? primary : ghost}>{r.pinned ? "📌 مثبّت في الموقع" : "تثبيت في الموقع"}</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Cta() {
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-l from-slate-900 to-orange-950/50 p-6 text-center sm:p-8">
      <h3 className="text-xl font-bold text-white sm:text-2xl">جاهزين نشغّلها لـ {RESTAURANT}؟</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">هذي نسخة عرض، والنسخة الحقيقية نبنيها على منيو مطعمكم وأسعاره ورقم الواتساب حقكم.</p>
      <a href={whatsappLink(`مرحباً، شفت لوحة التحكم التجريبية لـ ${RESTAURANT} وأبغى أعرف أكثر`)} target="_blank" rel="noopener noreferrer" className={`${primary} mt-5 px-8 py-3.5 text-sm`}>
        تواصل معنا على واتساب
      </a>
    </div>
  );
}
