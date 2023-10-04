import { create } from 'zustand'

type InstalledVersionTagsState = {
	mainline: string[]
	ea: string[]
	updateInstalledVersionTags: (mainline: string[], ea: string[]) => void
}

export const installedVersionTagsState = create<InstalledVersionTagsState>((set) => ({
	mainline: [],
	ea: [],
	updateInstalledVersionTags: (mainline, ea) => set({ mainline, ea }),
}))
