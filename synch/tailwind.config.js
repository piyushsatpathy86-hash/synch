/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        orange: "#FF4A00",
        "orange-light": "#FFF0EB",
        "orange-dark": "#CC3A00",

        navy: "#0D0D1A",
        "navy-mid": "#1A1A2E",
        "navy-light": "#252540",

        purple: "#534AB7",
        "purple-light": "#EEEDFE",

        teal: "#0F6E56",
        "teal-light": "#E1F5EE",

        "gray-mid": "#888899",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}