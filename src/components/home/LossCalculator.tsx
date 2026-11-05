"use client";

import { useId, useState } from "react";

const fmt = (n: number) => new Intl.NumberFormat("ar-SA-u-nu-latn").format(Math.round(n));

export function LossCalculator() {
  const [perDay, setPerDay] = useState(2);
  const [value, setValue] = useState(1500);
  const id = useId();
  const monthly = perDay * 26 * value;
  const yearly = monthly * 12;

  return (
    <div className="card p-6 sm:p-8">
      <p className="label">احسبها بنفسك</p>
      <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">كم تخسر سنويًا بسبب الاستفسارات التي لا تُجاب؟</h3>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between text-sm">
            <label htmlFor={`${id}-perday`} className="text-white/80">
              استفسارات ضائعة يوميًا
            </label>
            <span className="font-display font-bold text-neon">{perDay}</span>
          </div>
          <input id={`${id}-perday`} type="range" min={1} max={15} step={1} value={perDay} onChange={(e) => setPerDay(Number(e.target.value))} className="mt-3 w-full" />
        </div>
        <div>
          <div className="flex items-center justify-between text-sm">
            <label htmlFor={`${id}-value`} className="text-white/80">
              متوسط قيمة العميل (ر.س)
            </label>
            <span className="font-display font-bold text-neon">{fmt(value)}</span>
          </div>
          <input id={`${id}-value`} type="range" min={200} max={20000} step={100} value={value} onChange={(e) => setValue(Number(e.target.value))} className="mt-3 w-full" />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2" aria-live="polite">
        <div className="rounded-2xl border border-line bg-white/5 p-5">
          <p className="text-xs text-muted">خسارة شهرية تقديرية</p>
          <p className="mt-1 font-display text-2xl font-extrabold text-white">
            {fmt(monthly)} <span className="text-base font-bold text-muted">ر.س</span>
          </p>
        </div>
        <div className="rounded-2xl border border-neon/40 bg-neon/10 p-5">
          <p className="text-xs text-neon">خسارة سنوية تقديرية</p>
          <p className="mt-1 font-display text-2xl font-extrabold text-white">
            {fmt(yearly)} <span className="text-base font-bold text-neon">ر.س</span>
          </p>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted">مثال توضيحي بافتراض 26 يوم عمل شهريًا. الأرقام الفعلية تختلف حسب نشاطك.</p>
    </div>
  );
}
