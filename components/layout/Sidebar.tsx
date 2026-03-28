"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  FileText,
  Heart,
  User,
  LogOut,
  Stethoscope,
} from "lucide-react";
import Logo from "@/components/ui/Logo";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Início", icon: <Home size={18} /> },
  { href: "/requests", label: "Pedidos", icon: <FileText size={18} /> },
  { href: "/campaigns", label: "Campanhas", icon: <Heart size={18} /> },
  { href: "/profile", label: "Perfil", icon: <User size={18} /> },
];

const roleLabelMap: Record<string, { label: string; color: string }> = {
  patient: { label: "Paciente", color: "bg-accent-soft text-accent" },
  doctor: { label: "Médico", color: "bg-[#E6F4F1] text-primary" },
  donor: { label: "Doador", color: "bg-[#E8F5E9] text-[#27AE60]" },
};

interface SidebarProps {
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
  onSignOut?: () => void;
}

export default function Sidebar({
  userName = "Usuário",
  userRole = "patient",
  avatarUrl,
  onSignOut,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const roleInfo = roleLabelMap[userRole] ?? {
    label: userRole,
    color: "bg-[#E6F4F1] text-primary",
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    if (onSignOut) {
      onSignOut();
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-[#D6E8E3] z-40"
      style={{ width: 260 }}
      aria-label="Navegação principal"
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#D6E8E3]">
        <Link href="/dashboard" aria-label="Ir para o início">
          <Logo size="md" />
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1" role="navigation">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 relative group
                ${
                  active
                    ? "bg-[#E6F4F1] text-primary"
                    : "text-text-muted hover:bg-surface hover:text-text-main"
                }
              `}
            >
              {/* Active left border indicator */}
              <span
                className={`
                  absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full
                  transition-all duration-200
                  ${active ? "h-6 bg-primary" : "h-0 group-hover:h-4 bg-primary-light"}
                `}
              />
              <span
                className={`transition-colors duration-200 ${active ? "text-primary" : "text-text-muted group-hover:text-primary-light"}`}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user info + sign out */}
      <div className="px-3 py-4 border-t border-[#D6E8E3] space-y-3">
        {/* User card */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-[#D6E8E3] flex items-center justify-center overflow-hidden flex-shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <Stethoscope size={16} className="text-primary-light" />
            )}
          </div>

          {/* Name + role */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-main truncate leading-tight">
              {userName}
            </p>
            <span
              className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 ${roleInfo.color}`}
            >
              {roleInfo.label}
            </span>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          aria-label="Sair da conta"
          className="
            flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium
            text-text-muted transition-all duration-200
            hover:bg-[#FDE8DF] hover:text-[#C0392B] group
          "
        >
          <LogOut
            size={16}
            className="transition-colors duration-200 group-hover:text-[#C0392B]"
          />
          Sair
        </button>
      </div>
    </aside>
  );
}
