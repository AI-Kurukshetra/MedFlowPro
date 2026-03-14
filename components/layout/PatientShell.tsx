"use client";

import { Pill, Bell, User } from "lucide-react";
import { PortalShell } from "@/components/layout/PortalShell";

interface PatientShellProps {
  children: React.ReactNode;
  userEmail?: string;
}

export function PatientShell({ children, userEmail }: PatientShellProps) {
  const navItems = [
    { href: "/patient/medications", label: "My Medications", icon: Pill },
    { href: "/patient/refill", label: "Request Refill", icon: Bell },
    { href: "/patient/reminders", label: "Reminders", icon: Bell },
    { href: "/patient/profile", label: "My Profile", icon: User }
  ];

  return (
    <PortalShell
      brand="MedFlow Patient"
      navItems={navItems}
      userEmail={userEmail}
      placeholder="Search medications..."
      themeClass="bg-patient-800"
      activeClass="bg-patient-600 text-white"
      textClass="text-patient-100"
    >
      {children}
    </PortalShell>
  );
}