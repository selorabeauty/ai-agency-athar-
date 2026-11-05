import Link from "next/link";
import { consultationLink, nav } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-navy/85 backdrop-blur-md">
      <div className="container-x flex h-[76px] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="التنقل الرئيسي" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative py-2 text-[15px] font-medium text-white/80 transition hover:text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-neon after:transition-transform hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Button href={consultationLink} size="md">
              اطلب استشارة مجانية <span aria-hidden>↗</span>
            </Button>
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
