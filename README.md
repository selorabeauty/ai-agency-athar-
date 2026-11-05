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
