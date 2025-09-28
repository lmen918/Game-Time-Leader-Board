/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "monospace"],
      },
      colors: {
        "game-bg": "#0a0a0a",
        "game-primary": "#ffd700",
        "game-secondary": "#f59e0b",
      },
      boxShadow: {
        glow: "0 0 8px rgba(255, 215, 0, 0.7)",
        "glow-sm": "0 0 4px rgba(255, 215, 0, 0.5)",
        "glow-lg": "0 0 16px rgba(255, 215, 0, 0.8)",
      },
      animation: {
        "pulse-glow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 3s infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
