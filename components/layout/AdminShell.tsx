"use client";

import { LayoutDashboard, Users, Building2, Pill, ShieldCheck, FileText } from "lucide-react";
import { PortalShell } from "@/components/layout/PortalShell";

interface AdminShellProps {
  children: React.ReactNode;
  userEmail?: string;
}

export function AdminShell({ children, userEmail }: AdminShellProps) {
  const navItems = [
    { href: "/admin/overview", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/providers", label: "Providers", icon: Users },
    { href: "/admin/pharmacies", label: "Pharmacies", icon: Building2 },
    { href: "/admin/medications", label: "Medications", icon: Pill },
    { href: "/admin/interactions", label: "Interactions", icon: ShieldCheck },
    { href: "/admin/audit-logs", label: "Audit Logs", icon: FileText }
  ];

  return (
    <PortalShell
      brand="MedFlow Admin"
      navItems={navItems}
      userEmail={userEmail}
      placeholder="Search users, pharmacies..."
      themeClass="bg-admin-800"
      activeClass="bg-admin-600 text-white"
      textClass="text-admin-100"
    >
      {children}
    </PortalShell>
  );
}