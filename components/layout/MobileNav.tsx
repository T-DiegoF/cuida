"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Heart, User, type LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface MobileNavItem {
  href: string;
  label: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

const navItems: MobileNavItem[] = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/requests", label: "Pedidos", icon: FileText },
  { href: "/campaigns", label: "Campanhas", icon: Heart },
  { href: "/profile", label: "Perfil", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#D6E8E3]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navegação mobile"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 min-w-0"
            >
              <span
                className={`
                  flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
                  ${active ? "bg-[#E6F4F1]" : ""}
                `}
              >
                <Icon
                  size={20}
                  className={`transition-colors duration-200 ${
                    active ? "text-primary" : "text-text-muted"
                  }`}
                />
              </span>
              <span
                className={`text-[10px] font-medium leading-none transition-colors duration-200 ${
                  active ? "text-primary" : "text-text-muted"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
