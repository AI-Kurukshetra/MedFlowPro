"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { PortalSidebar, type PortalNavItem } from "@/components/layout/PortalSidebar";
import { PortalTopbar } from "@/components/layout/PortalTopbar";

interface PortalShellProps {
  children: React.ReactNode;
  brand: string;
  navItems: PortalNavItem[];
  userEmail?: string;
  placeholder?: string;
  themeClass: string;
  activeClass: string;
  textClass: string;
}

export function PortalShell({
  children,
  brand,
  navItems,
  userEmail,
  placeholder,
  themeClass,
  activeClass,
  textClass
}: PortalShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PortalSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        brand={brand}
        navItems={navItems}
        userEmail={userEmail}
        onSignOut={handleSignOut}
        themeClass={themeClass}
        activeClass={activeClass}
        textClass={textClass}
      />
      <div className="flex min-h-screen flex-col lg:pl-72">
        <PortalTopbar onMenu={() => setSidebarOpen(true)} placeholder={placeholder} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}