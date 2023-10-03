import path from 'node:path'
import { YUZU_EA_REPO_URL, YUZU_MAINLINE_REPO_URL, YuzuType } from 'shared'
import appWindows from '../app-windows'
import axios, { AxiosResponse } from 'axios'
import fs from 'fs'
import Seven from 'node-7z'
import decompress from 'decompress'
import { get7ZipBinaryPath } from './7zip'
import fse from 'fs-extra'
import fsExtra from 'fs-extra/esm'

class ReleaseDownloader {
	private directory = ''
	private id: number | null = 0
	private type: YuzuType | null = null
	private versionTag = ''

	constructor(directory: string, id: number, type: YuzuType, versionTag: string) {
		this.directory = directory
		this.id = id
		this.type = type
		this.versionTag = versionTag
		this.startDownload()
	}

	private startDownload = () => {
		appWindows.main?.webContents.send('release-download/start', this.id)
		if (!this.validateDirectory()) return

		this.download()
	}

	private validateDirectory = () => {
		const directoryExists = fs.existsSync(this.directory || '')
		if (!directoryExists) this.sendDownloadError('The download directory does not exist.')

		return directoryExists
	}

	private download = () => {
		const repoUrl = this.type === 'ea' ? YUZU_EA_REPO_URL : YUZU_MAINLINE_REPO_URL

		axios
			.get(`https://api.github.com/${repoUrl}/assets/${this.id}`, {
				headers: {
					Accept: 'application/octet-stream',
				},
				responseType: 'stream',
				onDownloadProgress: (e) => {
					if (e.progress) appWindows.main?.webContents.send('release-download/update', this.id, e.progress)
				},
			})
			.then((res) => {
				const fileExtension = this.getStreamFileExtension(res)
				const invalidExtension = fileExtension !== '.7z' && fileExtension !== '.zip'
				if (invalidExtension) {
					this.sendDownloadError('Invalid release files.')
					return
				}

				const filePath = `${this.directory}/${this.versionTag}${fileExtension}`
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
		appWindows.main?.webContents.send('release-download/error', this.id || 0, message)
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
		const extractionDir = path.join(this.directory, `${this.versionTag}temp`)
		const onSuccess = () => {
			this.organizeExtractionContents(extractionDir, filePath)
			appWindows.main?.webContents.send('release-download/completed', this.id)
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
		const destinationDir = path.join(this.directory, this.versionTag)
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
		const versionPath = path.join(directory, fileName)
		fs.writeFileSync(versionPath, this.versionTag)
	}
}

export default ReleaseDownloader
