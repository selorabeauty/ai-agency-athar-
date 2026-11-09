export const RESTAURANT = "مطعم ركن سليم";
export const TAGLINE = "بدعم وتشغيل: آثر ديجيتال للخدمات الرقمية";

export type OrderStatus = "new" | "preparing" | "ready" | "done";
export type OrderType = "delivery" | "pickup" | "dinein";
export type Channel = "bot" | "apps" | "call" | "web";

export type Order = {
  id: string;
  customer: string;
  items: string[];
  total: number;
  type: OrderType;
  channel: Channel;
  minutes: number;
  status: OrderStatus;
};

export const statusMeta: Record<Exclude<OrderStatus, "done">, { label: string; emoji: string; ring: string; text: string; bg: string }> = {
  new: { label: "طلبات جديدة", emoji: "🔴", ring: "border-rose-500/40", text: "text-rose-300", bg: "bg-rose-500/10" },
  preparing: { label: "قيد التحضير", emoji: "🟡", ring: "border-amber-400/40", text: "text-amber-300", bg: "bg-amber-400/10" },
  ready: { label: "جاهز للتوصيل/الاستلام", emoji: "🟢", ring: "border-emerald-500/40", text: "text-emerald-300", bg: "bg-emerald-500/10" },
};

export const orderTypes: Record<OrderType, { label: string; emoji: string }> = {
  delivery: { label: "توصيل", emoji: "🛵" },
  pickup: { label: "استلام", emoji: "🛍️" },
  dinein: { label: "محلي", emoji: "🍽️" },
};

export const channels: Record<Channel, { label: string; color: string }> = {
  bot: { label: "واتساب (الشات بوت)", color: "#f97316" },
  apps: { label: "تطبيقات التوصيل", color: "#64748b" },
  call: { label: "اتصال من خرائط جوجل", color: "#fbbf24" },
  web: { label: "موقع المطعم", color: "#fb7185" },
};

export const initialOrders: Order[] = [
  { id: "RS-2050", customer: "سلطان العنزي", items: ["نص مندي لحم حاشي", "حمص بالطحينة", "ليمون بالنعناع ×2"], total: 125, type: "delivery", channel: "bot", minutes: 1, status: "new" },
  { id: "RS-2049", customer: "أم عبدالله", items: ["مشاوي مشكّلة (لشخصين)", "سلطة فتوش"], total: 111, type: "pickup", channel: "call", minutes: 2, status: "new" },
  { id: "RS-2048", customer: "ماجد البلوي", items: ["شاورما دجاج عربي ×3", "بطاطس"], total: 76, type: "delivery", channel: "apps", minutes: 4, status: "new" },
  { id: "RS-2047", customer: "طاولة 6", items: ["كبسة لحم", "متبل", "شاي عدني ×4"], total: 107, type: "dinein", channel: "web", minutes: 7, status: "preparing" },
  { id: "RS-2046", customer: "فيصل الحويطي", items: ["مندي دجاج (نص حبة) ×2"], total: 74, type: "delivery", channel: "bot", minutes: 9, status: "preparing" },
  { id: "RS-2045", customer: "ريم الجهني", items: ["برجر ركن سليم ×2", "ليمون بالنعناع"], total: 70, type: "pickup", channel: "bot", minutes: 11, status: "preparing" },
  { id: "RS-2044", customer: "نايف الشهري", items: ["كباب لحم", "شيش طاووق", "حمص بالطحينة"], total: 94, type: "delivery", channel: "apps", minutes: 12, status: "preparing" },
  { id: "RS-2043", customer: "طاولة 2", items: ["صحن شاورما لحم ×2"], total: 70, type: "dinein", channel: "web", minutes: 14, status: "preparing" },
  { id: "RS-2042", customer: "عبدالإله العطوي", items: ["نص مندي لحم حاشي", "سلطة فتوش"], total: 101, type: "delivery", channel: "bot", minutes: 18, status: "ready" },
  { id: "RS-2041", customer: "هيا السبيعي", items: ["مشاوي مشكّلة (لشخصين)"], total: 95, type: "pickup", channel: "call", minutes: 20, status: "ready" },
  { id: "RS-2040", customer: "خالد المطيري", items: ["مندي دجاج (نص حبة)", "شاي عدني"], total: 38, type: "delivery", channel: "bot", minutes: 22, status: "ready" },
  { id: "RS-2039", customer: "طاولة 9", items: ["كبسة لحم ×2", "متبل"], total: 152, type: "dinein", channel: "web", minutes: 25, status: "ready" },
];

export const incomingOrders: Omit<Order, "id" | "minutes" | "status">[] = [
  { customer: "بندر القحطاني", items: ["مشاوي مشكّلة (لشخصين)", "حمص بالطحينة"], total: 109, type: "delivery", channel: "bot" },
  { customer: "نوف العمري", items: ["شاورما دجاج عربي ×2", "ليمون بالنعناع ×2"], total: 68, type: "pickup", channel: "call" },
  { customer: "سعد الرشيدي", items: ["نص مندي لحم حاشي ×2"], total: 170, type: "delivery", channel: "bot" },
  { customer: "طاولة 4", items: ["كباب لحم", "سلطة فتوش", "شاي عدني ×3"], total: 76, type: "dinein", channel: "web" },
  { customer: "أبو تركي", items: ["مندي دجاج (نص حبة) ×3"], total: 96, type: "delivery", channel: "apps" },
];

