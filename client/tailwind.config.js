/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0F172A", // Slate 900
        cardBg: "#1E293B", // Slate 800
        primary: "#3B82F6", // Blue
        success: "#10B981", // Green
        warning: "#F59E0B", // Yellow
        danger: "#EF4444",  // Red
      }
    },
  },
  plugins: [],
}
