import { freeMaintenance, packages } from "@/lib/site";

export type Extra = { name: string; price: string };
export type Form = { pkg: string; extras: Extra[]; discount: string; days: string; updatesCap: string };

export type DocModel = {
  number: string;
  date: string;
  pkg: { name: string; target: string; features: string[]; setup: string };
  extras: { name: string; price: number }[];
  discount: number;
  total: number;
  half: number;
  days: string;
  maintenanceTitle: string;
  maintenance: string[];
};

export const BRAND = "آثر ديجيتال";
export const num = (v: string) => Number(v.replace(/[^\d.]/g, "")) || 0;
export const money = (n: number) => `${n.toLocaleString("en-US")} ر.س`;
export const ltr = (s: string) => `\u2066${s}\u2069`;

export function buildDoc(form: Form, meta: { number: string; date: string }): DocModel {
  const pkg = packages.find((p) => p.id === form.pkg) ?? packages[0];
  const extras = form.extras.filter((e) => e.name.trim()).map((e) => ({ name: e.name.trim(), price: num(e.price) }));
  const subtotal = num(pkg.setup) + extras.reduce((s, e) => s + e.price, 0);
  const discount = Math.min(num(form.discount), subtotal);
  const total = subtotal - discount;
  return {
    number: meta.number,
    date: meta.date,
    pkg: { name: pkg.name, target: pkg.target, features: [...pkg.features], setup: pkg.setup },
    extras,
    discount,
    total,
    half: Math.round(total / 2),
    days: form.days,
    maintenanceTitle: freeMaintenance.title,
    maintenance: [
      freeMaintenance.items[0] + ".",
      freeMaintenance.items[1] + ".",
      `عدد محدود من التحديثات الشهرية البسيطة (تعديل نصوص أو صور أو أسعار)، بحد أقصى ${form.updatesCap || "3"} تحديثات شهرياً.`,
      freeMaintenance.note,
      freeMaintenance.after,
    ],
  };
}

export async function renderPdf(pages: HTMLElement[]): Promise<Blob> {
  const [{ toPng }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")]);
  await document.fonts.ready;
  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
  const styleProps = Array.from(getComputedStyle(pages[0])).filter((p) => !/^(min-|max-)?(height|block-size)$/.test(p));
  for (let i = 0; i < pages.length; i++) {
    const png = await toPng(pages[i], {
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      cacheBust: true,
      width: 794,
      height: 1123,
      includeStyleProperties: styleProps,
    });
    if (i) pdf.addPage();
    pdf.addImage(png, "PNG", 0, 0, 595.28, 841.89, undefined, "FAST");
  }
  return pdf.output("blob");
}

export async function shareOrDownload(files: { name: string; blob: Blob }[], title: string) {
  const f = files.map((d) => new File([d.blob], d.name, { type: "application/pdf" }));
  if (navigator.canShare?.({ files: f })) {
    try {
      await navigator.share({ files: f, title });
    } catch {}
    return;
  }
  for (const d of files) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(d.blob);
    a.download = d.name;
    a.click();
  }
}
