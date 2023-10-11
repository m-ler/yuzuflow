import fs from 'fs'
import path from 'node:path'
import appWindows from '../app-windows'
import { InstalledVersion } from '../types'
import Store from 'electron-store'
import { YuzuType } from 'shared'

const store = new Store()

export default class VersionsDetector {
	mainlineDirectory = ''
	eaDirectory = ''

	constructor() {
		this.mainlineDirectory = (store.get('mainline-download-directory') as string) || ''
		this.eaDirectory = (store.get('ea-download-directory') as string) || ''
	}

	private readFoo = (directory: string, type: YuzuType) => {
		if (!fs.existsSync(directory)) return []

		const versions = []
		const subdirectories = fs.readdirSync(directory)

		for (const subDir of subdirectories) {
			const versionPath = path.join(directory, subDir, 'version')
			if (!fs.existsSync(versionPath)) continue
			const versionFile = fs.readFileSync(versionPath, 'utf-8')

			try {
				const versionData = JSON.parse(versionFile) as InstalledVersion
				if (versionData.type !== type) continue
				versionData.directory = path.join(directory, subDir)
				versions.push(versionData)
			} catch (e) {
				console.error(e)
			}
		}

		versions.sort((a, b) => b.createdTime - a.createdTime)
		return versions
	}

	updateInstalledVersions = () => {
		const mainline = this.readFoo(this.mainlineDirectory, 'mainline')
		const ea = this.readFoo(this.eaDirectory, 'ea')
		appWindows.main?.webContents.send('installed-versions/update', { mainline, ea })
	}
}
