import { YuzuVersion } from 'shared'

export type InstalledVersion = YuzuVersion & {
	directory: string
	createdTime: number
}

export type InstalledVersions = {
	mainline: InstalledVersion[]
	ea: InstalledVersion[]
}
