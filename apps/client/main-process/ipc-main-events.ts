import { BrowserWindow, app, dialog, ipcMain } from 'electron'
import { YuzuType } from 'shared'
import releaseDownloader from './lib/release-downloader'

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

ipcMain.handle('dialog/select-directory', () => {
	const selectedDirectory = dialog.showOpenDialogSync({
		properties: ['openDirectory'],
	})

	return selectedDirectory
})

ipcMain.handle('download-release', (_, assetId: number, type: YuzuType, directory: string) => {
	new releaseDownloader(directory, assetId, type)
})

ipcMain.handle('get-node-variables', () => {
	return { cwd: process.cwd(), dirname: __dirname, isDev: import.meta.env.DEV }
})
