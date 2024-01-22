/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        claw_uno: "#C2AB99",
        claw_dos: "#BC6E2C",
        claw_tres: "#4E2E17",
        claw_quatro: "#4E2E17",
        claw_cinco: "#535454",
        claw_sies: "#868074",
        claw_siete: "#EBE0DA",
        claw_ocho: "#F2ECE9",
        claw_nueve: "#F5DCC6",
        claw_diez: "#3E4454",
      },
      animation: {
        blob_move: "blob_move 10s linear infinite",
      },
      keyframes: {
        blob_move: {
          "0%, 100%": {
            transform: "translate(0px, 0px)",
          },
          "25%": {
            transform: "translate(80px, 80px)",
          },
          "50%": {
            transform: "translate(0px, 100px)",
          },
          "75%": {
            transform: "translate(-80px, 80px)",
          },
        },
      },
      fontFamily: {
        gravitas: ["Gravitas One",  "sans-serif"],
        // cormorant_upright: ["Cormorant Upright",  "sans-serif"],
      },
    },
  },
  plugins: [],
};
