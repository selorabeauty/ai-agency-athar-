import { z } from "zod";

export const sectorOptions = [
  { value: "clinic", label: "عيادة" },
  { value: "law", label: "مكتب محاماة" },
  { value: "factory", label: "مصنع" },
] as const;

export const sectorLabel = (v: string) => sectorOptions.find((o) => o.value === v)?.label ?? v;

const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
export function normalizeDigits(input: string) {
  return input.replace(/[٠-٩]/g, (d) => String(arabicDigits.indexOf(d)));
}

export function normalizeKsaPhone(input: string) {
  const digits = normalizeDigits(input).replace(/[^\d+]/g, "");
  const m = digits.match(/^(?:\+?966|00966|0)?(5\d{8})$/);
  return m ? `+966${m[1]}` : null;
}

export const contactSchema = z.object({
  name: z.string().trim().min(2, "الاسم قصير جدًا").max(80, "الاسم طويل جدًا"),
  email: z.string().trim().toLowerCase().email("البريد الإلكتروني غير صحيح").max(120),
  whatsapp: z
    .string()
    .trim()
    .refine((v) => normalizeKsaPhone(v) !== null, "أدخل رقم جوال سعودي صحيح (مثال: 05xxxxxxxx)")
    .transform((v) => normalizeKsaPhone(v) as string),
  sector: z.enum(["clinic", "law", "factory"], { message: "اختر القطاع" }),
  message: z.string().trim().min(10, "اكتب تفاصيل أكثر (١٠ أحرف على الأقل)").max(2000, "الرسالة طويلة جدًا"),
  website: z.string().max(0).optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
