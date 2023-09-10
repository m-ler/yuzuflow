/** @type {import('tailwindcss').Config} */
/*eslint-env node*/
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: true,
	theme: {
		fontFamily: {
			'sans': ['system-ui', 'sans-serif'],
		},
		extend: {},
	},
	plugins: [],
};
