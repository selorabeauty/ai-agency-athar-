export const site = {
  name: "أثر للذكاء الاصطناعي",
  wordmark: "أثر.",
  tagline: "للذكاء الاصطناعي",
  email: "pchoarder@gmail.com",
  whatsapp: "+966500000000",
  city: "الرياض، المملكة العربية السعودية",
};

export const nav = [
  { href: "/services", label: "خدماتنا" },
  { href: "/about", label: "من نحن" },
  { href: "/#portfolio", label: "نماذج الأعمال" },
];

export type Service = {
  id: string;
  number: string;
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  bullets: string[];
  image: string;
  detail: string;
  tone: "icy" | "navy" | "pale";
  textShare: string;
};

export const services: Service[] = [
  {
    id: "chatbots",
    number: "01",
    slug: "/services#chatbots",
    title: "شات بوت واتساب بالذكاء الاصطناعي",
    kicker: "استقبال لا ينام",
    summary:
      "موظف استقبال رقمي يجيب على عملائك خلال ثوانٍ، يحجز المواعيد، ويؤهّل الطلبات على مدار الساعة — بلهجة سعودية طبيعية.",
    bullets: ["حجز مواعيد مباشر في التقويم", "تحويل فوري لموظف بشري عند الحاجة", "ذاكرة كاملة لسياق العميل"],
    image: "/images/phone-chat.jpg",
    detail: "/images/server-glow.jpg",
    tone: "icy",
    textShare: "42%",
  },
  {
    id: "maps",
    number: "02",
    slug: "/services#maps",
    title: "الظهور في خرائط قوقل والتقييمات",
    kicker: "أن تُرى أولًا",
    summary:
      "نرفع منشأتك إلى الصفوف الأولى في خرائط قوقل داخل حيّك، ونبني محرك تقييمات تلقائيًا يحوّل كل زيارة إلى توصية.",
    bullets: ["تهيئة كاملة للملف التجاري", "طلب تقييمات تلقائي بعد كل زيارة", "تقرير شهري بلغة واضحة"],
    image: "/images/riyadh-office.jpg",
    detail: "/images/dashboard.jpg",
    tone: "navy",
    textShare: "42%",
  },
  {
    id: "crm",
    number: "03",
    slug: "/services#crm",
    title: "المواقع وأنظمة CRM المؤتمتة",
    kicker: "نظام يعمل بلا إشراف",
    summary:
      "موقع فاخر بهوية سعودية، مربوط بنظام إدارة عملاء يتابع كل طلب من أول رسالة حتى إتمام الصفقة — تلقائيًا.",
    bullets: ["تصميم تحريري بمعايير عالمية", "لوحة متابعة للعملاء المحتملين", "تنبيهات واتساب للفريق"],
    image: "/images/meeting.jpg",
    detail: "/images/architecture.jpg",
    tone: "pale",
    textShare: "40%",
  },
];

export type Sector = {
  id: string;
  label: string;
  headline: string;
  pain: string;
  solution: string;
  href: string;
  image: string;
};

export const sectors: Sector[] = [
  {
    id: "clinics",
    label: "العيادات",
    headline: "كل استفسار بعد ساعات الدوام هو موعد ضائع.",
    pain: "عيادات الأسنان والتجميل تفقد حجوزات يوميًا بسبب رسائل واتساب بلا رد، ومواعيد لا تُؤكَّد، وتقييمات لا تُطلب.",
    solution: "استقبال ذكي يحجز ويؤكّد ويذكّر، ومحرك تقييمات يرفعك في خرائط الحي.",
    href: "/services#chatbots",
    image: "/images/clinic.jpg",
  },
  {
    id: "law",
    label: "مكاتب المحاماة",
    headline: "الثقة تبدأ من أول انطباع رقمي.",
    pain: "العميل يبحث عن مكتبك قبل أن يتصل. موقع قديم أو غياب عن الخرائط يعني أن القضية تذهب لمنافس.",
    solution: "حضور رقمي رصين، وفرز أولي للطلبات يحوّل الجاد منها إلى موعد استشارة.",
    href: "/services#maps",
    image: "/images/law.jpg",
  },
  {
    id: "factories",
    label: "المصانع",
    headline: "المشتري الصناعي يبدأ من قوقل، لا من المعرض.",
    pain: "المصانع وموردو مواد البناء يعتمدون على العلاقات، بينما طلبات التسعير تضيع في بريد لا يُقرأ.",
    solution: "كتالوج رقمي فاخر، وبوت تسعير يؤهّل الطلب ويرسله لفريق المبيعات فورًا.",
    href: "/services#crm",
    image: "/images/factory.jpg",
  },
];

export const testimonials = [
  {
    quote: "خلال أول شهر، أصبح الرد على المرضى لحظيًا حتى في منتصف الليل. ارتفعت الحجوزات المؤكدة دون أن نوظّف أحدًا.",
    name: "د. ريم العتيبي",
    role: "المديرة الطبية، عيادة تجميل — الرياض",
  },
  {
    quote: "أول مرة يصلني عميل يقول: وجدتكم في خرائط قوقل. النظام يعمل بصمت ونحن نركّز على القضايا.",
    name: "أ. فهد الشمري",
    role: "شريك مؤسس، مكتب محاماة — جدة",
  },
  {
    quote: "طلبات التسعير صارت تصل مرتّبة ومصنّفة قبل أن يفتح فريق المبيعات جواله. هذا بالضبط ما كنا نحتاجه.",
    name: "م. سلطان القحطاني",
    role: "مدير المبيعات، مصنع حديد — الدمام",
  },
];

export const heroScenes = [
  { label: "وقت أكثر.", word: "أتمتة.", support: "نحوّل زوارك إلى عملاء فعليين." },
  { label: "عملاء أكثر.", word: "نمو.", support: "نرفعك إلى الصفوف الأولى حيث يبحث عملاؤك." },
  { label: "وضوح أكثر.", word: "سيطرة.", support: "لوحة واحدة ترى منها كل طلب وكل موعد." },
];
