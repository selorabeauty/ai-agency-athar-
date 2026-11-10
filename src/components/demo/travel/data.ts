export const AGENCY = "الصقر المسافر";
export const AGENCY_FULL = "مكتب الصقر المسافر للسفر والسياحة";

export type BType = "flight" | "hotel" | "package" | "visa";
export type BStatus = "new" | "processing" | "confirmed" | "cancelled";
export type FileKind = "ticket" | "waiver" | "voucher";
export type BFile = { id: string; name: string; size: string; kind: FileKind; url?: string; sent?: boolean };

export type Booking = {
  id: string;
  customer: string;
  phone: string;
  type: BType;
  title: string;
  date: string;
  travelers: number;
  amount: number;
  status: BStatus;
  files: BFile[];
};

export const types: Record<BType, { label: string; emoji: string; color: string; chip: string }> = {
  flight: { label: "طيران", emoji: "✈️", color: "#0284c7", chip: "bg-sky-50 text-sky-700" },
  hotel: { label: "فنادق", emoji: "🏨", color: "#7c3aed", chip: "bg-violet-50 text-violet-700" },
  package: { label: "بكجات", emoji: "🧳", color: "#f59e0b", chip: "bg-amber-50 text-amber-700" },
  visa: { label: "تأشيرات", emoji: "🛂", color: "#10b981", chip: "bg-emerald-50 text-emerald-700" },
};

