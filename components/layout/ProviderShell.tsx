"use client";

import { LayoutDashboard, Users, Pill, Building2, History } from "lucide-react";
import { PortalShell } from "@/components/layout/PortalShell";

interface ProviderShellProps {
  children: React.ReactNode;
  userEmail?: string;
}

export function ProviderShell({ children, userEmail }: ProviderShellProps) {
  const navItems = [
    { href: "/provider/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/provider/patients", label: "Patients", icon: Users },
    { href: "/provider/prescriptions", label: "Prescriptions", icon: Pill },
    { href: "/provider/pharmacies", label: "Pharmacies", icon: Building2 },
    { href: "/provider/medication-history", label: "Medication History", icon: History }
  ];

  return (
    <PortalShell
      brand="MedFlow Pro"
      navItems={navItems}
      userEmail={userEmail}
      placeholder="Search patients, medications..."
      themeClass="bg-primary-800"
      activeClass="bg-primary-600 text-white"
      textClass="text-primary-100"
    >
      {children}
    </PortalShell>
  );
}