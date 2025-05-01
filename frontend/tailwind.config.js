/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary-light': '#4F46E5',
        'primary-dark': '#6366F1',
        'background-light': '#F9FAFB',
        'background-dark': '#1F2937',
        'text-light': '#111827',
        'text-dark': '#F9FAFB',
      },
      boxShadow: {
        'card-light': '0 10px 20px rgba(0, 0, 0, 0.08)',
        'card-dark': '0 10px 20px rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
}; 