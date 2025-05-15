/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      colors: {
        primary: "#4F46E5", // indigo-600
        accent: "#06B6D4", // cyan-500
        dark: {
          950: "#0a0a0a",
          900: "#111827",
          800: "#1f2937",
          700: "#374151",
        },
      },
    },
  },
  plugins: [],
};
