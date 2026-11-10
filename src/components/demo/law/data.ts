export const FIRM = "مكتب المحامية ريم مسند البلوي";
export const FIRM_SHORT = "ريم مسند البلوي";

export type Status = "pending" | "confirmed" | "completed" | "cancelled";
export type Category = "commercial" | "labor" | "family" | "realestate" | "contracts";
export type Mode = "office" | "video" | "phone";

export type Appointment = { id: string; client: string; phone: string; email: string; category: Category; mode: Mode; day: number; time: string; status: Status; source: Source };
export type Source = "website" | "google" | "whatsapp" | "referral";

export const statusMeta: Record<Status, { label: string; chip: string; dot: string }> = {
  pending: { label: "بانتظار التأكيد", chip: "bg-amber-50 text-amber-800 border-amber-200", dot: "bg-amber-500" },
  confirmed: { label: "مؤكد", chip: "bg-sky-50 text-sky-800 border-sky-200", dot: "bg-sky-600" },
  completed: { label: "مكتمل", chip: "bg-emerald-50 text-emerald-800 border-emerald-200", dot: "bg-emerald-600" },
  cancelled: { label: "ملغي", chip: "bg-slate-100 text-slate-500 border-slate-200", dot: "bg-slate-400" },
};

export const categories: Record<Category, string> = {
  commercial: "تجاري",
  labor: "عمالي",
  family: "أحوال شخصية وأسرة",
  realestate: "عقاري",
  contracts: "صياغة ومراجعة عقود",
};

export const modes: Record<Mode, string> = { office: "حضوري في المكتب", video: "اتصال مرئي", phone: "مكالمة هاتفية" };
export const sources: Record<Source, string> = { website: "نموذج الموقع", google: "خرائط جوجل", whatsapp: "واتساب", referral: "توصية عميل" };

export const MONTH = "نوفمبر 2026";
export const TODAY = 12;
export const MONTH_DAYS = 30;
export const FIRST_WEEKDAY = 0;

const a = (id: string, client: string, phone: string, email: string, category: Category, mode: Mode, day: number, time: string, status: Status, source: Source): Appointment => ({ id, client, phone, email, category, mode, day, time, status, source });

export const initialAppointments: Appointment[] = [
  a("A-118", "مؤسسة نماء التجارية", "0551 234 410", "info@namaa.sa", "commercial", "office", 12, "10:00 ص", "confirmed", "website"),
  a("A-119", "سلمان العتيبي", "0502 118 774", "salman.o@mail.com", "labor", "video", 12, "12:30 م", "pending", "google"),
  a("A-120", "نوال الشمري", "0538 901 225", "nawal.s@mail.com", "family", "office", 12, "4:00 م", "confirmed", "whatsapp"),
  a("A-121", "شركة أفق للمقاولات", "0567 440 912", "legal@ufuq.sa", "contracts", "office", 12, "6:30 م", "pending", "referral"),
  a("A-110", "فهد الحربي", "0543 667 120", "fahad.h@mail.com", "realestate", "phone", 10, "11:00 ص", "completed", "website"),
  a("A-111", "هند القحطاني", "0559 330 871", "hind.q@mail.com", "family", "video", 10, "7:00 م", "completed", "website"),
  a("A-112", "سلمان العتيبي", "0502 118 774", "salman.o@mail.com", "labor", "phone", 4, "1:00 م", "completed", "google"),
  a("A-113", "مؤسسة نماء التجارية", "0551 234 410", "info@namaa.sa", "contracts", "office", 3, "10:30 ص", "completed", "website"),
  a("A-114", "عبدالله البلوي", "0533 802 417", "a.balawi@mail.com", "commercial", "office", 8, "5:00 م", "cancelled", "whatsapp"),
  a("A-122", "ريم الجهني", "0581 224 309", "reem.j@mail.com", "labor", "video", 13, "11:30 ص", "confirmed", "website"),
  a("A-123", "متجر لمسة", "0549 776 018", "hello@lamsa.sa", "commercial", "video", 15, "3:00 م", "pending", "google"),
  a("A-124", "خالد المطيري", "0566 112 908", "khaled.m@mail.com", "realestate", "office", 16, "10:00 ص", "confirmed", "website"),
  a("A-125", "نوال الشمري", "0538 901 225", "nawal.s@mail.com", "family", "office", 18, "4:30 م", "confirmed", "whatsapp"),
  a("A-126", "شركة دروب اللوجستية", "0507 334 561", "ops@duroob.sa", "labor", "office", 19, "12:00 م", "pending", "referral"),
  a("A-127", "سارة العنزي", "0590 445 236", "sara.a@mail.com", "contracts", "phone", 22, "8:00 م", "confirmed", "website"),
];

export const monthlyVisitors = { labels: ["يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر"], values: [5200, 6100, 7400, 8900, 10800, 12400] };

export const regions = [
  { name: "تبوك", value: 31 },
  { name: "الرياض", value: 26 },
  { name: "مكة المكرمة (جدة)", value: 17 },
  { name: "المنطقة الشرقية", value: 12 },
  { name: "المدينة المنورة", value: 9 },
  { name: "مناطق أخرى", value: 5 },
];

export const keywords: { k: string; now: number; before: number; volume: string }[] = [
  { k: "محامية استشارات قانونية", now: 2, before: 14, volume: "2.9K" },
  { k: "محامي قضايا عمالية", now: 3, before: 18, volume: "4.4K" },
  { k: "استشارة قانونية أونلاين", now: 4, before: 23, volume: "6.1K" },
  { k: "محامية أحوال شخصية", now: 1, before: 9, volume: "1.8K" },
  { k: "صياغة عقود تجارية", now: 5, before: 27, volume: "1.2K" },
];

export const leadsByCategory: { category: Category; value: number }[] = [
  { category: "labor", value: 34 },
  { category: "family", value: 27 },
  { category: "commercial", value: 19 },
  { category: "contracts", value: 13 },
  { category: "realestate", value: 7 },
];
