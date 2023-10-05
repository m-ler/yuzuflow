import path from 'node:path'
import { YUZU_EA_REPO_URL, YUZU_MAINLINE_REPO_URL, YuzuVersion } from 'shared'
import appWindows from '../app-windows'
import axios, { AxiosResponse } from 'axios'
import fs from 'fs'
import Seven from 'node-7z'
import decompress from 'decompress'
import { get7ZipBinaryPath } from './7zip'
import fse from 'fs-extra'
import fsExtra from 'fs-extra/esm'
import { ipcMain } from 'electron'
import Store from 'electron-store'
import { InstalledVersion } from '../types'

const store = new Store()

class ReleaseDownloader {
	private directory = ''
	private yuzuObj

	constructor(yuzuObj: YuzuVersion) {
		this.directory = (store.get(`${yuzuObj.type}-download-directory`) as string) || ''
		this.yuzuObj = yuzuObj
		this.startDownload()
	}

	private startDownload = () => {
		appWindows.main?.webContents.send('release-download/start', this.yuzuObj.assetId)
		if (!this.validateDirectory()) return

		this.download()
	}

	private validateDirectory = () => {
		const directoryExists = fs.existsSync(this.directory || '')
		if (!directoryExists) this.sendDownloadError('The download directory does not exist.')

		return directoryExists
	}

	private download = () => {
		const repoUrl = this.yuzuObj.type === 'ea' ? YUZU_EA_REPO_URL : YUZU_MAINLINE_REPO_URL

		axios
			.get(`https://api.github.com/${repoUrl}/assets/${this.yuzuObj.assetId}`, {
				headers: {
					Accept: 'application/octet-stream',
				},
				responseType: 'stream',
				onDownloadProgress: (e) => {
					if (e.progress) appWindows.main?.webContents.send('release-download/update', this.yuzuObj.assetId, e.progress)
				},
			})
			.then((res) => {
				const fileExtension = this.getStreamFileExtension(res)
				const invalidExtension = fileExtension !== '.7z' && fileExtension !== '.zip'
				if (invalidExtension) {
					this.sendDownloadError('Invalid release files.')
					return
				}

				const filePath = `${this.directory}/${this.yuzuObj.versionTag}${fileExtension}`
				res.data.pipe(fs.createWriteStream(filePath))
				res.data.on('end', () => {
					this.extractFiles(filePath, fileExtension)
				})
				res.data.on('error', () => {
					this.sendDownloadError('An error occured during the download.')
				})
			})
			.catch((error) => {
				console.error(error)
				this.sendDownloadError('An error occured during the download.')
			})
	}

	private sendDownloadError = (message: string) => {
		appWindows.main?.webContents.send('release-download/error', this.yuzuObj.assetId || 0, message)
	}

	private getStreamFileExtension = (res: AxiosResponse) => {
		const contentDisposition = res.headers['content-disposition']
		const matches = /filename=([^"]+)/.exec(contentDisposition)
		if (matches && matches.length > 1) {
			const fileExtension = path.extname(matches[1])
			return fileExtension
		}
		return null
	}

	private extractFiles = (filePath: string, extension: '.zip' | '.7z') => {
		const extractionDir = path.join(this.directory, `${this.yuzuObj.versionTag}temp`)
		const onSuccess = () => {
			this.organizeExtractionContents(extractionDir, filePath)
			appWindows.main?.webContents.send('release-download/completed', this.yuzuObj.assetId)
			ipcMain.emit('detect-installed-versions')
		}

		const onError = () => this.sendDownloadError('Files extraction failed.')

		if (extension === '.zip') {
			decompress(filePath, extractionDir).then(onSuccess).catch(onError)
			return
		}
		//7z
		const stream = Seven.extractFull(filePath, extractionDir, {
			$bin: get7ZipBinaryPath(),
		})
		stream.on('end', onSuccess)
		stream.on('error', onError)
	}

	private organizeExtractionContents = (extractionDir: string, assetPath: string) => {
		fse.removeSync(assetPath)
		const yuzuDirectory = this.getYuzuExeDirectory(extractionDir)
		const destinationDir = path.join(this.directory, this.yuzuObj.versionTag)
		if (!yuzuDirectory) {
			//remove "temp" from the extracted folder name
			fsExtra.moveSync(extractionDir, destinationDir)
			this.addVersionFileIntoYuzuFolder(destinationDir)
			return
		}

		fsExtra.moveSync(yuzuDirectory, destinationDir, { overwrite: true })
		if (yuzuDirectory !== extractionDir) fse.removeSync(extractionDir)
		this.addVersionFileIntoYuzuFolder(destinationDir)
	}

	private getYuzuExeDirectory = (directory: string) => {
		const hasYuzuExe = fs.existsSync(path.join(directory, 'yuzu.exe'))
		if (hasYuzuExe) return directory

		const subdirectories = fs.readdirSync(directory)
		for (const sub of subdirectories) {
			const subPath = path.join(directory, sub)
			if (this.getYuzuExeDirectory(subPath)) return subPath
		}

		return null
	}

	private addVersionFileIntoYuzuFolder = (directory: string) => {
		const fileName = 'version'
		const data: InstalledVersion = { ...this.yuzuObj, createdTime: Date.now(), directory }
		const fileContent = JSON.stringify(data)
		const versionPath = path.join(directory, fileName)
		fs.writeFileSync(versionPath, fileContent, 'utf-8')
	}
}

export default ReleaseDownloader
