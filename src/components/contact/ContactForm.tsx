"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { contactSchema, sectorOptions } from "@/lib/contact";

type Fields = "name" | "email" | "whatsapp" | "sector" | "message";
const fieldOrder: Fields[] = ["name", "email", "whatsapp", "sector", "message"];

const inputCls =
  "peer w-full border-0 border-b border-line bg-transparent px-0 pt-6 pb-2 text-navy outline-none transition focus:border-navy aria-[invalid=true]:border-red-500";
const labelCls =
  "pointer-events-none absolute start-0 top-6 text-sm text-muted transition-all peer-focus:top-0 peer-focus:text-[11px] peer-focus:tracking-[0.12em] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:tracking-[0.12em]";

export function ContactForm() {
  const router = useRouter();
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
      <p id={`${f}-error`} role="alert" className="mt-2 text-xs text-red-600">
        {errors[f]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8" aria-describedby={errors.form ? "form-error" : undefined}>
      <div className="relative">
        <input id="name" name="name" type="text" autoComplete="name" placeholder=" " required className={inputCls} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
        <label htmlFor="name" className={labelCls}>الاسم الكامل</label>
        {err("name")}
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="relative">
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" placeholder=" " required className={inputCls} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
          <label htmlFor="email" className={labelCls}>البريد الإلكتروني</label>
          {err("email")}
        </div>
        <div className="relative">
          <input id="whatsapp" name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" placeholder=" " required className={inputCls} aria-invalid={!!errors.whatsapp} aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined} />
          <label htmlFor="whatsapp" className={labelCls}>رقم الواتساب</label>
          {err("whatsapp")}
        </div>
      </div>

      <div className="relative">
        <select id="sector" name="sector" required defaultValue="" className={`${inputCls} appearance-none`} aria-invalid={!!errors.sector} aria-describedby={errors.sector ? "sector-error" : undefined}>
          <option value="" disabled>
            اختر القطاع
          </option>
          {sectorOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <label htmlFor="sector" className="label pointer-events-none absolute start-0 top-0 text-muted">
          القطاع
        </label>
        <span aria-hidden className="pointer-events-none absolute end-0 bottom-3 text-muted">
          ⌄
        </span>
        {err("sector")}
      </div>

      <div className="relative">
        <textarea id="message" name="message" rows={5} placeholder=" " required className={`${inputCls} resize-y`} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} />
        <label htmlFor="message" className={labelCls}>كيف يمكننا مساعدتك؟</label>
        {err("message")}
      </div>

      <div className="absolute -z-10 h-0 w-0 overflow-hidden opacity-0" aria-hidden>
        <label htmlFor="website">الموقع الإلكتروني</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {errors.form && (
        <p id="form-error" role="alert" className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.form}
        </p>
      )}

      <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status !== "idle"}
          className="pill-gradient inline-flex h-12 items-center gap-2 rounded-full px-8 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "جارٍ الإرسال…" : status === "sent" ? "تم الإرسال" : "أرسل الطلب"} <span aria-hidden>↗</span>
        </button>
        <p className="text-xs text-muted">نرد خلال يوم عمل واحد. بياناتك لا تُشارك مع أي طرف ثالث.</p>
      </div>
    </form>
  );
}
