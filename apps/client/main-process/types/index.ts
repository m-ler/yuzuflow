import { YuzuVersion } from 'shared'

export type InstalledVersion = YuzuVersion & {
	directory: string
}

export type InstalledVersions = {
	mainline: InstalledVersion[]
	ea: InstalledVersion[]
}
