import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#1A6B5A",
        "primary-light": "#2D9E87",
        accent: "#F4845F",
        "accent-soft": "#FDE8DF",
        surface: "#F8FAF9",
        "border-soft": "#D6E8E3",
        "text-main": "#1C2B27",
        "text-muted": "#6B8A82",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        skeletonShimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseHeart: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        progressFill: {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease forwards",
        skeleton: "skeletonShimmer 1.5s infinite linear",
        "pulse-heart": "pulseHeart 1s ease-in-out infinite",
        "progress-fill": "progressFill 1.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
