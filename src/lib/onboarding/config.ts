import { packages, site } from "@/lib/site";

export const AGENCY_BRAND = "آثر ديجيتال";
export const AGENCY_EMAIL = site.email;

export type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
};

export type BusinessType = { id: string; label: string; code: string; hint: string; fields: FieldDef[] };

const booking: FieldDef = {
  key: "booking",
  label: "طريقة الحجز الحالية",
  type: "select",
  options: ["واتساب", "اتصال هاتفي", "نظام / تطبيق حجز", "حضور مباشر بدون حجز", "لا يوجد حجز"],
};

export const businessTypes: BusinessType[] = [
  {
    id: "clinic",
    label: "عيادة / مجمع طبي",
    code: "CLN",
    hint: "أسنان، جلدية، تجميل، عيون، عامة...",
    fields: [
      { key: "specialties", label: "التخصصات والخدمات الطبية", type: "textarea", placeholder: "مثال: تنظيف أسنان، تقويم، زراعة، تبييض..." },
      { key: "doctors", label: "أسماء الأطباء وتخصصاتهم (اختياري)", type: "textarea", placeholder: "د. ... — أخصائي ..." },
      { key: "insurance", label: "شركات التأمين المعتمدة (إن وجدت)", type: "text", placeholder: "بوبا، التعاونية..." },
      booking,
    ],
  },
  {
    id: "salon",
    label: "صالون / مركز تجميل",
    code: "SAL",
    hint: "شعر، مكياج، أظافر، عناية بالبشرة...",
    fields: [
      { key: "services", label: "الخدمات المقدمة", type: "textarea", placeholder: "قص وصبغة، مكياج، أظافر، عناية بالبشرة..." },
      { key: "audience", label: "الفئة المستهدفة", type: "select", options: ["نسائي", "رجالي", "نسائي ورجالي"] },
      { key: "homeService", label: "خدمة منزلية", type: "select", options: ["نعم", "لا"] },
      booking,
    ],
  },
  {
    id: "health",
    label: "مركز صحي / لياقة / سبا",
    code: "HLT",
    hint: "علاج طبيعي، تغذية، نادي، سبا...",
    fields: [
      { key: "programs", label: "البرامج والخدمات", type: "textarea", placeholder: "جلسات علاج طبيعي، برامج تغذية، مساج..." },
      { key: "specialists", label: "المختصون / المدربون (اختياري)", type: "textarea" },
      { key: "memberships", label: "الاشتراكات أو العضويات (إن وجدت)", type: "text", placeholder: "شهري، 3 أشهر، باقة 10 جلسات..." },
      booking,
    ],
  },
  {
    id: "restaurant",
    label: "مطعم / كافيه",
    code: "RST",
    hint: "مطاعم، مقاهي، حلويات...",
    fields: [
      { key: "cuisine", label: "نوع المطبخ وأبرز الأصناف", type: "textarea" },
      { key: "delivery", label: "تطبيقات التوصيل المتوفرة", type: "text", placeholder: "هنقرستيشن، جاهز، مرسول..." },
      { key: "reservations", label: "حجز الطاولات", type: "select", options: ["نعم", "لا"] },
    ],
  },
  {
    id: "store",
    label: "متجر / نشاط تجاري",
    code: "STR",
    hint: "متجر إلكتروني أو محل...",
    fields: [
      { key: "products", label: "المنتجات أو الفئات الرئيسية", type: "textarea" },
      { key: "deliveryAreas", label: "مناطق التوصيل", type: "text" },
      { key: "payment", label: "طرق الدفع المتاحة", type: "text", placeholder: "مدى، تحويل، دفع عند الاستلام..." },
    ],
  },
  {
    id: "other",
    label: "نشاط آخر",
    code: "OTH",
    hint: "أي نشاط غير مذكور",
    fields: [
      { key: "activity", label: "وصف النشاط", type: "textarea", placeholder: "ماذا تقدم ولمن؟" },
      { key: "services", label: "الخدمات أو المنتجات الرئيسية", type: "textarea" },
      booking,
    ],
  },
];

export const businessTypeById = (id: string) => businessTypes.find((b) => b.id === id);

export const packageOptions = [...packages.map((p) => `${p.name} — ${p.setup}`), "لم أحدد بعد"];

export const days = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

export type FileCategory = "logo" | "photos" | "prices";

