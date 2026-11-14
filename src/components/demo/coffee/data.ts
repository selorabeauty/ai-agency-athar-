export const COFFEE = "كوفي وينغ Wing";
export const TAGLINE = "بدعم وتشغيل: آثر ديجيتال للخدمات الرقمية";

export type MenuItem = {
  id: string;
  name: string;
  cat: string;
  price: number;
  available: boolean;
  sold: number;
  hot?: boolean;
};

export const categories = ["قهوة مختصة", "مشروبات باردة", "حلى ومخبوزات", "شاي ومنكهات"];

export const initialMenu: MenuItem[] = [
  { id: "w1", name: "سبانيش لاتيه", cat: "قهوة مختصة", price: 18, available: true, sold: 62, hot: true },
  { id: "w2", name: "فلات وايت", cat: "قهوة مختصة", price: 16, available: true, sold: 44 },
  { id: "w3", name: "V60 مقطّر", cat: "قهوة مختصة", price: 20, available: true, sold: 31 },
  { id: "w4", name: "إسبريسو دبل", cat: "قهوة مختصة", price: 12, available: true, sold: 27 },
  { id: "w5", name: "لاتيه", cat: "قهوة مختصة", price: 15, available: true, sold: 39 },
  { id: "w6", name: "آيسد لاتيه", cat: "مشروبات باردة", price: 17, available: true, sold: 52, hot: true },
  { id: "w7", name: "موهيتو وينغ", cat: "مشروبات باردة", price: 19, available: true, sold: 28 },
  { id: "w8", name: "ماتشا مثلج", cat: "مشروبات باردة", price: 21, available: false, sold: 14 },
  { id: "w9", name: "ميلك شيك أوريو", cat: "مشروبات باردة", price: 20, available: true, sold: 23 },
  { id: "w10", name: "كرواسون زبدة", cat: "حلى ومخبوزات", price: 9, available: true, sold: 46 },
  { id: "w11", name: "كوكيز نوتيلا", cat: "حلى ومخبوزات", price: 12, available: true, sold: 58, hot: true },
  { id: "w12", name: "تشيز كيك لوتس", cat: "حلى ومخبوزات", price: 18, available: true, sold: 34 },
  { id: "w13", name: "سينامون رول", cat: "حلى ومخبوزات", price: 14, available: false, sold: 19 },
  { id: "w14", name: "شاي أخضر بالنعناع", cat: "شاي ومنكهات", price: 10, available: true, sold: 21 },
  { id: "w15", name: "شاي كرك", cat: "شاي ومنكهات", price: 8, available: true, sold: 37 },
];

export type TableQr = { id: string; table: string; zone: string; scans: number; orders: number; active: boolean };

export const initialTables: TableQr[] = [
  { id: "t1", table: "كاونتر الاستلام", zone: "داخل المحل", scans: 96, orders: 31, active: true },
  { id: "t2", table: "واجهة المحل", zone: "خارج المحل", scans: 74, orders: 19, active: true },
  { id: "t3", table: "ستيكر على الكوب", zone: "التغليف", scans: 38, orders: 8, active: true },
  { id: "t4", table: "فلاير الإعلانات", zone: "التسويق", scans: 52, orders: 11, active: true },
  { id: "t5", table: "رابط السوشال ميديا", zone: "التسويق", scans: 63, orders: 15, active: false },
];

export const hourly = { labels: ["6ص", "8ص", "10ص", "12م", "2م", "4م", "6م", "8م", "10م", "12ص"], values: [8, 19, 15, 9, 7, 11, 16, 24, 21, 10] };
