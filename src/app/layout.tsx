import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import NavigationProgress from "@/components/NavigationProgress";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Footer from "@/components/Footer";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MedFlow Pro - AI-Assisted Medication Management",
  description:
    "Streamline medication management and e-prescribing with AI-powered insights",
};

const themeInitScript = `
  (function() {
    try {
      var storedTheme = window.localStorage.getItem("medflow-theme");
      var theme = storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (error) {
      document.documentElement.dataset.theme = "dark";
      document.documentElement.style.colorScheme = "dark";
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${manrope.variable} min-h-screen`}>
        <ThemeProvider>
          <NavigationProgress />
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
