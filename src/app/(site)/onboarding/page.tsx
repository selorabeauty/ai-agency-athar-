import type { Metadata } from "next";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";
import { AGENCY_BRAND } from "@/lib/onboarding/config";

export const metadata: Metadata = {
  title: "بيانات العميل الجديد",
  description: `صفحة آمنة لإرسال بيانات وملفات نشاطك إلى ${AGENCY_BRAND}.`,
  robots: { index: false, follow: false },
};

const assurances = ["تشفير كامل للبيانات والملفات", "بدون أي كلمات مرور", "حساباتك تبقى ملكك"];

export default function OnboardingPage() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="glow-neon pointer-events-none absolute -top-40 start-1/2 h-[600px] w-[600px] translate-x-1/2 opacity-60" />
      <div className="container-x relative py-14 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold tracking-wide text-neon">بوابة العملاء — {AGENCY_BRAND}</p>
          <h1 className="mt-4 text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.3] text-white">أهلاً بك! خلّنا نبدأ مشروعك</h1>
          <p className="mt-4 text-white/75">عبّ بيانات نشاطك وارفع ملفاتك في دقائق، ونستلمها مباشرة ونبدأ التنفيذ.</p>
          <div className="mt-8 rounded-3xl border border-neon/50 bg-neon/10 p-5 text-start sm:p-6">
            <div className="flex items-start gap-3">
              <svg viewBox="0 0 24 24" className="mt-0.5 h-7 w-7 shrink-0 text-neon" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              <p className="font-bold leading-relaxed text-white">
                جميع البيانات والملفات مُشفرة وآمنة تماماً، ولا نطلب نهائياً أي كلمات مرور أو باسورد للحسابات الشخصية.
              </p>
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {assurances.map((a) => (
                <li key={a} className="rounded-full border border-neon/40 px-3 py-1 text-xs text-neon">✓ {a}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10">
          <OnboardingForm />
        </div>
      </div>
    </section>
  );
}
