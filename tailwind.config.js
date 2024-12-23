/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        woodenBorder: "#E6BF83",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
