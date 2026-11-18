import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/Icons";
import { consultationLink } from "@/lib/site";
import type { QA } from "@/lib/seo-pages";

export const baseUrl = "https://atherdigitalagency.com";

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export const breadcrumb = (items: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${baseUrl}${it.path}` })),
});

export function DirectAnswer({ heading, text }: { heading: string; text: string }) {
  return (
    <section className="border-b border-line">
      <div className="container-x py-14 lg:py-16">
        <Reveal className="card max-w-3xl p-7 sm:p-9">
          <h2 className="text-xl text-white sm:text-2xl">{heading}</h2>
          <p className="mt-4 text-lg leading-relaxed text-white/80">{text}</p>
        </Reveal>
      </div>
    </section>
  );
}

export function CheckList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <section className="border-b border-line bg-ink">
      <div className="container-x py-14 lg:py-16">
        <Reveal as="h2" className="text-2xl text-white sm:text-3xl">{heading}</Reveal>
        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((it, i) => (
            <Reveal as="li" key={it} delay={0.04 * i} className="card flex items-start gap-3 p-5 text-white/85">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neon/15 text-neon">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
              {it}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function QAList({ heading, faqs }: { heading: string; faqs: QA[] }) {
  return (
    <section className="border-b border-line">
      <div className="container-x py-14 lg:py-16">
        <Reveal as="h2" className="text-2xl text-white sm:text-3xl">{heading}</Reveal>
        <div className="mt-8 grid gap-4">
          {faqs.map((f) => (
            <Reveal key={f.q} className="card p-6">
              <h3 className="text-lg font-bold text-white">{f.q}</h3>
              <p className="mt-3 leading-relaxed text-white/75">{f.a}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingCta({ links }: { links?: { href: string; label: string }[] }) {
  return (
    <section>
      <div className="container-x py-16 text-center lg:py-20">
        <Reveal as="h2" className="text-[clamp(1.6rem,3.5vw,2.4rem)] text-white">ابدأ بتشخيص مجاني لحضورك الرقمي</Reveal>
        <Reveal as="p" delay={0.05} className="mx-auto mt-4 max-w-xl text-muted">نريك أين تضيع طلباتك، ونرسل لك عرض سعر مكتوبًا خلال يوم عمل، بدون التزام.</Reveal>
        <Reveal delay={0.1} className="mt-8 flex justify-center">
          <Button href={consultationLink} variant="neon">احجز استشارتك المجانية <span aria-hidden>↗</span></Button>
        </Reveal>
        {links && links.length > 0 && (
          <nav aria-label="صفحات ذات صلة" className="mt-10 flex flex-wrap justify-center gap-3 text-sm">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-full border border-line px-4 py-2 text-white/80 transition hover:border-neon/60 hover:text-neon">{l.label}</Link>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
