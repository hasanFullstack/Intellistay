/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f7ff",
          100: "#e0eeff",
          200: "#c7e0ff",
          300: "#a4cafe",
          400: "#7cb3fc",
          500: "#3b82f6",
          600: "#235784",
          700: "#1b4565",
          800: "#1a3555",
          900: "#1a3f57",
        },
      },
    },
  },
  plugins: [],
};
