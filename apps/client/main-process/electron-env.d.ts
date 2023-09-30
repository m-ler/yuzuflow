/// <reference types="vite-plugin-electron/electron-env" />
import { api } from './preload'

type ExtendWindowWithAPIKeys<T> = {
	[K in keyof T]: T[K]
}

declare global {
	interface Window extends ExtendWindowWithAPIKeys<typeof api> {}
}

declare namespace NodeJS {
	interface ProcessEnv {
		/**
		 * The built directory structure
		 *
		 * ```tree
		 * ├─┬─┬ dist
		 * │ │ └── index.html
		 * │ │
		 * │ ├─┬ dist-electron
		 * │ │ ├── main.js
		 * │ │ └── preload.js
		 * │
		 * ```
		 */
		DIST: string
		/** /dist/ or /public/ */
		VITE_PUBLIC: string
	}
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
	ipcRenderer: import('electron').IpcRenderer
}
