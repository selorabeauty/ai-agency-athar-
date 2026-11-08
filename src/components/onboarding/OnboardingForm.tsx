"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AccessGuide } from "./AccessGuide";
import { DropZone } from "./DropZone";
import { AGENCY_BRAND, businessTypes, days, fileCategories, MAX_TOTAL_BYTES, packageOptions, type FileCategory } from "@/lib/onboarding/config";
import { whatsappLink } from "@/lib/site";

const field = "w-full rounded-xl border border-line bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-neon/60 focus:outline-none";
const label = "mb-1.5 block text-xs font-bold text-white/80";

type Hours = { day: string; open: boolean; from: string; to: string };
const defaultHours: Hours[] = days.map((d) => ({ day: d, open: d !== "الجمعة", from: "09:00", to: "22:00" }));

const socials = [
  ["instagram", "إنستغرام"],
  ["tiktok", "تيك توك"],
  ["snapchat", "سناب شات"],
  ["x", "X (تويتر)"],
  ["website", "موقعك الحالي (إن وجد)"],
] as const;

export function OnboardingForm() {
  const [typeId, setTypeId] = useState("");
  const [v, setV] = useState({
    businessName: "",
    contactName: "",
    phone: "",
    whatsapp: "",
    email: "",
    city: "",
    address: "",
    mapsLink: "",
    package: "",
    hoursNote: "",
    brandColors: "",
    mediaLink: "",
    notes: "",
    website: "",
  });
  const [details, setDetails] = useState<Record<string, string>>({});
  const [social, setSocial] = useState<Record<string, string>>({});
  const [hours, setHours] = useState<Hours[]>(defaultHours);
  const [access, setAccess] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<FileCategory, File[]>>({ logo: [], photos: [], prices: [] });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [ref, setRef] = useState("");

  useEffect(() => {
    if (ref) window.scrollTo({ top: 0 });
  }, [ref]);

  const type = businessTypes.find((b) => b.id === typeId);
  const totalBytes = useMemo(() => Object.values(files).flat().reduce((s, f) => s + f.size, 0), [files]);
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setV((s) => ({ ...s, [k]: e.target.value }));
  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-red-300">{errors[k]}</p>;

  function validate() {
    const e: Record<string, string> = {};
    if (!typeId) e.businessType = "اختر نوع النشاط";
    if (v.businessName.trim().length < 2) e.businessName = "اكتب اسم النشاط";
    if (v.contactName.trim().length < 2) e.contactName = "اكتب اسم المسؤول";
    if (!/^\+?[0-9\s-]{8,18}$/.test(v.phone.trim())) e.phone = "اكتب رقم جوال صحيح";
    if (v.whatsapp && !/^\+?[0-9\s-]{8,18}$/.test(v.whatsapp.trim())) e.whatsapp = "رقم غير صالح";
    if (v.email && !/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = "بريد غير صالح";
    if (v.city.trim().length < 2) e.city = "اكتب المدينة";
    if (!consent) e.consent = "يلزم الموافقة للمتابعة";
    if (totalBytes > MAX_TOTAL_BYTES) e.files = "مجموع حجم الملفات أكبر من 40MB";
    return e;
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setError("");
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      setError("فيه حقول تحتاج تعديل، راجع الخانات المعلّمة بالأحمر.");
      document.getElementById(`f-${Object.keys(e)[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const fd = new FormData();
    fd.append("data", JSON.stringify({ ...v, businessType: typeId, details, social, hours, access, consent }));
    (Object.keys(files) as FileCategory[]).forEach((c) => files[c].forEach((f) => fd.append(`file:${c}`, f, f.name)));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/onboarding");
    xhr.upload.onprogress = (p) => p.lengthComputable && setProgress(Math.round((p.loaded / p.total) * 100));
    xhr.onload = () => {
      setProgress(null);
      let res: { ok?: boolean; ref?: string; error?: string; fields?: Record<string, string> } = {};
      try {
        res = JSON.parse(xhr.responseText);
      } catch {}
      if (xhr.status === 200 && res.ok) {
        setRef(res.ref || "-");
      } else {
        setErrors(res.fields ?? {});
        setError(res.error || (xhr.status === 413 ? "حجم الملفات كبير جداً، قلّل عدد الصور وحاول مرة ثانية." : "تعذّر الإرسال، حاول مرة ثانية."));
      }
    };
    xhr.onerror = () => {
      setProgress(null);
      setError("انقطع الاتصال أثناء الإرسال، تأكد من الإنترنت وحاول مرة ثانية.");
    };
    setProgress(0);
    xhr.send(fd);
  }

  if (ref) {
    return (
      <div className="card mx-auto max-w-xl p-8 text-center sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neon/15 text-3xl text-neon">✓</div>
        <h2 className="mt-5 text-2xl text-white">وصلتنا بياناتك بنجاح</h2>
        <p className="mt-3 text-white/75">شكراً لك! بيانات {v.businessName} وملفاتها محفوظة بشكل مشفّر، وفريق {AGENCY_BRAND} بيبدأ عليها ويتواصل معك قريباً.</p>
        <p className="mt-6 text-xs text-muted">رقم طلبك</p>
        <p dir="ltr" className="mt-1 font-display text-2xl font-extrabold tracking-wider text-neon">{ref}</p>
        <a href={whatsappLink(`مرحبًا، عبّيت بيانات نشاطي في صفحة ${AGENCY_BRAND}. رقم الطلب: ${ref}`)} target="_blank" rel="noopener noreferrer" className="btn-neon mt-8 inline-flex h-12 items-center justify-center rounded-full px-8 font-bold">
          أبلغنا على واتساب
        </a>
      </div>
    );
  }

  const section = "card space-y-5 p-6 sm:p-8";
  const h2 = (n: number, t: string, sub?: string) => (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neon/50 text-sm font-extrabold text-neon">{n}</span>
      <div>
        <h2 className="text-lg text-white sm:text-xl">{t}</h2>
        {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
      </div>
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-4xl space-y-6">
      <div className={section} id="f-businessType">
        {h2(1, "نوع النشاط", "اختر نشاطك، وتتغير الأسئلة تلقائياً حسب طبيعة عملك.")}
        <div className="grid gap-3 sm:grid-cols-3">
          {businessTypes.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setTypeId(b.id)}
              aria-pressed={typeId === b.id}
              className={`rounded-2xl border p-4 text-start transition ${typeId === b.id ? "border-neon bg-neon/10 shadow-[0_0_30px_-12px_rgba(0,212,255,0.8)]" : "border-line hover:border-neon/50"}`}
            >
              <p className="text-sm font-bold text-white">{b.label}</p>
              <p className="mt-1 text-[11px] text-muted">{b.hint}</p>
            </button>
          ))}
        </div>
        {err("businessType")}
      </div>

      <div className={section}>
        {h2(2, "بيانات النشاط الأساسية")}
        <div className="grid gap-4 sm:grid-cols-2">
          <div id="f-businessName">
            <label className={label} htmlFor="businessName">اسم النشاط *</label>
            <input id="businessName" className={field} value={v.businessName} onChange={set("businessName")} />
            {err("businessName")}
          </div>
          <div id="f-contactName">
            <label className={label} htmlFor="contactName">اسم المسؤول *</label>
            <input id="contactName" className={field} value={v.contactName} onChange={set("contactName")} />
            {err("contactName")}
          </div>
          <div id="f-phone">
            <label className={label} htmlFor="phone">رقم الجوال للتواصل *</label>
            <input id="phone" dir="ltr" inputMode="tel" placeholder="05xxxxxxxx" className={`${field} text-end`} value={v.phone} onChange={set("phone")} />
            {err("phone")}
          </div>
          <div id="f-whatsapp">
            <label className={label} htmlFor="whatsapp">رقم واتساب النشاط (للبوت)</label>
            <input id="whatsapp" dir="ltr" inputMode="tel" placeholder="05xxxxxxxx" className={`${field} text-end`} value={v.whatsapp} onChange={set("whatsapp")} />
            {err("whatsapp")}
          </div>
          <div id="f-email">
            <label className={label} htmlFor="email">البريد الإلكتروني</label>
            <input id="email" dir="ltr" type="email" className={`${field} text-end`} value={v.email} onChange={set("email")} />
            {err("email")}
          </div>
          <div id="f-city">
            <label className={label} htmlFor="city">المدينة *</label>
            <input id="city" className={field} value={v.city} onChange={set("city")} />
            {err("city")}
          </div>
          <div>
            <label className={label} htmlFor="address">الحي / العنوان</label>
            <input id="address" className={field} value={v.address} onChange={set("address")} />
          </div>
          <div>
            <label className={label} htmlFor="mapsLink">رابط موقعك في خرائط جوجل</label>
            <input id="mapsLink" dir="ltr" className={`${field} text-end`} placeholder="https://maps.google.com/..." value={v.mapsLink} onChange={set("mapsLink")} />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="package">الباقة المختارة</label>
            <select id="package" className={field} value={v.package} onChange={set("package")}>
              <option value="">اختر الباقة</option>
              {packageOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {type && (
          <div className="space-y-4 rounded-2xl border border-neon/30 bg-neon/5 p-4 sm:p-5">
            <p className="text-sm font-bold text-neon">أسئلة خاصة بـ {type.label}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {type.fields.map((f) => (
                <div key={`${type.id}-${f.key}`} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                  <label className={label} htmlFor={`d-${f.key}`}>{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea id={`d-${f.key}`} rows={3} className={field} placeholder={f.placeholder} value={details[f.key] ?? ""} onChange={(e) => setDetails((d) => ({ ...d, [f.key]: e.target.value }))} />
                  ) : f.type === "select" ? (
                    <select id={`d-${f.key}`} className={field} value={details[f.key] ?? ""} onChange={(e) => setDetails((d) => ({ ...d, [f.key]: e.target.value }))}>
                      <option value="">اختر</option>
                      {f.options!.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <input id={`d-${f.key}`} className={field} placeholder={f.placeholder} value={details[f.key] ?? ""} onChange={(e) => setDetails((d) => ({ ...d, [f.key]: e.target.value }))} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={section}>
        {h2(3, "أوقات العمل")}
        <div className="space-y-2">
          {hours.map((h, i) => (
            <div key={h.day} className="flex flex-wrap items-center gap-3 rounded-xl border border-line px-3 py-2">
              <label className="flex w-28 items-center gap-2 text-sm text-white">
                <input type="checkbox" checked={h.open} onChange={(e) => setHours((hs) => hs.map((x, j) => (j === i ? { ...x, open: e.target.checked } : x)))} />
                {h.day}
              </label>
              {h.open ? (
                <div className="flex items-center gap-2 text-xs text-muted" dir="ltr">
                  <input type="time" aria-label={`من ${h.day}`} className={`${field} w-28 py-1.5`} value={h.from} onChange={(e) => setHours((hs) => hs.map((x, j) => (j === i ? { ...x, from: e.target.value } : x)))} />
                  –
                  <input type="time" aria-label={`إلى ${h.day}`} className={`${field} w-28 py-1.5`} value={h.to} onChange={(e) => setHours((hs) => hs.map((x, j) => (j === i ? { ...x, to: e.target.value } : x)))} />
                </div>
              ) : (
                <span className="text-xs text-muted">مغلق</span>
              )}
            </div>
          ))}
        </div>
        <div>
          <label className={label} htmlFor="hoursNote">ملاحظات الدوام (مثلاً فترتين أو دوام رمضان)</label>
          <input id="hoursNote" className={field} value={v.hoursNote} onChange={set("hoursNote")} />
        </div>
      </div>

      <div className={section} id="f-files">
        {h2(4, "مركز رفع الملفات", "الصور الكبيرة تتصغّر تلقائياً قبل الرفع. الحد الأقصى للملف 10MB.")}
        <div className="grid gap-5 lg:grid-cols-3">
          {(Object.keys(fileCategories) as FileCategory[]).map((c) => (
            <DropZone key={c} category={c} files={files[c]} onChange={(list) => setFiles((s) => ({ ...s, [c]: list }))} />
          ))}
        </div>
        {err("files")}
        <div>
          <label className={label} htmlFor="mediaLink">رابط فيديوهات أو ملفات إضافية (Google Drive / iCloud) — اختياري</label>
          <input id="mediaLink" dir="ltr" className={`${field} text-end`} value={v.mediaLink} onChange={set("mediaLink")} />
        </div>
      </div>

      <div className={section}>
        {h2(5, "الهوية والحسابات", "روابط حساباتك فقط — لا نطلب أي كلمة مرور.")}
        <div className="grid gap-4 sm:grid-cols-2">
          {socials.map(([k, l]) => (
            <div key={k}>
              <label className={label} htmlFor={`s-${k}`}>{l}</label>
              <input id={`s-${k}`} dir="ltr" className={`${field} text-end`} placeholder="@ أو رابط" value={social[k] ?? ""} onChange={(e) => setSocial((s) => ({ ...s, [k]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label className={label} htmlFor="brandColors">ألوان الهوية (إن وجدت)</label>
            <input id="brandColors" className={field} placeholder="مثال: ذهبي وأسود" value={v.brandColors} onChange={set("brandColors")} />
          </div>
        </div>
      </div>

      <div className={section}>
        {h2(6, "منح الصلاحيات بأمان (بدون كلمات مرور)", "اتبع الخطوات المصوّرة لإضافة بريد الوكالة كمشرف رسمي. تقدر تسويها الحين أو لاحقاً.")}
        <AccessGuide value={access} onChange={setAccess} />
      </div>

      <div className={section}>
        {h2(7, "ملاحظات وإرسال")}
        <div>
          <label className={label} htmlFor="notes">أي تفاصيل إضافية تحب نعرفها</label>
          <textarea id="notes" rows={4} className={field} value={v.notes} onChange={set("notes")} />
        </div>
        <input tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={v.website} onChange={set("website")} />
        <label id="f-consent" className="flex items-start gap-3 text-sm text-white/85">
          <input type="checkbox" className="mt-1" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>
            أوافق على استخدام هذه البيانات والملفات لتنفيذ مشروعي فقط، وفق{" "}
            <Link href="/privacy" target="_blank" className="text-neon underline-offset-4 hover:underline">سياسة الخصوصية</Link>.
          </span>
        </label>
        {err("consent")}
        {error && <p className="rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
        <button type="submit" disabled={progress !== null} className="btn-neon flex h-14 w-full items-center justify-center rounded-full text-base font-bold disabled:opacity-60">
          {progress !== null ? `جاري الإرسال الآمن... ${progress}%` : "إرسال البيانات بأمان"}
        </button>
        {progress !== null && (
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-neon transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </form>
  );
}
