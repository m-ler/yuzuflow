/** @type {import('tailwindcss').Config} */
/*eslint-env node*/

import { nextui } from '@nextui-org/react';

module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', `./../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}`],
	darkMode: 'class',
	theme: {
		fontFamily: {
			'sans': ['system-ui', 'sans-serif'],
		},
		extend: {},
	},
	plugins: [nextui()],
};
