import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
	main: {
		build: {
			rollupOptions: {
				input: {
					index: resolve(__dirname, 'main-process/main.ts'),
				},
			},
		},
		resolve: {
			alias: [{ find: '@', replacement: resolve(__dirname) }],
		},
	},
	preload: {
		build: {
			rollupOptions: {
				input: {
					index: resolve(__dirname, 'main-process/preload.ts'),
				},
			},
		},
		resolve: {
			alias: [{ find: '@', replacement: resolve(__dirname) }],
		},
	},
	renderer: {
		root: './renderer',
		publicDir: '../public',
		build: {
			rollupOptions: {
				input: {
					index: resolve(__dirname, 'renderer/index.html'),
				},
			},
		},
		plugins: [react()],
		resolve: {
			alias: [{ find: '@', replacement: resolve(__dirname) }],
		},
	},
})
