import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import path from 'node:path'
import windowStateKeeper from 'electron-window-state'
import axios from 'axios'
import { YUZU_EA_REPO_URL, YUZU_MAINLINE_REPO_URL, YuzuType } from 'shared'

process.env.DIST = path.join(__dirname, '../dist')
console.log(process.env.DIST);

process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
	const mainWindowState = windowStateKeeper({
		defaultWidth: 1024,
		defaultHeight: 724,
	})

	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, 'app/img/app-icon.ico'),
		autoHideMenuBar: true,
		frame: false,
		titleBarStyle: 'hidden',
		width: mainWindowState.width,
		height: mainWindowState.height,
		minWidth: 320,
		minHeight: 320,
		x: mainWindowState.x,
		y: mainWindowState.y,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	})

	win.on('resize', () => {
		if (win) mainWindowState.saveState(win)
	})

	win.on('move', () => {
		if (win) mainWindowState.saveState(win)
	})

	mainWindowState.manage(win)

	// Test active push message to Renderer-process.
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', new Date().toLocaleString())
	})

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL)
	} else {
		// win.loadFile('dist/index.html')
		win.loadFile(path.join(process.env.DIST, 'index.html'))
	}
}

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

ipcMain.handle('download-release', (_, assetId: number, type: YuzuType) => {
	console.log('WILL DONWLOAD: ', assetId)
	const repoUrl = type === 'ea' ? YUZU_EA_REPO_URL : YUZU_MAINLINE_REPO_URL
	axios
		.get(`https://api.github.com/${repoUrl}/assets/${assetId}`, {
			headers: {
				Accept: 'application/octet-stream',
			},
			onDownloadProgress: (e) => {
				console.log(e.progress)
			},
		})
		.then((res) => {
			console.log(new Blob([res.data]).size)
		})
		.catch((error) => {
			console.error(error)
		})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
		win = null
	}
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

app.whenReady().then(createWindow)
