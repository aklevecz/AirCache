module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      fatfrank: ["fatfrank", "sans-serif"],
      blackbeard: ["black-beard", "sans-serif"],
      temir: ["temir-web", "serif"],
    },

    extend: {
      colors: {
        polygon: "#8247E5",
      },
    },
  },
  plugins: [],
};
