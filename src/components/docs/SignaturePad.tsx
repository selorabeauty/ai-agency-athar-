"use client";

import { useEffect, useRef } from "react";

export function SignaturePad({ value, onChange, light }: { value: string; onChange: (dataUrl: string) => void; light?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, c.width, c.height);
      img.src = value;
    }
  }, [value]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * e.currentTarget.width, ((e.clientY - r.top) / r.height) * e.currentTarget.height];
  };

  return (
    <div>
      <canvas
        ref={ref}
        width={600}
        height={200}
        className={`h-[140px] w-full touch-none rounded-xl border-2 border-dashed ${light ? "border-[#9fb3c8] bg-white" : "border-line bg-white"}`}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          drawing.current = true;
          const ctx = e.currentTarget.getContext("2d")!;
          const [x, y] = pos(e);
          ctx.lineWidth = 3.2;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.strokeStyle = "#0b2a5b";
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 0.1, y + 0.1);
          ctx.stroke();
          dirty.current = true;
        }}
        onPointerMove={(e) => {
          if (!drawing.current) return;
          const ctx = e.currentTarget.getContext("2d")!;
          const [x, y] = pos(e);
          ctx.lineTo(x, y);
          ctx.stroke();
        }}
        onPointerUp={(e) => {
          drawing.current = false;
          if (dirty.current) onChange(e.currentTarget.toDataURL("image/png"));
        }}
      />
      <div className="mt-1 flex justify-between text-xs">
        <span className={light ? "text-[#667]" : "text-white/50"}>ارسم توقيعك بإصبعك داخل المربع</span>
        <button
          type="button"
          className={light ? "text-[#0089b3] underline" : "text-neon underline"}
          onClick={() => {
            dirty.current = false;
            onChange("");
          }}
        >
          مسح
        </button>
      </div>
    </div>
  );
}
