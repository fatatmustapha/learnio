/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkTeal: "#0F3D3E",
        teal: "#1F7A8C",
        green: "#2EC4B6",
        yellow: "#FFD166",
        red: "#F25F5C",
        snow: "#F8FAFC",
      },
    },
  },
  plugins: [],
};