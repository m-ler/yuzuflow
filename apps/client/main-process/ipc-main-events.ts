import { BrowserWindow, app, dialog, ipcMain } from 'electron'
import { YuzuVersion } from 'shared'
import releaseDownloader from './lib/release-downloader'
import VersionsDetector from './lib/versions-detector'
import { exec } from 'child_process'
import Store from 'electron-store'
import fs from 'node:fs'

const store = new Store()

ipcMain.on('window/quit', () => {
	app.quit()
})

ipcMain.handle('window/maximize', () => {
	const window = BrowserWindow.getFocusedWindow()
	if (!window) return
	window.isMaximized() ? window.unmaximize() : window.maximize()
	return window.isMaximized()
})

ipcMain.on('window/minimize', () => {
	BrowserWindow.getFocusedWindow()?.minimize()
})

ipcMain.handle('window/isMaximized', () => {
	return Boolean(BrowserWindow.getFocusedWindow()?.isMaximized())
})

ipcMain.on('file-explorer/file-exists', (event, directory: string) => {
	event.returnValue = fs.existsSync(directory)
})

ipcMain.handle('file-explorer/select-directory', () => {
	const selectedDirectory = dialog.showOpenDialogSync({
		properties: ['openDirectory'],
	})

	return selectedDirectory
})

ipcMain.on('file-explorer/open-directory', (_, directory: string) => {
	exec(`explorer "${directory}"`)
})

ipcMain.on('file-explorer/open-file', (_, directory: string) => {
	exec(directory, (error) => {
		console.error(error)
	})
})

ipcMain.handle('download-release', (_, yuzuObj: YuzuVersion) => {
	new releaseDownloader(yuzuObj)
})

ipcMain.on('detect-installed-versions', () => {
	const versionsDetector = new VersionsDetector()
	versionsDetector.updateInstalledVersions()
})

ipcMain.handle('get-node-variables', () => {
	return { cwd: process.cwd(), dirname: __dirname, isDev: import.meta.env.DEV }
})

ipcMain.on('electron-store/get', async (event, val) => {
	event.returnValue = store.get(val)
})

ipcMain.on('electron-store/set', async (_, key, val) => {
	store.set(key, val)
})

ipcMain.on('electron-store/clear', async () => {
	store.clear()
})
