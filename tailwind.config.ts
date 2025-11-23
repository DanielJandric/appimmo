import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "SF Pro Display",
          "SF Pro Text",
          "SF Pro",
          "-apple-system",
          "BlinkMacSystemFont",
          "\"Segoe UI\"",
          "sans-serif",
        ],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "ui-monospace"],
      },
      boxShadow: {
        card: "0 30px 60px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "noise-soft":
          "radial-gradient(circle at 25% 25%, rgba(79,70,229,0.08), transparent 50%), radial-gradient(circle at 80% 0, rgba(16,185,129,0.08), transparent 40%)",
      },
    },
  },
  plugins: [],
};

export default config;

