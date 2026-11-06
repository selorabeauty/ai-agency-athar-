"use client";

import { useEffect, useRef, useState } from "react";
import { ContractPages, QuotePage } from "./DocPages";
import { renderPdf, safeName, shareOrDownload, type ClientSignature, type DocModel, BRAND } from "./model";
import { SignaturePad } from "./SignaturePad";

type View = { id: string; ref: string; doc: DocModel; signed?: ClientSignature };

export function SignClient({ id }: { id: string }) {
  const [view, setView] = useState<View | null>(null);
  const [state, setState] = useState<"loading" | "missing" | "ready">("loading");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [scale, setScale] = useState(0.45);
  const wrap = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/sign/${id}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((v: View) => {
        setView(v);
        setName(v.doc.client);
        setState("ready");
      })
      .catch(() => setState("missing"));
  }, [id]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(1, (el.clientWidth - 2) / 794)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [state]);

  async function submit() {
    if (!agree || !image || name.trim().length < 2) {
      setError("اكتب اسمك، ووقّع داخل المربع، وأكّد الموافقة على البنود.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const r = await fetch(`/api/sign/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image, agree }),
      });
      if (r.status === 409) setError("هذا العقد موقّع مسبقاً.");
      else if (!r.ok) setError("تعذّر حفظ التوقيع، حاول مرة ثانية.");
      else {
        setView(await r.json());
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setError("تعذّر الاتصال، تأكد من الإنترنت وحاول مرة ثانية.");
    } finally {
      setBusy(false);
    }
  }

  async function download() {
    if (!view) return;
    setBusy(true);
    try {
      const pages = Array.from(pagesRef.current!.querySelectorAll<HTMLElement>("[data-page]"));
      const ordered = [...pages.filter((p) => p.dataset.page!.startsWith("contract")), ...pages.filter((p) => p.dataset.page!.startsWith("quote"))];
      const blob = await renderPdf(ordered);
      await shareOrDownload([{ name: `عقد موقّع - ${safeName(view.doc.client)}.pdf`, blob }], `${BRAND} — عقد موقّع`);
    } catch (e) {
      setError("تعذّر إنشاء الملف: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setBusy(false);
    }
  }

  if (state === "loading") return <section className="container-x py-16 text-center text-white/70">جاري تحميل العقد...</section>;
  if (state === "missing" || !view)
    return <section className="container-x py-16 text-center text-white/80">الرابط غير صحيح أو انتهت صلاحيته. تواصل مع {BRAND}.</section>;

  const signed = view.signed ? { ref: view.ref, client: view.signed } : undefined;

  return (
    <section className="container-x py-8 lg:py-12">
      <div className="mx-auto max-w-[820px]">
        <h1 className="text-2xl text-white">{signed ? "تم توقيع العقد ✓" : "مراجعة العقد وتوقيعه"}</h1>
        <p className="mt-2 text-sm text-white/70">
          {signed
            ? `شكراً ${view.signed!.name}. تم حفظ توقيعك، ونسخة العقد الموقّعة جاهزة للتحميل.`
            : `مرحباً ${view.doc.client}، هذا عقد «${view.doc.pkg.name}» وعرض السعر المرفق به من ${BRAND}. راجعهما ثم وقّع في الأسفل.`}
        </p>

        {signed && (
          <button type="button" onClick={download} disabled={busy} className="btn-neon mt-5 flex h-12 w-full items-center justify-center rounded-full font-bold disabled:opacity-60">
            {busy ? "جاري التجهيز..." : "تحميل / مشاركة العقد الموقّع PDF"}
          </button>
        )}

        <div ref={wrap} className="mt-6 overflow-hidden rounded-2xl border border-line bg-white/5 p-0">
          <div style={{ height: 1123 * scale * 3 + 16 * 2, width: 794 * scale }} className="mx-auto">
            <div ref={pagesRef} style={{ transform: `scale(${scale})`, transformOrigin: "top right", width: 794 }} className="space-y-[16px]">
              <ContractPages doc={view.doc} signed={signed} />
              <QuotePage doc={view.doc} signed={signed} />
            </div>
          </div>
        </div>

        {!signed && (
          <div className="card mt-6 space-y-4 p-5">
            <h2 className="text-lg text-white">التوقيع</h2>
            <input
              className="w-full rounded-xl border border-line bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-neon/60 focus:outline-none"
              placeholder="اسمك الكامل"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <SignaturePad value={image} onChange={setImage} />
            <label className="flex items-start gap-3 text-sm text-white/85">
              <input type="checkbox" className="mt-1" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              قرأت العقد وعرض السعر المرفق، وأوافق على جميع البنود، وأقرّ بأن توقيعي الإلكتروني ملزم كالتوقيع الخطي.
            </label>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="button" onClick={submit} disabled={busy} className="btn-neon flex h-12 w-full items-center justify-center rounded-full font-bold disabled:opacity-60">
              {busy ? "جاري الحفظ..." : "توقيع واعتماد العقد"}
            </button>
          </div>
        )}
        {signed && error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>
    </section>
  );
}
