export function SectionLabel({
  children,
  tone = "dark",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p className={`label ${tone === "dark" ? "text-muted" : "text-white/70"} ${className}`}>{children}</p>
  );
}
