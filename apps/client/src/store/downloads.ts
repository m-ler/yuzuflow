import { create } from 'zustand'

type DownloadProgress = {
	completed: boolean
	progress: number
	error: boolean
}

type DownloadsState = {
	currentDownloads: Record<number, DownloadProgress>
	addDownload: (id: number) => void
	removeDownload: (id: number) => void
	setDownloadProgress: (id: number, progress: number) => void
	setDownloadCompleted: (id: number) => void
	setDownloadError: (id: number) => void
}

export const downloadsState = create<DownloadsState>((set) => ({
	currentDownloads: {},
	addDownload: (id) => {
		set((state) => {
			const clone = state.currentDownloads
			clone[id] = {
				completed: false,
				error: false,
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
			clone[id].progress = progress
			return { currentDownloads: clone } 
		})
	},
	setDownloadCompleted: (id) => {
		setTimeout(() => {
			set((state) => {
				const clone = state.currentDownloads
				clone[id].completed = true
				return { currentDownloads: clone }
			})
		}, 1000)
	},
	setDownloadError: (id) => {
		set((state) => {
			const clone = state.currentDownloads
			clone[id].error = true
			return { currentDownloads: clone }
		})
	},
}))
