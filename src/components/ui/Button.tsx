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
  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ${styles[variant]} ${sizes[size]} ${className}`;
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className={cls}
    >
      {children}
    </Link>
  );
}
