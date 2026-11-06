import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { BRAND, ltr, money, type DocModel } from "./model";

const H = ({ children }: { children: ReactNode }) => (
  <h2 className="mt-4 mb-1.5 border-r-4 border-[#00b8e6] pr-2 text-[14px] font-bold text-[#0089b3]">{children}</h2>
);
const UL = ({ items }: { items: ReactNode[] }) => (
  <ul className="list-disc space-y-0.5 pr-5">
    {items.map((x, i) => (
      <li key={i}>{x}</li>
    ))}
  </ul>
);
const td = "border border-[#cfd8e3] px-2 py-1.5";

export function QuotePage({ doc }: { doc: DocModel }) {
  return (
    <div
      data-page="quote-1"
      dir="rtl"
      style={{ width: 794, height: 1123, fontFamily: "var(--font-body), Tajawal, sans-serif" }}
      className="relative flex flex-col overflow-hidden bg-white px-[52px] pt-[44px] pb-[36px] text-[12.5px] leading-[1.8] text-[#101826]"
    >
      <div className="mb-4 flex items-center justify-between border-b-[3px] border-[#00b8e6] pb-3">
        <div className="text-[22px] font-extrabold text-[#0b1220]">
          آثر <span className="text-[#00a6d6]">ديجيتال</span>
        </div>
        <div className="text-left text-[10.5px] leading-[1.6] text-[#556]">
          <div>واتساب: {ltr(site.phoneDisplay)}</div>
          <div dir="ltr">{site.email}</div>
          <div dir="ltr">atherdigitalagency.com</div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-end justify-between">
          <h1 className="text-[22px] font-extrabold text-[#0b1220]">عرض سعر</h1>
          <div className="text-[11px] text-[#556]">
            رقم العرض: {ltr(doc.number || "—")} · التاريخ: {ltr(doc.date || "—")}
          </div>
        </div>

        <H>الباقة: {doc.pkg.name}</H>
        <p className="text-[#445]">{doc.pkg.target}</p>
        <p className="mt-1 font-bold">ماذا نقدّم لك:</p>
        <UL items={doc.pkg.features} />
        {doc.extras.length > 0 && (
          <>
            <p className="mt-1 font-bold">خدمات إضافية:</p>
            <UL items={doc.extras.map((e) => e.name)} />
          </>
        )}

        <H>السعر</H>
        <table className="my-1.5 w-full border-collapse">
          <tbody>
            <tr>
              <td className={`${td} font-bold`}>{doc.pkg.name}</td>
              <td className={`w-[130px] ${td}`}>{doc.pkg.setup}</td>
            </tr>
            {doc.extras.map((e, i) => (
              <tr key={i}>
                <td className={td}>{e.name}</td>
                <td className={td}>{money(e.price)}</td>
              </tr>
            ))}
            {doc.discount > 0 && (
              <tr>
                <td className={td}>خصم</td>
                <td className={td}>- {money(doc.discount)}</td>
              </tr>
            )}
            <tr className="bg-[#eaf8fd] text-[14px]">
              <td className={`${td} font-extrabold`}>الإجمالي (دفعة واحدة)</td>
              <td className={`${td} font-extrabold`}>{money(doc.total)}</td>
            </tr>
          </tbody>
        </table>
        <p>جميع الأسعار دفعة واحدة، وليس عليها اشتراك شهري إلزامي.</p>

        <H>الدعم والصيانة</H>
        <p className="font-bold">{doc.maintenanceTitle}</p>
        <UL items={doc.maintenance} />

        <H>الدفع والتسليم</H>
        <UL
          items={[
            `الدفعة الأولى 50% (${money(doc.half)}) عند الموافقة لبدء العمل، والـ 50% المتبقية (${money(doc.total - doc.half)}) عند التسليم.`,
            `مدة التنفيذ المتوقعة: ${doc.days || "____"} أيام عمل، تبدأ بعد استلام الدفعة الأولى وكامل المحتوى (الشعار، الصور، النصوص، الأسعار).`,
            "جولتا تعديل على التصميم قبل التسليم النهائي.",
            "رسوم الخدمات الخارجية (مثل رسائل واتساب من Meta أو مفاتيح الذكاء الاصطناعي) غير مشمولة إلا إذا ذُكرت في هذا العرض.",
            "هذا العرض صالح لمدة 7 أيام من تاريخه.",
          ]}
        />

        <div className="mt-6 rounded-xl bg-[#eaf8fd] px-4 py-3 text-center text-[13px]">
          للموافقة على العرض أو لأي استفسار، تواصل معنا على واتساب <b>{ltr(site.phoneDisplay)}</b>
        </div>
      </div>

      <div className="mt-3 border-t border-[#dde] pt-2 text-center text-[10px] text-[#778]">
        {BRAND} · {site.city}
      </div>
    </div>
  );
}
