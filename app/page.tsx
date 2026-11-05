import {
  ArrowLeft,
  Bot,
  Check,
  ChevronDown,
  Globe2,
  MessageCircle,
  Sparkles,
  Star,
  Workflow,
} from 'lucide-react';

const services = [
  {
    icon: Globe2,
    title: 'مواقع تبيع، لا مجرد مواقع',
    text: 'تصميم عربي سريع ومتجاوب يشرح خدمتك بوضوح ويقود الزائر إلى الحجز أو الطلب.',
    points: ['تصميم فاخر ومتوافق مع الجوال', 'صفحات هبوط للحملات', 'تهيئة أولية لمحركات البحث'],
  },
  {
    icon: Bot,
    title: 'موظف استقبال يعمل 24/7',
    text: 'مساعد ذكي يرد على الأسئلة المتكررة، يجمع بيانات العميل، ويحجز الموعد عند الحاجة.',
    points: ['عربي وإنجليزي', 'تحويل الحالات المهمة للبشر', 'ربط واتساب ونماذج التواصل'],
  },
  {
    icon: Workflow,
    title: 'متابعة تمنع ضياع العملاء',
    text: 'نربط الزيارات والرسائل والحجوزات في تدفق واضح حتى لا تضيع فرصة بعد أول تواصل.',
    points: ['تنبيهات فورية للفريق', 'متابعة تلقائية للمهتمين', 'تقارير مفهومة عن العملاء'],
  },
];

const faqs = [
  ['هل أحتاج إلى فريق تقني؟', 'لا. نبني النظام ونسلمه لك جاهزاً مع شرح بسيط ودعم مستمر حسب الباقة.'],
  ['كم يستغرق إطلاق الموقع؟', 'النسخة الأولى عادة خلال 7 إلى 14 يوماً بعد استلام المحتوى والوصولات المطلوبة.'],
  ['هل يعمل المساعد مع واتساب؟', 'نعم، نبدأ بتدفق واتساب ونموذج الموقع، ثم نضيف التكامل المناسب حسب أدوات نشاطك.'],
];

