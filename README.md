# أثر للذكاء الاصطناعي — الموقع الرسمي

موقع وكالة أثر (Athar AI Agency): Next.js (App Router) + Tailwind CSS v4 + Framer Motion. اللغة العربية فقط، اتجاه RTL عالميًا (`<html lang="ar" dir="rtl">`) مع خصائص CSS المنطقية. الهوية: كحلي داكن `#0B132B` مع أزرق نيون `#00D4FF`، وخطوط Cairo (العناوين) وTajawal (النصوص).

## التشغيل محليًا

```bash
npm install
cp .env.example .env.local   # ثم ضع مفتاح Resend
npm run dev                  # http://localhost:3000
```

## الأوامر

| الأمر | الوظيفة |
|---|---|
| `npm run dev` | خادم التطوير (Turbopack) |
| `npm run build` | بناء الإنتاج |
| `npm start` | تشغيل نسخة الإنتاج |
| `npm run lint` | ESLint |

## متغيرات البيئة

| المتغير | الوصف |
|---|---|
| `RESEND_API_KEY` | مفتاح Resend لإرسال رسائل نموذج التواصل (مطلوب في الإنتاج) |
| `RESEND_FROM` | المرسل الموثّق، افتراضيًا `onboarding@resend.dev` |
| `CONTACT_TO` | صندوق الاستلام، افتراضيًا `athar.digital.agrncy@gmail.com` |
| `WHATSAPP_VERIFY_TOKEN` | كلمة تختارها لتأكيد Webhook في Meta |
| `WHATSAPP_APP_SECRET` | App Secret من تطبيق Meta (للتحقق من توقيع الرسائل) |
| `WHATSAPP_ACCESS_TOKEN` | توكن دائم (System User) بصلاحية `whatsapp_business_messaging` |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone number ID لرقم الوكالة في WhatsApp Cloud API |
| `WHATSAPP_OWNER_NUMBER` | (اختياري) رقم شخصي يستقبل تنبيهات الحجوزات والتحويل لموظف، مثل `9665XXXXXXXX` |
| `OPENAI_API_KEY` | مفتاح OpenAI للردود الذكية؛ بدونه يعمل البوت بقائمة ردود ثابتة |
| `OPENAI_MODEL` | (اختياري) افتراضيًا `gpt-4o-mini` |

### بوت واتساب

Webhook: `https://atherdigitalagency.com/api/whatsapp` (اشترك في حقل `messages`). البوت يجيب عن الباقات والأسعار من `src/lib/site.ts`، يحجز استشارة مجانية، ويحوّل لموظف عند الطلب (يتوقف عن الرد لذلك العميل 12 ساعة). تنبيهات الحجز تصل بالبريد عبر Resend وإلى `WHATSAPP_OWNER_NUMBER`. حالة المحادثات محفوظة في الذاكرة وتُفقد عند إعادة تشغيل الخادم.

بدون مفتاح في بيئة التطوير تُسجَّل الرسالة في الطرفية بدل إرسالها. في الإنتاج بدون مفتاح يعيد المسار `503`.

## البنية

```
src/app/            الصفحات: / , /about , /services , /contact , /contact/thank-you , /privacy , /api/contact
src/components/     layout (الهيدر، قائمة الجوال، الفوتر) · home (المقدمة، نقاط الألم، الخدمات، الخطوات، الباقات، الأسئلة) · contact · ui
src/lib/site.ts     المحتوى: نصوص المقدمة، نقاط الألم، الخدمات، الباقات الثلاث، الأسئلة الشائعة
src/lib/contact.ts  مخطط التحقق (zod) وتطبيع رقم الجوال السعودي
```

## النشر

أي استضافة تدعم Next.js (Vercel، Netlify، أو خادم Node بـ `npm run build && npm start`). ملاحظة: التصدير الثابت (`output: "export"`) يعطّل مسار `/api/contact`؛ في هذه الحالة يجب تحويل النموذج إلى خدمة من جهة المتصفح مثل EmailJS.