export const statuses: Record<BStatus, { label: string; chip: string; dot: string }> = {
  new: { label: "جديد", chip: "bg-sky-50 text-sky-700 border-sky-200", dot: "bg-sky-500" },
  processing: { label: "قيد التنفيذ", chip: "bg-amber-50 text-amber-800 border-amber-200", dot: "bg-amber-500" },
  confirmed: { label: "مؤكد", chip: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  cancelled: { label: "ملغي", chip: "bg-slate-100 text-slate-500 border-slate-200", dot: "bg-slate-400" },
};

export const fileKinds: Record<FileKind, string> = { ticket: "تذكرة", waiver: "تنازل", voucher: "فاوتشر" };

const f = (id: string, name: string, size: string, kind: FileKind, sent = false): BFile => ({ id, name, size, kind, sent });

export const initialBookings: Booking[] = [
  { id: "SQ-3418", customer: "عبدالعزيز الشمري", phone: "0551 230 411", type: "package", title: "بكج جورجيا العائلي — 7 أيام", date: "20 نوفمبر", travelers: 5, amount: 18900, status: "new", files: [] },
  { id: "SQ-3417", customer: "ريم العطوي", phone: "0538 772 104", type: "flight", title: "الرياض ← إسطنبول (ذهاب وعودة)", date: "18 نوفمبر", travelers: 2, amount: 3840, status: "processing", files: [] },
  { id: "SQ-3416", customer: "فيصل الحربي", phone: "0503 119 562", type: "visa", title: "تأشيرة شنغن — فرنسا", date: "2 ديسمبر", travelers: 1, amount: 850, status: "processing", files: [f("F1", "تنازل-فيصل-الحربي.pdf", "180 KB", "waiver")] },
  { id: "SQ-3415", customer: "نورة القحطاني", phone: "0566 401 233", type: "hotel", title: "فندق هيلتون دبي ووك — 3 ليالي", date: "15 نوفمبر", travelers: 3, amount: 4350, status: "confirmed", files: [f("F2", "فاوتشر-هيلتون-دبي.pdf", "240 KB", "voucher", true)] },
  { id: "SQ-3414", customer: "سلطان البلوي", phone: "0545 880 917", type: "flight", title: "جدة ← القاهرة (ذهاب فقط)", date: "14 نوفمبر", travelers: 4, amount: 3120, status: "confirmed", files: [f("F3", "تذاكر-سلطان-البلوي.pdf", "320 KB", "ticket", true)] },
  { id: "SQ-3413", customer: "شركة رواد التقنية", phone: "0112 044 870", type: "package", title: "رحلة عمل — كوالالمبور 5 أيام", date: "25 نوفمبر", travelers: 6, amount: 27600, status: "processing", files: [] },
  { id: "SQ-3412", customer: "هيا العنزي", phone: "0590 223 618", type: "visa", title: "تأشيرة سياحية — المملكة المتحدة", date: "10 ديسمبر", travelers: 2, amount: 1700, status: "new", files: [] },
  { id: "SQ-3411", customer: "ماجد الجهني", phone: "0533 664 090", type: "hotel", title: "منتجع شرم الشيخ — 5 ليالي", date: "22 نوفمبر", travelers: 2, amount: 5250, status: "confirmed", files: [f("F4", "فاوتشر-شرم.pdf", "210 KB", "voucher", true)] },
  { id: "SQ-3410", customer: "خالد الزهراني", phone: "0507 448 112", type: "flight", title: "الدمام ← لندن (ذهاب وعودة)", date: "12 نوفمبر", travelers: 1, amount: 4680, status: "cancelled", files: [] },
  { id: "SQ-3409", customer: "سارة المطيري", phone: "0581 901 774", type: "package", title: "بكج المالديف لشهر العسل — 6 أيام", date: "1 ديسمبر", travelers: 2, amount: 22400, status: "confirmed", files: [f("F5", "تذاكر-المالديف.pdf", "290 KB", "ticket", true), f("F6", "فاوتشر-المنتجع.pdf", "260 KB", "voucher", true)] },
];

export const incoming: Omit<Booking, "id" | "status" | "files">[] = [
  { customer: "أبو تركي", phone: "0559 117 245", type: "package", title: "بكج أذربيجان — 6 أيام", date: "28 نوفمبر", travelers: 4, amount: 14200 },
  { customer: "منيرة الرشيدي", phone: "0542 306 911", type: "flight", title: "الرياض ← كوالالمبور (ذهاب وعودة)", date: "5 ديسمبر", travelers: 3, amount: 7350 },
  { customer: "بندر العمري", phone: "0568 230 774", type: "hotel", title: "فندق موفنبيك إسطنبول — 4 ليالي", date: "19 نوفمبر", travelers: 2, amount: 3960 },
];

export const months = ["ديس", "ينا", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف"];
export const activity: Record<BType, number[]> = {
  flight: [62, 48, 51, 70, 66, 88, 112, 120, 96, 58, 64, 79],
  hotel: [30, 22, 25, 34, 31, 45, 58, 66, 52, 27, 33, 41],
  package: [18, 12, 14, 22, 26, 38, 54, 61, 42, 15, 19, 28],
  visa: [24, 20, 23, 31, 35, 44, 49, 41, 30, 22, 26, 34],
};

export type ChatMsg = { from: "customer" | "bot" | "staff"; text: string };
export type Chat = { id: string; customer: string; phone: string; topic: string; status: "bot" | "staff" | "waiting"; unread: number; msgs: ChatMsg[]; script: ChatMsg[] };

export const initialChats: Chat[] = [
  {
    id: "C1", customer: "عبدالله السبيعي", phone: "0550 441 302", topic: "بكج جورجيا", status: "bot", unread: 0,
    msgs: [
      { from: "customer", text: "السلام عليكم، عندكم بكجات جورجيا لعائلة 5 أشخاص؟" },
      { from: "bot", text: "وعليكم السلام وهلا فيك 🌿 أكيد! عندنا بكج جورجيا العائلي 7 أيام: تبليسي + كوداوري + باتومي، شامل الطيران والفندق والمواصلات." },
    ],
    script: [
      { from: "customer", text: "كم السعر تقريباً؟ والسفر نهاية الشهر" },
      { from: "bot", text: "لعائلة 5 أشخاص يبدأ من 18,900 ر.س شامل الطيران المباشر من الرياض، فندق 4 نجوم مع فطور، وسائق خاص 💼" },
      { from: "customer", text: "طيب ممكن أعدّل البرنامج ونزيد يومين في باتومي؟" },
      { from: "bot", text: "أكيد ممكن، التعديل يحتاج تأكيد من مستشار السفر. أحوّلك لموظف الحين؟ 👤" },
    ],
  },
  {
    id: "C2", customer: "Lina M.", phone: "0537 220 118", topic: "Flight to London", status: "bot", unread: 0,
    msgs: [
      { from: "customer", text: "Hi, do you have flights Riyadh to London next week?" },
      { from: "bot", text: "Hello! Yes — direct flights on Saudia and British Airways from 2,340 SAR. Which date works for you?" },
    ],
    script: [],
  },
  {
    id: "C3", customer: "مها الحويطي", phone: "0592 117 643", topic: "تأشيرة شنغن", status: "waiting", unread: 1,
    msgs: [
      { from: "customer", text: "أبي أعرف وش الأوراق المطلوبة لتأشيرة فرنسا؟" },
      { from: "bot", text: "المطلوب: جواز ساري 6 أشهر، صورتين، كشف حساب 3 أشهر، تعريف بالراتب، وحجز فندق وطيران. نجهّز لك الملف كامل ونحجز لك موعد السفارة ✅" },
      { from: "customer", text: "عندي سؤال عن حالة خاصة بخصوص الكفيل، أبي أكلم موظف" },
    ],
    script: [],
  },
];

export type Post = { id: string; title: string; body: string; cover: string; status: "published" | "draft"; views: number; date: string };

export const covers = [
  "linear-gradient(135deg,#0ea5e9,#1e3a8a)",
  "linear-gradient(135deg,#f59e0b,#b45309)",
  "linear-gradient(135deg,#10b981,#065f46)",
  "linear-gradient(135deg,#8b5cf6,#4c1d95)",
];

export const initialPosts: Post[] = [
  { id: "P1", title: "أفضل 10 وجهات سياحية للعائلات في الشتاء 2026", body: "تبحث عن وجهة دافئة وآمنة لعائلتك هذا الشتاء؟ جمعنا لك أفضل 10 وجهات تجمع بين الطقس المعتدل والأنشطة المناسبة للأطفال والأسعار المناسبة، من ماليزيا إلى المالديف وجورجيا.", cover: covers[0], status: "published", views: 4820, date: "8 نوفمبر" },
  { id: "P2", title: "دليلك الكامل لتأشيرة شنغن خطوة بخطوة", body: "كل اللي تحتاجه عشان تطلع تأشيرة شنغن بدون رفض: الأوراق المطلوبة، كشف الحساب، حجز الموعد، ونصائح المقابلة من خبراء الصقر المسافر.", cover: covers[2], status: "published", views: 7310, date: "2 نوفمبر" },
  { id: "P3", title: "جورجيا في 7 أيام: برنامج سياحي متكامل", body: "برنامج يومي مقترح يغطي تبليسي وكوداوري وباتومي، مع أفضل الفنادق والمطاعم الحلال والأنشطة العائلية.", cover: covers[1], status: "draft", views: 0, date: "مسودة" },
];
