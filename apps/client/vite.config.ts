import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron'
import react from '@vitejs/plugin-react'

export default defineConfig({
	resolve: {
		alias: [{ find: '@', replacement: path.resolve(__dirname) }],
	},
	plugins: [
		react(),
		electron([
			{
				entry: path.join(__dirname, 'main-process/main.ts'),
			},
			{
				entry: path.join(__dirname, 'main-process/preload.ts'),
			},
		]),
	],
})
