import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1b1524",
        mist: "#f7f1eb",
        gold: "#d6b06f",
        rose: "#f0b4a7",
        plum: "#6f507f",
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "Helvetica Neue", "Arial", "sans-serif"],
      },
      boxShadow: {
        aura: "0 30px 80px rgba(14, 10, 24, 0.35)",
        card: "0 24px 70px rgba(0, 0, 0, 0.35)",
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at top, rgba(255,255,255,0.24), transparent 36%), radial-gradient(circle at bottom, rgba(251,226,195,0.22), transparent 30%)",
      },
    },
  },
  plugins: [],
};

export default config;
