export function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`label inline-flex items-center gap-2 ${className}`}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_12px_rgba(0,212,255,0.9)]" />
      {children}
    </p>
  );
}
