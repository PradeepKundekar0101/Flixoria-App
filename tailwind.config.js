/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        springGreen: "#13f287", // Spring Green from the palette
        gradientStart: "#093971", // Gradient start (from the palette)
        gradientMiddle: "#13F287", // Gradient middle (matches Spring Green)
        gradientEnd: "#5CA0DE", // Gradient end
        night: "#121212", // Night color from the palette
        white: "#FFFFFF", // White color from the palette
        darkStroke:"#292929"
      },
      fontFamily: {},
    },
  },
  plugins: [],
};
