"use client";

import { ClipboardList, History, Building2 } from "lucide-react";
import { PortalShell } from "@/components/layout/PortalShell";

interface PharmacyShellProps {
  children: React.ReactNode;
  userEmail?: string;
}

export function PharmacyShell({ children, userEmail }: PharmacyShellProps) {
  const navItems = [
    { href: "/pharmacy/queue", label: "Rx Queue", icon: ClipboardList },
    { href: "/pharmacy/history", label: "Fill History", icon: History },
    { href: "/pharmacy/info", label: "Pharmacy Info", icon: Building2 }
  ];

  return (
    <PortalShell
      brand="MedFlow Pharmacy"
      navItems={navItems}
      userEmail={userEmail}
      placeholder="Search prescriptions..."
      themeClass="bg-pharmacy-800"
      activeClass="bg-pharmacy-600 text-white"
      textClass="text-pharmacy-100"
    >
      {children}
    </PortalShell>
  );
}