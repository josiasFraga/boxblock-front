/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    "./public/**/*.html",
    "./node_modules/flowbite-react/**/*.js",
  ],
  theme: {
    //extend: {},
    fontFamily: {
      sora: ['"Sora"', 'sans-serif'],
      inter: ['"Inter"', 'sans-serif'],
      epilogue: ['"Epilogue"', 'sans-serif'],
    }
  },
  plugins: [
    require('flowbite/plugin'),
  ]
}
