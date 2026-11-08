import Link from "next/link";

const links = [
  ["/admin", "عروض الأسعار"],
  ["/admin/clients", "العملاء الجدد"],
] as const;

export function AdminNav({ active }: { active: string }) {
  return (
    <nav className="mb-6 flex gap-2">
      {links.map(([href, label]) => (
        <Link key={href} href={href} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${active === href ? "border-neon bg-neon text-navy" : "border-line text-white/80 hover:border-neon/50"}`}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
