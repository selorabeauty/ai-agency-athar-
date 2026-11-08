"use client";

import { useEffect, useRef, useState } from "react";
import { fileCategories, MAX_FILE_BYTES, type FileCategory } from "@/lib/onboarding/config";

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

async function compress(file: File): Promise<File> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size < 1.2 * 1024 * 1024) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 2000 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

type Props = { category: FileCategory; files: File[]; onChange: (files: File[]) => void };

export function DropZone({ category, files, onChange }: Props) {
  const cfg = fileCategories[category];
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((f) => (f.type.startsWith("image/") && f.type !== "image/heic" && f.type !== "image/heif" ? URL.createObjectURL(f) : ""));
    setPreviews(urls);
    return () => urls.forEach((u) => u && URL.revokeObjectURL(u));
  }, [files]);

  async function add(list: FileList | null) {
    if (!list?.length) return;
    setError("");
    const incoming = Array.from(list);
    const ok: File[] = [];
    for (const raw of incoming) {
      const type = raw.type || (/\.heic$/i.test(raw.name) ? "image/heic" : "");
      if (!cfg.types.includes(type)) {
        setError(`نوع غير مدعوم: ${raw.name}`);
        continue;
      }
      const f = category === "photos" ? await compress(raw) : raw;
      if (f.size > MAX_FILE_BYTES) {
        setError(`الملف أكبر من 10MB: ${raw.name}`);
        continue;
      }
      ok.push(type === raw.type ? f : new File([f], f.name, { type }));
    }
    const next = [...files, ...ok];
    if (next.length > cfg.max) setError(`الحد الأقصى ${cfg.max} ملفات`);
    onChange(next.slice(0, cfg.max));
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          add(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition ${over ? "border-neon bg-neon/10" : "border-line hover:border-neon/50"}`}
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-neon" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
        <p className="text-sm font-bold text-white">{cfg.label}</p>
        <p className="text-xs text-muted">اسحب الملفات هنا أو اضغط للاختيار</p>
        <p className="text-[11px] text-white/45">{cfg.hint}</p>
        <input ref={input} type="file" multiple={cfg.max > 1} accept={cfg.accept} className="hidden" onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
      </div>
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
      {files.length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="relative overflow-hidden rounded-xl border border-line bg-white/5">
              {previews[i] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previews[i]} alt="" className="h-24 w-full object-cover" />
              ) : (
                <div className="flex h-24 items-center justify-center text-xs font-bold text-neon">{f.name.split(".").pop()?.toUpperCase()}</div>
              )}
              <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                <span className="truncate text-[11px] text-white/70" dir="ltr">{f.name}</span>
                <span className="shrink-0 text-[10px] text-muted">{kb(f.size)}</span>
              </div>
              <button type="button" aria-label={`حذف ${f.name}`} onClick={() => onChange(files.filter((_, j) => j !== i))} className="absolute end-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink/80 text-xs text-white hover:bg-red-500/80">
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
