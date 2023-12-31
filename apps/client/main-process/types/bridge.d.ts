import { api } from '../preload'

type ExtendWindowWithAPIKeys<T> = {
	[K in keyof T]: T[K]
}

declare global {
	interface Window extends ExtendWindowWithAPIKeys<typeof api> {}
}
