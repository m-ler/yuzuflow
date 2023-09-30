import path from 'node:path'
import { YUZU_EA_REPO_URL, YUZU_MAINLINE_REPO_URL, YuzuType } from 'shared'
import appWindows from './app-windows'
import axios, { AxiosResponse } from 'axios'
import fs from 'fs'
import Seven from 'node-7z'
import sevenBin from '7zip-bin'
import decompress from 'decompress'

class ReleaseDownloader {
	private directory = ''
	private id: number | null = 0
	private type: YuzuType | null = null

	constructor(directory: string, id: number, type: YuzuType) {
		this.directory = directory
		this.id = id
		this.type = type
		this.startDownload()
	}

	private startDownload = () => {
		appWindows.main?.webContents.send('release-download/start', this.id)

		console.log(this.directory)
		if (!this.validateDirectory()) return

		this.download()
	}

	private validateDirectory = () => {
		const directoryExists = fs.existsSync(this.directory || '')
		console.log('DIRECTORY EXISTS:')
		console.log(directoryExists)
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
				console.log(fileExtension)
				const invalidExtension = fileExtension !== '.7z' && fileExtension !== '.zip'
				if (invalidExtension) {
					this.sendDownloadError('Invalid release files.')
					return
				}

				const filePath = `${this.directory}/${this.id}${fileExtension}`
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
		console.log(contentDisposition)

		const matches = /filename=([^"]+)/.exec(contentDisposition)
		if (matches && matches.length > 1) {
			const fileExtension = path.extname(matches[1])
			return fileExtension
		}
		return null
	}

	private extractFiles = (filePath: string, extension: '.zip' | '.7z') => {
		const extractionPath = `${this.directory}/${this.id}`

		if (extension === '.zip') {
			decompress(filePath, extractionPath)
				.then(() => {
					appWindows.main?.webContents.send('release-download/completed', this.id)
				})
				.catch(() => {
					this.sendDownloadError('Files extraction failed.')
				})
			return
		}
		//7z
		const stream = Seven.extractFull(filePath, extractionPath, {
			//$bin: path.join(process.cwd(), 'node_modules/7zip-bin/win/x64/7za.exe'),
			$bin: sevenBin.path7za,
		})
		stream.on('end', () => {
			appWindows.main?.webContents.send('release-download/completed', this.id)
		})
		stream.on('error', (error) => {
			console.error(error)
			this.sendDownloadError('Files extraction failed.')
		})
	}
}

export default ReleaseDownloader
