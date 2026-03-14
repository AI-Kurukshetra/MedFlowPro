"use client";

import { Menu, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PortalTopbarProps {
  onMenu: () => void;
  placeholder?: string;
}

export function PortalTopbar({ onMenu, placeholder = "Search patients, medications..." }: PortalTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
      <div className="flex flex-1 items-center gap-3">
        <button
          onClick={onMenu}
          className="rounded-xl bg-slate-100 p-2 text-slate-600 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Input placeholder={placeholder} />
      </div>
      <button className="rounded-full bg-slate-100 p-2 text-slate-600" aria-label="Notifications">
        <Bell className="h-5 w-5" />
      </button>
    </header>
  );
}