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
        primary: "#2563EB", // Deeper, professional Blue-600
        success: "#10B981", // Green
        warning: "#F59E0B", // Yellow
        danger: "#EF4444",  // Red
      },
      boxShadow: {
        'glow': '0 0 20px rgba(37, 99, 235, 0.15)',
        'glow-lg': '0 0 30px rgba(37, 99, 235, 0.25)',
        'super-glow': '0 0 40px rgba(37, 99, 235, 0.35)',
      }
    },
  },
  plugins: [],
}
