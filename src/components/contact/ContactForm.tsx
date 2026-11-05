"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { contactSchema, sectorOptions } from "@/lib/contact";
import { packageName } from "@/lib/site";

type Fields = "name" | "email" | "whatsapp" | "sector" | "message";
const fieldOrder: Fields[] = ["name", "email", "whatsapp", "sector", "message"];

const inputCls =
  "w-full rounded-xl border border-line bg-white/5 px-4 py-3 text-white placeholder:text-muted/70 outline-none transition focus:border-neon focus:bg-white/[0.07] aria-[invalid=true]:border-red-400";
const labelCls = "mb-2 block text-sm font-medium text-white/85";

export function ContactForm() {
  const router = useRouter();
  const params = useSearchParams();
  const pkg = packageName(params.get("package") ?? "");
  const [errors, setErrors] = useState<Partial<Record<Fields | "form", string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const lastSubmit = useRef<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status !== "idle") return;
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      const next: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as Fields;
        if (!next[k]) next[k] = issue.message;
      }
      setErrors(next);
      const first = fieldOrder.find((f) => next[f]);
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const signature = JSON.stringify(parsed.data);
    if (signature === lastSubmit.current) {
      router.push("/contact/thank-you");
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(raw),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Record<string, string> };
      if (!res.ok || !json.ok) {
        setErrors({ ...(json.fields ?? {}), form: json.error ?? "حدث خطأ غير متوقع" });
        setStatus("idle");
        return;
      }
      lastSubmit.current = signature;
      setStatus("sent");
      router.push("/contact/thank-you");
    } catch {
      setErrors({ form: "تعذّر الاتصال بالخادم، تحقق من الشبكة" });
      setStatus("idle");
    }
  }

  const err = (f: Fields) =>
    errors[f] ? (
      <p id={`${f}-error`} role="alert" className="mt-2 text-xs text-red-300">
        {errors[f]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-6 p-6 sm:p-8" aria-describedby={errors.form ? "form-error" : undefined}>
      {pkg && (
        <p className="rounded-xl border border-neon/30 bg-neon/10 px-4 py-3 text-sm text-white">
          الباقة المختارة: <span className="font-bold text-neon">{pkg}</span>
        </p>
      )}

      <div>
        <label htmlFor="name" className={labelCls}>الاسم الكامل</label>
        <input id="name" name="name" type="text" autoComplete="name" placeholder="مثال: محمد العتيبي" required className={inputCls} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
        {err("name")}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelCls}>البريد الإلكتروني</label>
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="name@company.sa" required className={inputCls} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="whatsapp" className={labelCls}>رقم الواتساب</label>
          <input id="whatsapp" name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" placeholder="05xxxxxxxx" required className={inputCls} aria-invalid={!!errors.whatsapp} aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined} />
          {err("whatsapp")}
        </div>
      </div>

      <div>
        <label htmlFor="sector" className={labelCls}>القطاع</label>
        <div className="relative">
          <select id="sector" name="sector" required defaultValue="" className={`${inputCls} appearance-none pe-10`} aria-invalid={!!errors.sector} aria-describedby={errors.sector ? "sector-error" : undefined}>
            <option value="" disabled>
              اختر القطاع
            </option>
            {sectorOptions.map((o) => (
              <option key={o.value} value={o.value} className="bg-navy">
                {o.label}
              </option>
            ))}
          </select>
          <span aria-hidden className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-muted">
            ⌄
          </span>
        </div>
        {err("sector")}
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>كيف يمكننا مساعدتك؟</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="صف نشاطك وأكبر تحدٍّ تواجهه في الردّ على العملاء أو جلبهم"
          defaultValue={pkg ? `أرغب في الاستفسار عن ${pkg}.\n` : ""}
          className={`${inputCls} resize-y`}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {err("message")}
      </div>

      <div className="absolute -z-10 h-0 w-0 overflow-hidden opacity-0" aria-hidden>
        <label htmlFor="website">الموقع الإلكتروني</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {errors.form && (
        <p id="form-error" role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errors.form}
        </p>
      )}

      <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status !== "idle"}
          className="btn-neon inline-flex h-12 items-center gap-2 rounded-full px-8 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "جارٍ الإرسال…" : status === "sent" ? "تم الإرسال" : "أرسل الطلب"} <span aria-hidden>↗</span>
        </button>
        <p className="text-xs text-muted">نرد خلال يوم عمل واحد. بياناتك لا تُشارك مع أي طرف ثالث.</p>
      </div>
    </form>
  );
}
