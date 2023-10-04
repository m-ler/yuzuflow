import fs from 'fs'
import path from 'node:path'
import appWindows from '../app-windows'
import { InstalledVersion } from '../types'
import Store from 'electron-store'

const store = new Store()

export default class VersionsDetector {
	mainlineDirectory = ''
	eaDirectory = ''

	constructor() {
		this.mainlineDirectory = (store.get('mainline-download-directory') as string) || ''
		this.eaDirectory = (store.get('ea-download-directory') as string) || ''
	}

	private readFoo = (directory: string) => {
		if (!fs.existsSync(directory)) return []

		const versions = []
		const subdirectories = fs.readdirSync(directory)

		for (const subDir of subdirectories) {
			const versionPath = path.join(directory, subDir, 'version')
			if (!fs.existsSync(versionPath)) continue
			const versionFile = fs.readFileSync(versionPath, 'utf-8')

			try {
				const versionData = JSON.parse(versionFile) as InstalledVersion
				versionData.directory = path.join(directory, subDir)
				versions.push(versionData)
			} catch (e) {
				console.error(e)
			}
		}

		return versions
	}

	updateInstalledVersions = () => {
		const mainline = this.readFoo(this.mainlineDirectory)
		const ea = this.readFoo(this.eaDirectory)
		appWindows.main?.webContents.send('installed-versions/update', { mainline, ea })
	}
}
