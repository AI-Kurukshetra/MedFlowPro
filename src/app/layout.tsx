import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavigationProgress from "@/components/NavigationProgress";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MedFlow Pro - AI-Assisted Medication Management",
  description:
    "Streamline medication management and e-prescribing with AI-powered insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <NavigationProgress />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
