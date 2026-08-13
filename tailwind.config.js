/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wedding: {
          terracotta: '#D95D39',
          'terracotta-dark': '#C04823',
          'terracotta-light': '#F8E8E2',
          cream: '#FAF7F2',
          'cream-card': '#FFFFFF',
          coffee: '#3A231A',
          sage: '#4A6B53',
          'sage-light': '#EBF2EE',
          gold: '#D4A359',
          'gold-light': '#FAF4E8',
          sand: '#EFEAE1',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'wedding-sm': '0 2px 8px -1px rgba(58, 35, 26, 0.06), 0 1px 4px -1px rgba(58, 35, 26, 0.04)',
        'wedding': '0 8px 24px -2px rgba(58, 35, 26, 0.08), 0 2px 6px -1px rgba(58, 35, 26, 0.04)',
        'wedding-lg': '0 16px 36px -4px rgba(58, 35, 26, 0.12), 0 4px 12px -2px rgba(58, 35, 26, 0.06)',
      },
    },
  },
  plugins: [],
}
