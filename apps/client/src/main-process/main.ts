import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import windowStateKeeper from 'electron-window-state'
import './ipc-main-events'

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

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
