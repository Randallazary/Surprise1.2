/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orangeWeb: '#F9A620',
        mustard: '#FFD449',
        appleGreen: '#AAB03C',
        forestGreen: '#548C2F',
        pakistanGreen: '#104911',
        frenchGray: '#EDEDED',
        background: "var(--background)",
        foreground: "var(--foreground)",
        

      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(45deg, #ab46d2, #6081ff, #00aaff, #00caff, #00e4f9, #00e5f5, #00e6f1, #00e7ec, #00d2fc, #00b9ff, #009cff, #0079ff), linear-gradient(135deg, #ab46d2, #6081ff, #00aaff, #00caff, #00e4f9, #00e5f5, #00e6f1, #00e7ec, #00d2fc, #00b9ff, #009cff, #0079ff)',

      },
    },
  },
  plugins: [],

};


