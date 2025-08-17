/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#F8FAFC",
        yellow: "#F5D565",
        cream: "#F5E8D5",
        orange: "#E9A23B",
        limeGreen: "#A0ECB1",
        green: "#32D657",
        babyPink: "#F7D4D3",
        red: "#DD524C",
        veryLightGray: "#E3E8EF",
        lightGray: "#00000033",
        gray: "#97A3B6",
        blue: "#3662E3",
      },
      fontFamily: {
        custom: "Outfit",
      },
    },
  },
  plugins: [],
};
