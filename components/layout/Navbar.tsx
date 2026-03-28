"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogIn } from "lucide-react";
import Logo from "@/components/ui/Logo";

interface NavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
  avatarUrl?: string;
  profileHref?: string;
}

export default function Navbar({
  isLoggedIn = false,
  userName,
  avatarUrl,
  profileHref = "/profile",
}: NavbarProps) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <header
      className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-b border-[#D6E8E3]"
      style={{ height: 60 }}
      aria-label="Barra de navegação"
    >
      <div className="flex items-center justify-between px-4 h-full max-w-2xl mx-auto">
        {/* Logo — left on mobile */}
        <Link href={isLoggedIn ? "/dashboard" : "/"} aria-label="Ir para o início">
          <Logo size="sm" />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            /* Avatar button when logged in */
            <Link
              href={profileHref}
              aria-label={`Perfil de ${userName ?? "usuário"}`}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-[#D6E8E3] overflow-hidden hover:ring-2 hover:ring-primary transition-all duration-200"
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={userName ?? "avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={18} className="text-primary" />
              )}
            </Link>
          ) : !isAuthPage ? (
            /* Login button when logged out */
            <Link
              href="/auth/login"
              aria-label="Entrar na conta"
              className="
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                bg-primary text-white hover:bg-primary-light
                transition-all duration-200 active:scale-95
              "
            >
              <LogIn size={15} />
              Entrar
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
