import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F4EC",
        evergreen: {
          DEFAULT: "#173226",
          light: "#264A3B",
          dark: "#0E211A",
        },
        sage: {
          DEFAULT: "#7C9A75",
          light: "#A7C09E",
          dark: "#5A7754",
        },
        honey: {
          DEFAULT: "#C68A34",
          light: "#E0AC5F",
          dark: "#9C6B24",
        },
        ink: "#20241E",
        moss: "#4E5245",
        sand: "#EDE7D8",
        whatsapp: {
          DEFAULT: "#0F7A6D",
          dark: "#0C6355",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        content: "1240px",
      },
      borderRadius: {
        organic: "63% 37% 54% 46% / 43% 47% 53% 57%",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(20px,-15px) scale(1.05)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        drift: "drift 12s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
