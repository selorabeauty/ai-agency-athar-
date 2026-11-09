"use client";

import { motion } from "framer-motion";

export function Bars({ values, labels, unit = "" }: { values: number[]; labels: string[]; unit?: string }) {
  const max = Math.max(...values);
  return (
    <div className="flex h-48 items-end gap-1.5 sm:gap-2" dir="rtl">
      {values.map((v, i) => (
        <div key={labels[i]} className="group flex h-full flex-1 flex-col items-center gap-1.5">
          <span className="text-[9px] font-bold text-violet-700 opacity-0 transition group-hover:opacity-100 sm:text-[10px]">{v}{unit}</span>
          <div className="relative w-full flex-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(v / max) * 100}%` }}
            transition={{ duration: 0.7, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute inset-x-0 bottom-0 rounded-t-lg ${i === values.length - 1 ? "bg-gradient-to-t from-violet-700 to-fuchsia-500" : "bg-gradient-to-t from-violet-300 to-violet-200 group-hover:from-violet-500 group-hover:to-violet-400"}`}
          />
          </div>
          <span className="text-[9px] text-slate-500 sm:text-[10px]">{labels[i].slice(0, 3)}</span>
        </div>
      ))}
    </div>
  );
}

export function Line({ values, labels }: { values: number[]; labels: string[] }) {
  const w = 600, h = 180, pad = 10;
  const min = Math.min(...values) - 5, max = Math.max(...values) + 5;
  const pts = values.map((v, i) => [pad + (i * (w - pad * 2)) / (values.length - 1), h - pad - ((v - min) / (max - min)) * (h - pad * 2)]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-44 w-full" preserveAspectRatio="none" style={{ transform: "scaleX(-1)" }}>
        <defs>
          <linearGradient id="occ" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.35" />
            <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${d} L${w - pad},${h} L${pad},${h} Z`} fill="url(#occ)" />
        <motion.path d={d} fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} />
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 6 : 3.5} fill={i === pts.length - 1 ? "#c026d3" : "#fff"} stroke="#7c3aed" strokeWidth="2" />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[9px] text-slate-500 sm:text-[10px]">
        {labels.map((l) => (
          <span key={l}>{l.slice(0, 3)}</span>
        ))}
      </div>
    </div>
  );
}

export function Donut({ parts }: { parts: { label: string; value: number; color: string }[] }) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  const r = 42, c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <svg viewBox="0 0 120 120" className="h-40 w-40 shrink-0 -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#f1edfd" strokeWidth="16" />
        {parts.map((p) => {
          const len = (p.value / total) * c;
          const el = <circle key={p.label} cx="60" cy="60" r={r} fill="none" stroke={p.color} strokeWidth="16" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} />;
          offset += len;
          return el;
        })}
      </svg>
      <ul className="w-full space-y-2 text-sm">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-slate-700">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
              {p.label}
            </span>
            <b className="text-slate-900">{p.value}%</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Spark({ values, color = "#7c3aed" }: { values: number[]; color?: string }) {
  const max = Math.max(...values), min = Math.min(...values);
  const d = values.map((v, i) => `${i ? "L" : "M"}${(i / (values.length - 1)) * 100},${30 - ((v - min) / (max - min || 1)) * 26}`).join(" ");
  return (
    <svg viewBox="0 0 100 32" className="h-8 w-24" preserveAspectRatio="none" style={{ transform: "scaleX(-1)" }}>
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Ring({ value, label }: { value: number; label: string }) {
  const r = 34, c = 2 * Math.PI * r;
  return (
    <div className="relative h-24 w-24">
      <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#ede9fe" strokeWidth="8" />
        <motion.circle cx="40" cy="40" r={r} fill="none" stroke="url(#ring)" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - value / 100) }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
        <defs>
          <linearGradient id="ring">
            <stop offset="0" stopColor="#7c3aed" />
            <stop offset="1" stopColor="#d946ef" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <b className="text-xl text-slate-900">{value}%</b>
        <span className="text-[10px] text-slate-500">{label}</span>
      </div>
    </div>
  );
}