export default function HomePage() {
  return (
    <main>
      <nav className="nav shell">
        <a className="brand" href="#top" aria-label="أثر">
          <span className="brand-mark">أ</span>
          <span>أثر<span className="brand-dot">.</span></span>
        </a>
        <div className="nav-links">
          <a href="#services">خدماتنا</a>
          <a href="#process">كيف نعمل</a>
          <a href="#faq">أسئلة شائعة</a>
        </div>
        <a className="button button-small button-dark" href="#contact">ابدأ محادثة <ArrowLeft size={16} /></a>
      </nav>

      <section id="top" className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> أثر رقمي واضح لأعمال الخليج</div>
          <h1>حوّل اهتمام العملاء إلى <em>أثر</em> ينمو معك.</h1>
          <p className="hero-text">نبني مواقع ذكية وتجارب محادثة عربية تجعل نشاطك أسهل في الاكتشاف، أسرع في الرد، وأقرب إلى الحجز والشراء.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contact">احجز جلسة مجانية <ArrowLeft size={18} /></a>
            <a className="text-link" href="#services">اكتشف ما نقدمه <ArrowLeft size={16} /></a>
          </div>
          <div className="proof-row">
            <div className="avatars"><span>ن</span><span>م</span><span>س</span><span>+</span></div>
            <div><div className="stars"><Star size={14} fill="currentColor" /> <Star size={14} fill="currentColor" /> <Star size={14} fill="currentColor" /> <Star size={14} fill="currentColor" /> <Star size={14} fill="currentColor" /></div><small>تجارب رقمية تبني الثقة</small></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="dashboard-card">
            <div className="dash-top"><span>ملخص هذا الأسبوع</span><span className="live-dot">● مباشر</span></div>
            <div className="dash-number">+38%</div>
            <div className="dash-caption">زيادة في العملاء المحتملين</div>
            <div className="chart"><i /><i /><i /><i /><i /><i /><i /><i /></div>
            <div className="dash-bottom"><span>زيارات الموقع</span><strong>2,840</strong></div>
          </div>
          <div className="chat-card">
            <div className="chat-heading"><span className="bot-icon"><Bot size={17} /></span><strong>مساعد أثر</strong><small>متصل الآن</small></div>
            <div className="bubble bubble-gray">أهلاً! كيف أقدر أساعدك اليوم؟</div>
            <div className="bubble bubble-blue">أبغى أحجز موعد استشارة</div>
            <div className="bubble bubble-gray">أكيد، ما الوقت المناسب لك؟</div>
          </div>
          <div className="float-badge"><Check size={15} /> عميل جديد</div>
        </div>
      </section>

      <section className="marquee-band"><div className="marquee-inner"><span>مواقع أسرع</span><b>✦</b><span>محادثات أذكى</span><b>✦</b><span>نتائج أوضح</span><b>✦</b><span>مواقع أسرع</span><b>✦</b><span>محادثات أذكى</span></div></section>

      <section id="services" className="section shell">
        <div className="section-intro"><div><div className="eyebrow">ما الذي نبنيه؟</div><h2>كل نقطة تواصل<br /><em>تترك أثراً.</em></h2></div><p>لا نبدأ من القوالب. نبدأ من سؤال واحد: ما الذي يحتاجه عميلك ليأخذ الخطوة التالية بثقة؟</p></div>
        <div className="service-grid">{services.map(({ icon: Icon, title, text, points }, index) => <article className={`service-card ${index === 1 ? 'service-featured' : ''}`} key={title}><div className="service-icon"><Icon size={22} /></div><span className="service-index">0{index + 1}</span><h3>{title}</h3><p>{text}</p><ul>{points.map(point => <li key={point}><Check size={15} />{point}</li>)}</ul><a href="#contact">اعرف أكثر <ArrowLeft size={15} /></a></article>)}</div>
      </section>

      <section id="process" className="dark-section"><div className="shell"><div className="section-intro light-intro"><div><div className="eyebrow">من الفكرة إلى الإطلاق</div><h2>بسيط من البداية،<br /><em>قوي في النتيجة.</em></h2></div><p>نرتب التعقيد خلف الكواليس، ونترك لك تجربة واضحة تستطيع استخدامها وقياسها.</p></div><div className="process-grid">{[['01', 'نسمع', 'نفهم نشاطك، عميلك، والفرصة التي تضيع اليوم.'], ['02', 'نبني', 'نصمم تجربة متكاملة ونختبرها على الجوال قبل أي إطلاق.'], ['03', 'نطلق', 'ننشر، نربط الأدوات، ونسلمك لوحة واضحة للمتابعة.'], ['04', 'نطوّر', 'نقرأ البيانات ونحسّن ما يرفع الحجوزات والطلبات.']].map(([number, title, text]) => <div className="process-item" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>

      <section className="quote-section shell"><div className="quote-mark">“</div><blockquote>العميل لا يحتاج أن يعرف كم هي التقنية خلف التجربة. يحتاج فقط أن يشعر أن الوصول إليك أصبح أسهل.</blockquote><div className="quote-line" /></section>

      <section id="faq" className="section shell faq-section"><div className="section-intro"><div><div className="eyebrow">أسئلة شائعة</div><h2>نزيل التعقيد<br /><em>قبل أن يبدأ.</em></h2></div></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div></section>

      <section id="contact" className="contact-section shell"><div className="contact-panel"><div><div className="eyebrow">خطوتك التالية</div><h2>جاهز تترك <em>أثراً</em>؟</h2><p>أرسل لنا نبذة بسيطة عن نشاطك. نرجع لك خلال يوم عمل بخطوة واضحة، بدون عروض معقدة أو التزام.</p></div><form action="/api/contact" method="post"><label>الاسم أو اسم النشاط<input name="name" required placeholder="مثال: عيادات النور" /></label><label>رقم التواصل<input name="phone" required placeholder="05xxxxxxxx" dir="ltr" /></label><label>كيف نساعدك؟<select name="service" defaultValue=""><option value="" disabled>اختر الخدمة</option><option>موقع إلكتروني</option><option>مساعد محادثة وحجوزات</option><option>حل رقمي متكامل</option></select></label><button className="button button-primary" type="submit">ابدأ الحديث <ArrowLeft size={18} /></button></form></div></section>

      <footer className="footer shell"><div className="brand"><span className="brand-mark">أ</span><span>أثر<span className="brand-dot">.</span></span></div><p>حلول رقمية تترك أثراً.</p><div className="footer-links"><a href="#services">الخدمات</a><a href="#contact">تواصل معنا</a><a href="mailto:hello@atherdigitalagency.com">hello@atherdigitalagency.com</a></div></footer>
    </main>
  );
}
