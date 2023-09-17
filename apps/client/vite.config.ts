import { defineConfig } from 'vite';
import path from 'node:path';
import electron from 'vite-plugin-electron/simple';
import react from '@vitejs/plugin-react';

export default defineConfig({
	resolve: {
		alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
	},
	plugins: [
		react(),
		electron({
			main: {
				entry: 'electron/main.ts',
			},
			preload: {
				input: path.join(__dirname, 'electron/preload.ts'),
			},
			renderer: {},
		}),
	],
});