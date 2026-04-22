/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7CB98B",     // navbar green
        primaryDark: "#5FA374",

        accent: "#F5C044",      // yellow button
        accentDark: "#E2AF30",

        textMain: "#2F3E34",
        textLight: "#6B7280",

        bgLight: "#F9FAFB",
        card: "#FFFFFF",
      },
    },
  },
  plugins: [],
};