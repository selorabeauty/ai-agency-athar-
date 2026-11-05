import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get('name') ?? '').trim();
  const phone = String(form.get('phone') ?? '').trim();
  const service = String(form.get('service') ?? '').trim();

  if (!name || !phone) {
    return NextResponse.json({ error: 'الاسم ورقم التواصل مطلوبان' }, { status: 400 });
  }

  if (process.env.RESEND_API_KEY) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? 'onboarding@resend.dev',
        to: process.env.CONTACT_TO ?? 'pchoarder@gmail.com',
        subject: `طلب جديد من ${name}`,
        text: `الاسم/النشاط: ${name}\nالتواصل: ${phone}\nالخدمة: ${service}`,
      }),
    });
  } else {
    console.log('[contact]', { name, phone, service });
  }

  return NextResponse.redirect(new URL('/contact/thank-you', request.url));
}
