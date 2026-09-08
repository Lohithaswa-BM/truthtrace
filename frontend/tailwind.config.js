/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Backgrounds (dark navy/black)
        bg: {
          root: "#080b14",      // app background
          panel: "#0e1422",     // sidebar / header
          card: "#111827",      // card surface
          cardalt: "#0d1320",   // nested/darker surface
          hover: "#161f33",
        },
        border: {
          subtle: "#1e2740",
          faint: "#161d30",
        },
        // Accents
        accent: {
          blue: "#4f8cff",
          bluedim: "#2f5fb0",
          purple: "#a855f7",
          purpledim: "#7c3aed",
          indigo: "#6366f1",
        },
        // Status / score colors
        status: {
          red: "#ef4444",
          orange: "#f59e0b",
          yellow: "#eab308",
          green: "#22c55e",
          greendim: "#16a34a",
        },
        text: {
          primary: "#e5e9f0",
          secondary: "#9aa4bd",
          muted: "#5f6b85",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: { xl: "0.875rem", "2xl": "1.125rem" },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.25)",
        glow: "0 0 24px rgba(79,140,255,0.15)",
        glowpurple: "0 0 28px rgba(168,85,247,0.20)",
      },
    },
  },
  plugins: [],
};
