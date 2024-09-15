/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        theme: {
          DEFAULT: "#9E78CF",
          100: "#9E78CF",
          500: "#3E1671",
          800: "#15101C",
          900: "#0D0714",
        },
        white: {
          DEFAULT: "#FFFFFF",
        },
        green: {
          DEFAULT: "#6BB79D",
        },
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
};
