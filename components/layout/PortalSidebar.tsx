"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

export type PortalNavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

interface PortalSidebarProps {
  open: boolean;
  onClose: () => void;
  brand: string;
  navItems: PortalNavItem[];
  userEmail?: string;
  onSignOut: () => void;
  themeClass: string;
  activeClass: string;
  textClass: string;
}

export function PortalSidebar({
  open,
  onClose,
  brand,
  navItems,
  userEmail,
  onSignOut,
  themeClass,
  activeClass,
  textClass
}: PortalSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-72 flex-col px-6 py-8 shadow-lg transition-transform lg:translate-x-0",
          themeClass,
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div>
          <p className="text-xl font-semibold text-white">{brand}</p>
          <p className={cn("text-xs", textClass)}>Healthcare portal</p>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                onClick={open ? onClose : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/80 transition",
                  isActive ? activeClass : "hover:bg-white/10"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <div className={cn("rounded-xl bg-white/10 p-3 text-xs text-white/80", textClass)}>
            Signed in as
            <p className="mt-1 text-sm font-semibold text-white">{userEmail ?? "user@medflow.dev"}</p>
          </div>
          <button
            onClick={onSignOut}
            className="w-full rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}