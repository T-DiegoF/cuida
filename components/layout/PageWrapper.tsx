"use client";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

interface PageWrapperProps {
  children: React.ReactNode;
  /** Pass false to hide sidebar/nav (e.g. landing, auth pages) */
  showNav?: boolean;
  isLoggedIn?: boolean;
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
  onSignOut?: () => void;
}

export default function PageWrapper({
  children,
  showNav = true,
  isLoggedIn = false,
  userName,
  userRole,
  avatarUrl,
  onSignOut,
}: PageWrapperProps) {
  if (!showNav) {
    return (
      <main className="min-h-screen bg-surface animate-fade-up">
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <Sidebar
        userName={userName}
        userRole={userRole}
        avatarUrl={avatarUrl}
        onSignOut={onSignOut}
      />

      {/* Mobile top navbar */}
      <Navbar
        isLoggedIn={isLoggedIn}
        userName={userName}
        avatarUrl={avatarUrl}
      />

      {/* Page content */}
      <main
        className="
          lg:pl-[260px]
          pt-[60px] lg:pt-0
          pb-[72px] lg:pb-0
          min-h-screen
          animate-fade-up
        "
        id="main-content"
      >
        {/* Skip to content (accessibility) */}
        <a
          href="#main-content"
          className="
            sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
            focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white
            focus:rounded-lg focus:text-sm focus:font-medium
          "
        >
          Ir para o conteúdo principal
        </a>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
