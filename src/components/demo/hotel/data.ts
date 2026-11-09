export const HOTEL = "فندق ماسة الوجه";

export type RoomStatus = "available" | "occupied" | "arriving" | "cleaning" | "maintenance";

export const roomStatus: Record<RoomStatus, { label: string; dot: string; chip: string }> = {
  available: { label: "متاحة", dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  occupied: { label: "مشغولة", dot: "bg-violet-600", chip: "bg-violet-50 text-violet-700 border-violet-200" },
  arriving: { label: "وصول اليوم", dot: "bg-sky-500", chip: "bg-sky-50 text-sky-700 border-sky-200" },
  cleaning: { label: "قيد التنظيف", dot: "bg-amber-500", chip: "bg-amber-50 text-amber-700 border-amber-200" },
  maintenance: { label: "صيانة", dot: "bg-rose-500", chip: "bg-rose-50 text-rose-700 border-rose-200" },
};

export const roomTypes = [
  { id: "deluxe", name: "غرفة ديلوكس", price: 420, count: 22, suite: false },
  { id: "premium", name: "غرفة بريميوم مطلّة", price: 560, count: 12, suite: false },
  { id: "family", name: "جناح عائلي", price: 890, count: 8, suite: true },
  { id: "exec", name: "جناح تنفيذي", price: 1250, count: 6, suite: true },
  { id: "royal", name: "الجناح الملكي", price: 2400, count: 2, suite: true },
] as const;

export type Room = { no: string; floor: number; type: (typeof roomTypes)[number]["id"]; status: RoomStatus; guest?: string };

const pattern: RoomStatus[] = ["occupied", "occupied", "available", "occupied", "cleaning", "occupied", "arriving", "occupied", "available", "occupied", "occupied", "maintenance", "occupied", "arriving", "occupied", "available", "cleaning", "occupied", "occupied", "occupied"];
const guests = ["عبدالله", "نورة", "فهد", "سارة", "خالد", "ريم", "محمد", "هيا", "تركي", "لمى", "سلطان", "دانة"];

export const initialRooms: Room[] = (() => {
  const order = roomTypes.flatMap((t) => Array.from({ length: t.count }, () => t.id));
  return order.map((type, i) => {
    const floor = Math.floor(i / 10) + 1;
    const status = pattern[(i * 7) % pattern.length];
    return { no: `${floor}${String((i % 10) + 1).padStart(2, "0")}`, floor, type, status, guest: status === "occupied" || status === "arriving" ? guests[i % guests.length] : undefined };
  });
})();

export type BookingStatus = "new" | "confirmed" | "pending" | "checked_in" | "checked_out";
export const bookingStatus: Record<BookingStatus, { label: string; chip: string }> = {
  new: { label: "جديد", chip: "bg-fuchsia-100 text-fuchsia-700" },
  confirmed: { label: "مؤكد", chip: "bg-violet-100 text-violet-700" },
  pending: { label: "بانتظار الدفع", chip: "bg-amber-100 text-amber-700" },
  checked_in: { label: "تم الوصول", chip: "bg-emerald-100 text-emerald-700" },
  checked_out: { label: "غادر", chip: "bg-slate-100 text-slate-600" },
};

export type Source = "ai" | "direct" | "booking" | "google" | "phone";
export const sources: Record<Source, { label: string; color: string }> = {
  ai: { label: "المساعد الذكي (واتساب)", color: "#7c3aed" },
  direct: { label: "الموقع المباشر", color: "#a78bfa" },
  google: { label: "Google Hotels", color: "#38bdf8" },
  booking: { label: "منصات الحجز", color: "#f59e0b" },
  phone: { label: "الهاتف / الاستقبال", color: "#94a3b8" },
};

export type Booking = { id: string; guest: string; room: string; nights: number; date: string; source: Source; amount: number; status: BookingStatus; guests: number };

export const initialBookings: Booking[] = [
  { id: "MW-4821", guest: "عبدالرحمن القحطاني", room: "جناح عائلي", nights: 3, date: "اليوم", source: "ai", amount: 2670, status: "confirmed", guests: 4 },
  { id: "MW-4820", guest: "نورة الشمري", room: "غرفة بريميوم مطلّة", nights: 2, date: "اليوم", source: "direct", amount: 1120, status: "checked_in", guests: 2 },
  { id: "MW-4819", guest: "Michael Brown", room: "جناح تنفيذي", nights: 4, date: "غداً", source: "google", amount: 5000, status: "confirmed", guests: 1 },
  { id: "MW-4818", guest: "فهد العتيبي", room: "غرفة ديلوكس", nights: 1, date: "غداً", source: "ai", amount: 420, status: "pending", guests: 2 },
  { id: "MW-4817", guest: "سارة الحربي", room: "الجناح الملكي", nights: 2, date: "الخميس", source: "phone", amount: 4800, status: "confirmed", guests: 3 },
  { id: "MW-4816", guest: "خالد الدوسري", room: "غرفة ديلوكس", nights: 5, date: "الخميس", source: "booking", amount: 2100, status: "confirmed", guests: 1 },
  { id: "MW-4815", guest: "ريم المطيري", room: "جناح عائلي", nights: 2, date: "الجمعة", source: "ai", amount: 1780, status: "pending", guests: 5 },
  { id: "MW-4814", guest: "تركي الزهراني", room: "غرفة بريميوم مطلّة", nights: 1, date: "أمس", source: "direct", amount: 560, status: "checked_out", guests: 2 },
];

export const incoming: Omit<Booking, "id">[] = [
  { guest: "هيا السبيعي", room: "جناح عائلي", nights: 2, date: "السبت", source: "ai", amount: 1780, status: "new", guests: 4 },
  { guest: "Ahmed Khan", room: "غرفة ديلوكس", nights: 3, date: "الأحد", source: "google", amount: 1260, status: "new", guests: 2 },
  { guest: "سلطان العنزي", room: "جناح تنفيذي", nights: 1, date: "غداً", source: "ai", amount: 1250, status: "new", guests: 2 },
];

export const activity = [
  "المساعد الذكي ردّ على استفسار عن الجناح العائلي خلال 3 ثوانٍ",
  "تقييم جديد ★★★★★ على Google: «نظافة واستقبال ممتاز»",
  "الغرفة 214 جاهزة بعد التنظيف",
  "تذكير تلقائي أُرسل لـ 6 ضيوف بموعد الوصول",
  "المساعد الذكي حوّل ضيفاً للاستقبال لطلب خاص",
  "ارتفاع مشاهدات ملف الفندق في خرائط جوجل 12% هذا الأسبوع",
];

export const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
export const revenue = [312, 298, 356, 402, 388, 451, 524, 561, 437, 468, 495, 548];
export const occupancy = [61, 58, 66, 72, 70, 78, 86, 89, 74, 77, 81, 87];
export const sourceMix: [Source, number][] = [["ai", 31], ["direct", 24], ["google", 14], ["booking", 22], ["phone", 9]];

export const reviews = [
  { name: "أم فيصل", stars: 5, text: "الجناح العائلي واسع ونظيف، والحجز عن طريق الواتساب كان سريع جداً.", reply: "شكراً أم فيصل على كلماتك الجميلة! سعدنا باستضافتكم ونتطلع لزيارتكم القادمة في فندق ماسة الوجه." },
  { name: "Omar S.", stars: 4, text: "Great location and friendly staff. Breakfast could have more variety.", reply: "Thank you Omar! We're glad you enjoyed your stay, and we've shared your breakfast feedback with our kitchen team." },
  { name: "عبدالعزيز", stars: 3, text: "الغرفة ممتازة لكن تأخر تسجيل الدخول نص ساعة.", reply: "نعتذر عن التأخير يا عبدالعزيز، وتم تفعيل تسجيل الدخول المسبق عبر الواتساب لتفادي الانتظار. نسعد بخدمتك مرة أخرى." },
];

export const assistantScripts = [
  { q: "كم سعر الجناح العائلي؟", a: ["أهلاً وسهلاً في فندق ماسة الوجه 🌙", "الجناح العائلي يبدأ من 890 ر.س لليلة، ويتسع حتى 5 أشخاص، وفيه صالة وغرفتين نوم.", "تحب أتحقق لك من التوفر على تواريخ معينة؟"] },
  { q: "فيه غرف متاحة الويكند؟", a: ["أكيد! لهذا الويكند متاح حالياً:", "• غرفة ديلوكس — 4 غرف\n• غرفة بريميوم مطلّة — غرفتين\n• جناح عائلي — جناح واحد", "أحجز لك وحدة منها؟"] },
  { q: "Do you offer airport pickup?", a: ["Yes! We offer airport pickup 24/7 for 120 SAR per trip.", "Just share your flight number and arrival time, and I'll arrange it for you."] },
  { q: "أبي أحجز جناح عائلي ليلتين", a: ["تمام! جناح عائلي لليلتين بإجمالي 1,780 ر.س.", "أرسلت لك رابط الدفع الآمن 🔒", "✅ تم تأكيد حجزك — رقم الحجز MW-4822\nبنرسل لك تذكير قبل الوصول بيوم."], books: true },
];
