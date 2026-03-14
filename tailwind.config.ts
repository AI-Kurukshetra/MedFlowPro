import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#E8F7EF",
          100: "#CDEFE0",
          200: "#9FE0C4",
          300: "#6FD1A8",
          400: "#3FC28C",
          500: "#2FAF7A",
          600: "#228B61",
          700: "#176748",
          800: "#0E4B33"
        },
        primary: {
          50: "#E8F7EF",
          100: "#CDEFE0",
          200: "#9FE0C4",
          300: "#6FD1A8",
          400: "#3FC28C",
          500: "#2FAF7A",
          600: "#228B61",
          700: "#176748",
          800: "#0E4B33"
        },
        patient: {
          50: "#EEF4FF",
          100: "#D9E6FF",
          200: "#B3C8FF",
          300: "#8AA9FF",
          400: "#5E88F5",
          500: "#3F6FE0",
          600: "#2F55B0",
          700: "#234184",
          800: "#1A2F5A"
        },
        pharmacy: {
          50: "#FFF4E7",
          100: "#FFE3C2",
          200: "#FFC98A",
          300: "#F9A84F",
          400: "#F28C2B",
          500: "#DD7416",
          600: "#B85B0E",
          700: "#8D450B",
          800: "#5E2F07"
        },
        admin: {
          50: "#F5F0FF",
          100: "#E7DDFF",
          200: "#D0B9FF",
          300: "#B08CFF",
          400: "#8A5CF5",
          500: "#6D38E1",
          600: "#5625B7",
          700: "#401C85",
          800: "#2B1456"
        },
        ink: "#0f172a",
        surface: "#ffffff",
        glass: "rgba(255, 255, 255, 0.7)",
        critical: "#b42318",
        warning: "#f79009",
        success: "#039855",
        muted: "#64748b"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
        "3xl": "48px"
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "28px"
      },
      boxShadow: {
        soft: "0 24px 60px rgba(18, 64, 54, 0.18)",
        glass: "0 20px 60px rgba(16, 64, 52, 0.22)",
        card: "0 18px 40px rgba(16, 64, 52, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;