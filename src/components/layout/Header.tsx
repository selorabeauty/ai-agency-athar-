"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";
import { Logo } from "./Logo";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_0_0_#e5e7eb,0_10px_30px_-20px_rgba(11,19,43,0.25)]" : "shadow-[0_1px_0_0_#e5e7eb]"
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <div className="flex items-center gap-10">
          <Logo />
          <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-sm text-navy/80 transition-colors hover:text-navy after:absolute after:inset-inline-start-0 after:-bottom-1 after:h-px after:w-0 after:bg-cobalt after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
            <MegaMenu />
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="pill-gradient hidden h-10 items-center gap-2 rounded-full px-5 text-sm font-medium text-white shadow-[0_8px_30px_-12px_rgba(30,79,191,0.8)] transition hover:brightness-110 sm:inline-flex"
          >
            اطلب استشارة <span aria-hidden>↗</span>
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