export const fileCategories: Record<FileCategory, { label: string; hint: string; accept: string; types: string[]; max: number }> = {
  logo: {
    label: "شعار النشاط (Logo)",
    hint: "PNG أو SVG أو JPG أو PDF — يفضّل بخلفية شفافة",
    accept: "image/png,image/jpeg,image/webp,image/svg+xml,application/pdf",
    types: ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "application/pdf"],
    max: 3,
  },
  photos: {
    label: "صور النشاط والأعمال",
    hint: "صور المكان، الفريق، الأعمال قبل/بعد... حتى 20 صورة",
    accept: "image/png,image/jpeg,image/webp,image/heic,image/heif",
    types: ["image/png", "image/jpeg", "image/webp", "image/heic", "image/heif"],
    max: 20,
  },
  prices: {
    label: "قائمة الأسعار / الخدمات",
    hint: "PDF أو صورة أو ملف Word / Excel",
    accept:
      "application/pdf,image/png,image/jpeg,image/webp,.doc,.docx,.xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    types: [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    max: 5,
  },
};

export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_TOTAL_BYTES = 40 * 1024 * 1024;

export type AccessPlatform = { id: string; label: string; role: string; url: string; steps: { title: string; screen: string[]; tap: string }[] };

export const accessPlatforms: AccessPlatform[] = [
  {
    id: "gbp",
    label: "Google Business (خرائط جوجل)",
    role: "مدير (Manager)",
    url: "https://business.google.com",
    steps: [
      { title: "ابحث عن اسم نشاطك في Google وأنت مسجّل دخولك بحساب النشاط", screen: ["Google", "اسم نشاطك"], tap: "ملفك التجاري يظهر أعلى النتائج" },
      { title: "اضغط على النقاط الثلاث ⋮ ثم «إعدادات الملف التجاري»", screen: ["⋮ المزيد"], tap: "إعدادات الملف التجاري" },
      { title: "اختر «الأشخاص وإمكانية الوصول» ثم «إضافة»", screen: ["الأشخاص وإمكانية الوصول"], tap: "+ إضافة" },
      { title: "اكتب بريدنا واختر الدور «مدير» ثم «دعوة»", screen: [AGENCY_EMAIL, "الدور: مدير"], tap: "دعوة" },
    ],
  },
  {
    id: "meta",
    label: "Meta (واتساب / إنستغرام / فيسبوك)",
    role: "وصول جزئي للأصول المطلوبة فقط",
    url: "https://business.facebook.com/settings",
    steps: [
      { title: "افتح Meta Business Suite من الرابط وادخل بحساب نشاطك", screen: ["Meta Business Suite"], tap: "الإعدادات" },
      { title: "من «المستخدمون» اختر «الأشخاص» ثم «دعوة أشخاص»", screen: ["المستخدمون", "الأشخاص"], tap: "+ دعوة أشخاص" },
      { title: "اكتب بريدنا واختر «وصول جزئي»", screen: [AGENCY_EMAIL, "وصول جزئي"], tap: "التالي" },
      { title: "حدد الأصول: حساب واتساب للأعمال، الصفحة، إنستغرام — ثم أرسل الدعوة", screen: ["☑ واتساب للأعمال", "☑ الصفحة / إنستغرام"], tap: "إرسال الدعوة" },
    ],
  },
  {
    id: "gsc",
    label: "Google Search Console",
    role: "إذن كامل (Full)",
    url: "https://search.google.com/search-console",
    steps: [
      { title: "افتح Search Console واختر موقعك", screen: ["Search Console"], tap: "الإعدادات" },
      { title: "اختر «المستخدمون والأذونات»", screen: ["الإعدادات"], tap: "المستخدمون والأذونات" },
      { title: "اضغط «إضافة مستخدم»، اكتب بريدنا واختر «كامل» ثم «إضافة»", screen: [AGENCY_EMAIL, "الإذن: كامل"], tap: "إضافة" },
    ],
  },
  {
    id: "ga",
    label: "Google Analytics",
    role: "محرر (Editor)",
    url: "https://analytics.google.com",
    steps: [
      { title: "افتح Google Analytics واضغط «المشرف» ⚙ أسفل القائمة", screen: ["Google Analytics"], tap: "⚙ المشرف" },
      { title: "اختر «إدارة الوصول إلى الموقع» ثم + «إضافة مستخدمين»", screen: ["إدارة الوصول إلى الموقع"], tap: "+ إضافة مستخدمين" },
      { title: "اكتب بريدنا واختر الدور «محرر» ثم «إضافة»", screen: [AGENCY_EMAIL, "الدور: محرر"], tap: "إضافة" },
    ],
  },
];

export const accessStatuses = ["تمت الإضافة", "سأضيفها لاحقاً", "لا يوجد لدي حساب"];
