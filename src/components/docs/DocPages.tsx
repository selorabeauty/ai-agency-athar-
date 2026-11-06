import { Fragment, type ReactNode } from "react";
import { site } from "@/lib/site";
import { BLANK, BRAND, ltr, money, type ClientSignature, type DocModel } from "./model";

function Page({ children, id }: { children: ReactNode; id: string }) {
  return (
    <div
      data-page={id}
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
      <div className="flex-1">{children}</div>
      <div className="mt-3 border-t border-[#dde] pt-2 text-center text-[10px] text-[#778]">
        {BRAND} · {site.city}
      </div>
    </div>
  );
}

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
const KV = ({ rows }: { rows: [string, ReactNode][] }) => (
  <table className="my-1.5 w-full border-collapse">
    <tbody>
      {rows.map(([k, v]) => (
        <tr key={k}>
          <td className={`w-[32%] bg-[#f5f8fb] font-bold ${td}`}>{k}</td>
          <td className={td}>{v}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
const KV2 = ({ rows }: { rows: [string, ReactNode][] }) => (
  <table className="my-1.5 w-full border-collapse">
    <tbody>
      {Array.from({ length: Math.ceil(rows.length / 2) }, (_, i) => rows.slice(i * 2, i * 2 + 2)).map((pair) => (
        <tr key={pair[0][0]}>
          {pair.map(([k, v]) => (
            <Fragment key={k}>
              <td className={`w-[15%] bg-[#f5f8fb] font-bold ${td}`}>{k}</td>
              <td className={`w-[35%] ${td}`}>{v}</td>
            </Fragment>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

type Party = { title: string; name?: string; sig?: string; date?: string; note?: string };
function Sign({ a, b }: { a: Party; b: Party }) {
  return (
    <div className="mt-5 flex gap-8">
      {[a, b].map((p) => (
        <div key={p.title} className="flex-1 border-t border-[#889] pt-1.5">
          <b>{p.title}</b>
          <div>الاسم: {p.name || BLANK}</div>
          <div className="flex items-center gap-2">
            التوقيع:{" "}
            {p.sig ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.sig} alt="" className="h-[42px] w-[126px] object-contain" />
            ) : (
              BLANK
            )}
          </div>
          <div>التاريخ: {p.date ? ltr(p.date) : BLANK}</div>
          {p.note && <div className="text-[9.5px] leading-[1.5] text-[#5a6b80]">{p.note}</div>}
        </div>
      ))}
    </div>
  );
}

export type SignInfo = { ref: string; client: ClientSignature };

const fmt = (iso: string) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Riyadh", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })
      .formatToParts(new Date(iso))
      .map((x) => [x.type, x.value]),
  );
  return `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute} (توقيت السعودية)`;
};

function parties(doc: DocModel, signed: SignInfo | undefined, aTitle: string, bTitle: string): [Party, Party] {
  return [
    { title: aTitle, name: doc.rep.name, sig: doc.ownerSig || undefined, date: doc.ownerSig ? doc.date : undefined },
    {
      title: bTitle,
      name: signed?.client.name,
      sig: signed?.client.image,
      date: signed ? fmt(signed.client.at) : undefined,
      note: signed ? `وُقّع إلكترونياً عبر رابط التوقيع الآمن · المرجع: ${signed.ref}` : undefined,
    },
  ];
}

export function QuotePage({ doc, signed }: { doc: DocModel; signed?: SignInfo }) {
  const client = doc.client || BLANK;
  const bank = `طريقة الدفع: تحويل بنكي. اسم المستفيد: ${doc.rep.beneficiary || BLANK} · الآيبان: `;
  const [a, b] = parties(doc, signed, `عن ${BRAND}`, `موافقة العميل: ${client}`);
  return (
    <Page id="quote-1">
      <h1 className="mb-2 text-[21px] font-extrabold text-[#0b1220]">عرض سعر</h1>
      <KV2
        rows={[
          ["رقم العرض", ltr(doc.number || "—")],
          ["التاريخ", ltr(doc.date || "—")],
          ["العميل", client],
          ["النشاط", doc.activity || BLANK],
          ["الجوال", doc.phone ? ltr(doc.phone) : BLANK],
          ["المدينة", doc.city || BLANK],
        ]}
      />
      <H>تفاصيل العرض</H>
      <table className="my-1.5 w-full border-collapse">
        <thead>
          <tr className="bg-[#eaf8fd]">
            <th className={`${td} text-right`}>البند</th>
            <th className={`${td} text-right`}>يشمل</th>
            <th className={`w-[110px] ${td} text-right`}>السعر</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`${td} font-bold`}>{doc.pkg.name}</td>
            <td className={td}>{doc.pkg.features.join("، ")}</td>
            <td className={td}>{doc.pkg.setup}</td>
          </tr>
          {doc.extras.map((e, i) => (
            <tr key={i}>
              <td className={`${td} font-bold`} colSpan={2}>{e.name}</td>
              <td className={td}>{money(e.price)}</td>
            </tr>
          ))}
          {doc.discount > 0 && (
            <tr>
              <td className={td} colSpan={2}>خصم</td>
              <td className={td}>- {money(doc.discount)}</td>
            </tr>
          )}
          <tr className="bg-[#eaf8fd] text-[14px]">
            <td className={`${td} font-extrabold`} colSpan={2}>الإجمالي (دفعة واحدة)</td>
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
          `الدفعة الأولى 50% (${money(doc.half)}) عند الموافقة لبدء العمل، والـ 50% المتبقية (${money(doc.total - doc.half)}) عند التسليم وقبل نقل الموقع على الدومين النهائي.`,
          <>{bank}{ltr(doc.rep.iban || "SA" + BLANK)}</>,
          `مدة التنفيذ المتوقعة: ${doc.days || "____"} أيام عمل، تبدأ بعد استلام الدفعة الأولى وكامل المحتوى (الشعار، الصور، النصوص، الأسعار).`,
          "رسوم الخدمات الخارجية (مثل رسائل واتساب من Meta أو مفاتيح الذكاء الاصطناعي) غير مشمولة إلا إذا ذُكرت في هذا العرض.",
          "هذا العرض صالح لمدة 7 أيام من تاريخه.",
        ]}
      />
      <Sign a={a} b={b} />
    </Page>
  );
}

export function ContractPages({ doc, signed }: { doc: DocModel; signed?: SignInfo }) {
  const client = doc.client || BLANK;
  const bank = `طريقة الدفع: تحويل بنكي. اسم المستفيد: ${doc.rep.beneficiary || BLANK} · الآيبان: `;
  const [a, b] = parties(doc, signed, `الطرف الأول: ${BRAND}`, `الطرف الثاني: ${client}`);
  return (
    <>
      <Page id="contract-1">
        <h1 className="mb-2 text-[20px] font-extrabold text-[#0b1220]">اتفاقية تقديم خدمات تصميم موقع إلكتروني</h1>
        <p>أُبرمت هذه الاتفاقية بتاريخ {ltr(doc.date || "—")} بين كلٍّ من:</p>
        <KV
          rows={[
            ["الطرف الأول (مقدّم الخدمة)", `${BRAND}، ويمثلها: ${doc.rep.name || BLANK}، رقم الهوية: ${doc.rep.id || BLANK}`],
            ["الطرف الثاني (العميل)", <>{client} — {doc.activity || BLANK}، رقم الهوية / السجل التجاري: {doc.clientId || BLANK}، الجوال: {doc.phone ? ltr(doc.phone) : BLANK}</>],
          ]}
        />
        <H>1. نطاق العمل</H>
        <p>
          يلتزم الطرف الأول بتنفيذ «{doc.pkg.name}» وتشمل: {doc.pkg.features.join("، ")}
          {doc.extras.length ? `، إضافة إلى: ${doc.extras.map((e) => e.name).join("، ")}` : ""}، وفق عرض السعر رقم {ltr(doc.number || "—")} الذي يُعدّ جزءاً لا يتجزأ من هذه الاتفاقية. أي عمل خارج هذا النطاق يُتفق عليه كتابياً بسعر مستقل.
        </p>
        <H>2. السعر وطريقة الدفع</H>
        <UL
          items={[
            `قيمة الخدمة الإجمالية: ${money(doc.total)}، دفعة واحدة دون اشتراك شهري إلزامي.`,
            `تُدفع ${money(doc.half)} (50%) عند توقيع الاتفاقية، و${money(doc.total - doc.half)} (50%) عند التسليم وقبل نقل الموقع على الدومين النهائي.`,
            <>{bank}{ltr(doc.rep.iban || "SA" + BLANK)}</>,
            "رسوم الخدمات الخارجية (رسائل Meta/واتساب، مفاتيح الذكاء الاصطناعي، الإعلانات المدفوعة) يتحملها الطرف الثاني ما لم يُنص على غير ذلك.",
          ]}
        />
        <H>3. مدة التنفيذ والتزامات العميل</H>
        <UL
          items={[
            `مدة التنفيذ: ${doc.days || "____"} أيام عمل، تبدأ من استلام الدفعة الأولى وكامل المحتوى المطلوب.`,
            "يلتزم الطرف الثاني بتسليم المحتوى (الشعار، الصور، النصوص، الأسعار، بيانات التواصل) خلال 5 أيام، ويتمدد موعد التسليم بقدر أي تأخير منه.",
            "يحق للطرف الثاني جولتا تعديل على التصميم قبل التسليم النهائي.",
            "يُعدّ الموقع مُسلَّماً عند نشره وإبلاغ العميل، أو بعد 5 أيام من إرسال رابط المعاينة دون ملاحظات.",
          ]}
        />
        <H>4. الدعم والصيانة</H>
        <p className="font-bold">{doc.maintenanceTitle}</p>
        <UL items={doc.maintenance} />
      </Page>

      <Page id="contract-2">
        <H>5. الملكية والحسابات</H>
        <UL
          items={[
            "تنتقل ملكية الموقع ومحتواه للطرف الثاني بعد سداد كامل المبلغ.",
            "يُسجَّل الدومين والملف التجاري في Google باسم الطرف الثاني أو يُسلَّم له، وتُسلَّم له بيانات الدخول عند انتهاء الصيانة أو عند طلبه.",
            "يحق للطرف الأول عرض الموقع ضمن نماذج أعماله ما لم يعترض الطرف الثاني كتابياً.",
          ]}
        />
        <H>6. السرية وحماية البيانات</H>
        <p>يلتزم الطرفان بسرية المعلومات المتبادلة، ويلتزم الطرف الأول بالتعامل مع بيانات العملاء وفق نظام حماية البيانات الشخصية في المملكة العربية السعودية.</p>
        <H>7. الإلغاء</H>
        <UL items={["يحق للطرف الثاني إلغاء الاتفاقية قبل بدء التنفيذ واسترداد الدفعة الأولى كاملة.", "بعد بدء التنفيذ تُخصم قيمة ما تم إنجازه من الدفعة الأولى، ويُسترد الباقي إن وُجد."]} />
        <H>8. حدود المسؤولية</H>
        <p>لا يتحمل الطرف الأول مسؤولية الأعطال الناتجة عن مزودي الخدمات الخارجية (الاستضافة، Meta، Google، OpenAI) أو عن تعديلات يجريها الطرف الثاني أو غيره على الموقع، ولا تتجاوز مسؤوليته في جميع الأحوال قيمة هذه الاتفاقية.</p>
        <H>9. أحكام عامة</H>
        <p>تخضع هذه الاتفاقية لأنظمة المملكة العربية السعودية، ويُسعى لحل أي خلاف ودياً أولاً. يُعدّ التوقيع الإلكتروني على هذه الاتفاقية ملزماً للطرفين كالتوقيع الخطي، وتُحفظ نسخة إلكترونية منها لدى كل طرف.</p>
        <Sign a={a} b={b} />
      </Page>
    </>
  );
}
