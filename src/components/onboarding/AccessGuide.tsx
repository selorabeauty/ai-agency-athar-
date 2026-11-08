"use client";

import { useState } from "react";
import { accessPlatforms, accessStatuses, AGENCY_EMAIL } from "@/lib/onboarding/config";

type Props = { value: Record<string, string>; onChange: (v: Record<string, string>) => void };

export function AccessGuide({ value, onChange }: Props) {
  const [active, setActive] = useState(accessPlatforms[0].id);
  const [copied, setCopied] = useState(false);
  const p = accessPlatforms.find((x) => x.id === active)!;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(AGENCY_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-neon/30 bg-neon/10 p-4 text-sm">
        <span className="text-white/80">بريد الوكالة الذي تضيفه كمشرف:</span>
        <span dir="ltr" className="font-bold text-white">{AGENCY_EMAIL}</span>
        <button type="button" onClick={copy} className="rounded-full border border-neon/50 px-3 py-1 text-xs font-bold text-neon hover:bg-neon/10">
          {copied ? "تم النسخ ✓" : "نسخ البريد"}
        </button>
      </div>

      <div role="tablist" className="flex gap-2 overflow-x-auto pb-1">
        {accessPlatforms.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={x.id === active}
            onClick={() => setActive(x.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${x.id === active ? "border-neon bg-neon text-navy" : "border-line text-white/80 hover:border-neon/50"}`}
          >
            {x.label}
            {value[x.id] === accessStatuses[0] && " ✓"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span>
          الدور المطلوب: <b className="text-white">{p.role}</b>
        </span>
        <a href={p.url} target="_blank" rel="noopener noreferrer" className="font-bold text-neon hover:underline">
          فتح المنصة ↗
        </a>
      </div>

      <ol className="grid gap-4 sm:grid-cols-2">
        {p.steps.map((s, i) => (
          <li key={s.title} className="rounded-2xl border border-line bg-white/5 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neon text-sm font-extrabold text-navy">{i + 1}</span>
              <p className="text-sm leading-relaxed text-white/90">{s.title}</p>
            </div>
            <div aria-hidden className="mt-4 rounded-xl border border-line bg-ink/70 p-3">
              <div className="mb-2 flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              </div>
              <div className="space-y-1.5">
                {s.screen.map((line) => (
                  <div key={line} className="truncate rounded-md bg-white/5 px-2 py-1.5 text-[11px] text-white/60" dir={line.includes("@") ? "ltr" : undefined}>
                    {line}
                  </div>
                ))}
                <div className="rounded-md border border-neon/70 bg-neon/15 px-2 py-1.5 text-center text-[11px] font-bold text-neon shadow-[0_0_18px_-6px_rgba(0,212,255,0.8)]">
                  👆 {s.tap}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-line p-4">
        <p className="text-sm font-bold text-white">هل أضفتنا في {p.label}؟</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {accessStatuses.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => onChange({ ...value, [p.id]: st })}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${value[p.id] === st ? "border-neon bg-neon/15 text-neon" : "border-line text-white/70 hover:border-neon/50"}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted">
        أسماء الأزرار قد تختلف قليلاً حسب لغة جهازك أو تحديثات المنصة. تقدر تلغي صلاحيتنا في أي وقت من نفس الصفحة، وحسابك يبقى ملكك بالكامل. ولو ما عندك حساب في أي منصة، لا تقلق — نجهّزه معك في مكالمة قصيرة.
      </p>
    </div>
  );
}
