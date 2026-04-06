/**
 * Optional legacy config. Do not load via @config in CSS — that breaks v4 content scanning.
 * Prefer @theme in index.css. This file is kept for tooling that expects it.
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