export type MenuItem = { id: string; name: string; cat: string; price: number; available: boolean; sold: number; hot?: boolean };

export const categories = ["المندي والكبسة", "المشاوي", "الشاورما والسندويتشات", "المقبلات", "المشروبات والحلى"];

export const initialMenu: MenuItem[] = [
  { id: "m1", name: "نص مندي لحم حاشي", cat: "المندي والكبسة", price: 85, available: true, sold: 41, hot: true },
  { id: "m2", name: "مندي دجاج (نص حبة)", cat: "المندي والكبسة", price: 32, available: true, sold: 57, hot: true },
  { id: "m3", name: "مظبي لحم", cat: "المندي والكبسة", price: 79, available: false, sold: 18 },
  { id: "m4", name: "كبسة لحم", cat: "المندي والكبسة", price: 69, available: true, sold: 23 },
  { id: "m5", name: "مشاوي مشكّلة (لشخصين)", cat: "المشاوي", price: 95, available: true, sold: 29, hot: true },
  { id: "m6", name: "شيش طاووق", cat: "المشاوي", price: 38, available: true, sold: 21 },
  { id: "m7", name: "كباب لحم", cat: "المشاوي", price: 42, available: true, sold: 19 },
  { id: "m8", name: "شاورما دجاج عربي", cat: "الشاورما والسندويتشات", price: 22, available: true, sold: 64, hot: true },
  { id: "m9", name: "صحن شاورما لحم", cat: "الشاورما والسندويتشات", price: 35, available: true, sold: 26 },
  { id: "m10", name: "برجر ركن سليم", cat: "الشاورما والسندويتشات", price: 29, available: true, sold: 31 },
  { id: "m11", name: "حمص بالطحينة", cat: "المقبلات", price: 14, available: true, sold: 38 },
  { id: "m12", name: "متبل", cat: "المقبلات", price: 14, available: true, sold: 17 },
  { id: "m13", name: "سلطة فتوش", cat: "المقبلات", price: 16, available: true, sold: 22 },
  { id: "m14", name: "كنافة نابلسية", cat: "المشروبات والحلى", price: 24, available: false, sold: 12 },
  { id: "m15", name: "ليمون بالنعناع", cat: "المشروبات والحلى", price: 12, available: true, sold: 49 },
  { id: "m16", name: "شاي عدني", cat: "المشروبات والحلى", price: 6, available: true, sold: 73 },
];

export const hourly = { labels: ["12م", "1م", "2م", "3م", "4م", "5م", "6م", "7م", "8م", "9م", "10م", "11م", "12ص", "1ص"], values: [6, 11, 14, 9, 5, 6, 8, 12, 17, 21, 18, 12, 7, 2] };

export const channelMix = [
  { key: "bot", value: 38 },
  { key: "apps", value: 27 },
  { key: "call", value: 21 },
  { key: "web", value: 14 },
] as const;

export const keywords: [string, number, number][] = [
  ["مطعم في الوجه", 1, 7],
  ["أفضل مطعم قريب مني", 1, 9],
  ["مندي الوجه", 1, 5],
  ["مشويات الوجه", 2, 8],
  ["توصيل أكل الوجه", 2, 11],
  ["مطعم عائلي الوجه", 3, 12],
];

export const weekViews = { labels: ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"], values: [2410, 2280, 2530, 2690, 2960, 3870, 4290] };

export type Review = { id: string; name: string; text: string; when: string; pinned: boolean };

export const initialReviews: Review[] = [
  { id: "r1", name: "أبو فهد", text: "أفضل مندي ذقته في الوجه، اللحم طري والرز مضبوط. وطلبت عن طريق الواتساب ووصل خلال 30 دقيقة.", when: "قبل يومين", pinned: true },
  { id: "r2", name: "منيرة العتيبي", text: "المشاوي ممتازة والجلسات العائلية نظيفة ومريحة. الخدمة سريعة والموظفين ذوق.", when: "قبل 3 أيام", pinned: true },
  { id: "r3", name: "Ahmed K.", text: "Great shawarma and very fast delivery. The WhatsApp ordering is super easy!", when: "قبل 4 أيام", pinned: false },
  { id: "r4", name: "تركي البلوي", text: "سألت البوت الساعة 1 بالليل عن المنيو ورد علي فوراً وطلبت على طول. تجربة رهيبة.", when: "قبل أسبوع", pinned: false },
  { id: "r5", name: "سارة الحربي", text: "الكنافة والليمون بالنعناع خيال، والأسعار مناسبة جداً مقارنة بالجودة.", when: "قبل أسبوع", pinned: false },
  { id: "r6", name: "عبدالرحمن الجهني", text: "مطعم نظيف وأكله دايم ثابت. صار مطعمنا الأساسي كل خميس.", when: "قبل أسبوعين", pinned: false },
];
