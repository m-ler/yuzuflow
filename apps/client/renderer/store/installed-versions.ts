import { InstalledVersion } from '@/main-process/types'
import { create } from 'zustand'

type InstalledVersionsState = {
	mainline: InstalledVersion[]
	ea: InstalledVersion[]
	updateInstalledVersions: (mainline: InstalledVersion[], ea: InstalledVersion[]) => void
}

export const installedVersionsState = create<InstalledVersionsState>((set) => ({
	mainline: [],
	ea: [],
	updateInstalledVersions: (mainline, ea) => set({ mainline, ea }),
}))
