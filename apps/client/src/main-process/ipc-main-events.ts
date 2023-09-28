import axios from 'axios'
import { BrowserWindow, app, dialog, ipcMain } from 'electron'
import { YUZU_EA_REPO_URL, YUZU_MAINLINE_REPO_URL, YuzuType } from 'shared'
import { getMainWindow } from './app-windows'

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
	const contents = getMainWindow().webContents
	const repoUrl = type === 'ea' ? YUZU_EA_REPO_URL : YUZU_MAINLINE_REPO_URL
	console.log(directory)

	contents.send('release-download/start', assetId)
	axios
		.get(`https://api.github.com/${repoUrl}/assets/${assetId}`, {
			headers: {
				Accept: 'application/octet-stream',
			},
			onDownloadProgress: (e) => {
				if (e.progress) contents.send('release-download/update', assetId, e.progress)
			},
		})
		.then(() => {
			//console.log(new Blob([res.data]).size)
			contents.send('release-download/completed', assetId)
		})
		.catch((error) => {
			console.error(error)

			contents.send('release-download/error', assetId)
		})
})
