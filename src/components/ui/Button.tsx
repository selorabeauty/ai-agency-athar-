import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "neon" | "outline" | "ghost";

const styles: Record<Variant, string> = {
  neon: "btn-neon font-bold",
  outline: "border border-white/20 text-white hover:border-neon/70 hover:text-neon",
  ghost: "text-white/80 hover:text-white",
};

export function Button({
  href,
  children,
  variant = "neon",
  className = "",
  size = "md",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "h-10 px-4 text-sm", md: "h-11 px-6 text-sm", lg: "h-14 px-8 text-base" };
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ${styles[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
