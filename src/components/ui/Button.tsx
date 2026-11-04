import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "gradient" | "white" | "outline" | "navy";

const styles: Record<Variant, string> = {
  gradient: "pill-gradient text-white shadow-[0_8px_30px_-12px_rgba(30,79,191,0.7)] hover:brightness-110",
  white: "bg-white text-navy hover:bg-offwhite",
  outline: "border border-navy/20 text-navy hover:border-navy/60",
  navy: "bg-navy text-white hover:bg-royal",
};

export function Button({
  href,
  children,
  variant = "gradient",
  className = "",
  size = "md",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "h-9 px-4 text-xs", md: "h-11 px-6 text-sm", lg: "h-13 px-8 text-base" };
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ${styles[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
