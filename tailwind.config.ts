import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#002145",
        secondary: "#0055b7",
        tertiary: "#29bf12",
        color4: "#f9c80e",
        color5: "#ffffff",
        color6: "#7c96aa",
        color7: "#abff4f",
        color8: "#08bdbd",
        success: "#29bf12",
        info: "#08bdbd",
        light: "#ffffff",
        grey: "#7c96aa",
        accent: "#f9c80e",
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      screens: {
        'xl': '1200px',
        'lg': '992px',
        'md': '768px',
        'sm': '576px',
      },
    },
  },
  plugins: [],
} satisfies Config;

