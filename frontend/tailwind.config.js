/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        formal: {
          "primary": "#1a365d",
          "secondary": "#2d3748",
          "accent": "#4a5568",
          "neutral": "#2d3748",
          "base-100": "#ffffff",
          "info": "#4299e1",
          "success": "#48bb78",
          "warning": "#ed8936",
          "error": "#e53e3e",
        },
      },
      "dark",
    ],
  },
};
