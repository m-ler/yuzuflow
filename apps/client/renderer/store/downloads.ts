import { create } from 'zustand'

type DownloadProgress = {
	completed: boolean
	progress: number
	error: string | null
}

type DownloadsState = {
	currentDownloads: Record<number, DownloadProgress>
	addDownload: (id: number) => void
	removeDownload: (id: number) => void
	setDownloadProgress: (id: number, progress: number) => void
	setDownloadCompleted: (id: number) => void
	setDownloadError: (id: number, message: string) => void
}

export const downloadsState = create<DownloadsState>((set) => ({
	currentDownloads: {},
	addDownload: (id) => {
		set((state) => {
			const clone = state.currentDownloads
			clone[id] = {
				completed: false,
				error: null,
				progress: 0,
			}
			return { currentDownloads: clone }
		})
	},
	removeDownload: (id) => {
		set((state) => {
			const clone = state.currentDownloads
			delete clone[id]
			return { currentDownloads: clone }
		})
	},
	setDownloadProgress: (id, progress) => {
		set((state) => {
			const clone = state.currentDownloads
			if (clone[id]) clone[id].progress = progress
			return { currentDownloads: clone }
		})
	},
	setDownloadCompleted: (id) => {
		setTimeout(() => {
			set((state) => {
				const clone = state.currentDownloads
				if (clone[id]) clone[id].completed = true
				return { currentDownloads: clone }
			})
		}, 1000)
	},
	setDownloadError: (id, message) => {
		set((state) => {
			const clone = state.currentDownloads
			if (clone[id]) {
				clone[id].error = message
				clone[id].progress = 1
			}
			return { currentDownloads: clone }
		})
	},
}))
