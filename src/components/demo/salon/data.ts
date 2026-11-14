export const SALON = "صالون سبتمبر";
export const TAGLINE = "بدعم وتشغيل: آثر ديجيتال للخدمات الرقمية";

export type Service = {
  id: string;
  name: string;
  cat: string;
  price: number;
  available: boolean;
  booked: number;
  hot?: boolean;
};

export const categories = ["الشعر", "الأظافر", "العناية بالبشرة", "المكياج", "الحواجب والرموش"];

export const initialServices: Service[] = [
  { id: "s1", name: "قص وسيشوار", cat: "الشعر", price: 120, available: true, booked: 34, hot: true },
  { id: "s2", name: "صبغة كاملة + بروتين", cat: "الشعر", price: 450, available: true, booked: 18 },
  { id: "s3", name: "هايلايت / بالاياج", cat: "الشعر", price: 520, available: true, booked: 12 },
  { id: "s4", name: "استشوار سريع", cat: "الشعر", price: 60, available: true, booked: 41, hot: true },
  { id: "s5", name: "مانيكير + بديكير", cat: "الأظافر", price: 130, available: true, booked: 29 },
  { id: "s6", name: "أظافر جل", cat: "الأظافر", price: 180, available: true, booked: 22, hot: true },
  { id: "s7", name: "تنظيف بشرة عميق", cat: "العناية بالبشرة", price: 250, available: true, booked: 15 },
  { id: "s8", name: "هيدرافيشل", cat: "العناية بالبشرة", price: 350, available: true, booked: 11 },
  { id: "s9", name: "مكياج سهرة", cat: "المكياج", price: 300, available: true, booked: 16 },
  { id: "s10", name: "مكياج عروس (باقة)", cat: "المكياج", price: 1200, available: false, booked: 4 },
  { id: "s11", name: "تحديد حواجب", cat: "الحواجب والرموش", price: 50, available: true, booked: 38 },
  { id: "s12", name: "رموش كلاسيك", cat: "الحواجب والرموش", price: 220, available: true, booked: 14 },
  { id: "s13", name: "رفع رموش (لفت)", cat: "الحواجب والرموش", price: 160, available: true, booked: 9 },
];

export type Offer = {
  id: string;
  name: string;
  desc: string;
  discount: number;
  starts: string;
  ends: string;
  active: boolean;
  used: number;
};

export const initialOffers: Offer[] = [
  { id: "o1", name: "عرض عودة المدارس", desc: "خصم على قص وسيشوار + مانيكير", discount: 20, starts: "1 سبتمبر", ends: "30 سبتمبر", active: true, used: 44 },
  { id: "o2", name: "باقة العروس الموسمية", desc: "مكياج + شعر + بشرة بسعر الباقة", discount: 15, starts: "1 أكتوبر", ends: "31 ديسمبر", active: true, used: 9 },
  { id: "o3", name: "خميس الجمال", desc: "خصم أسبوعي كل خميس على خدمات الأظافر", discount: 25, starts: "كل خميس", ends: "مستمر", active: true, used: 61 },
  { id: "o4", name: "عرض اليوم الوطني", desc: "خصم شامل على كل الخدمات", discount: 30, starts: "23 سبتمبر", ends: "انتهى", active: false, used: 88 },
  { id: "o5", name: "عرض رمضان والعيد", desc: "باقات العناية قبل العيد", discount: 25, starts: "رمضان", ends: "مجدول", active: false, used: 0 },
];

export const hourly = { labels: ["10ص", "12م", "2م", "4م", "6م", "8م", "10م"], values: [6, 12, 9, 14, 21, 26, 18] };
