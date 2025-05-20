export default {
  darkMode: "class", // <- Habilita modo escuro por classe
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")],
};
