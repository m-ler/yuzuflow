import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import windowStateKeeper from 'electron-window-state'
import './ipc-main-events'
import appWindows from './app-windows'
import appIcon from '../public/app/img/app-icon.ico?asset'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null

function createWindow() {
	const mainWindowState = windowStateKeeper({
		defaultWidth: 1024,
		defaultHeight: 724,
	})

	win = new BrowserWindow({
		icon: appIcon,
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
			preload: path.join(__dirname, '../preload/index.js'),
			webSecurity: false,
			devTools: !app.isPackaged,
		},
	})

	win.on('resize', () => {
		if (win) mainWindowState.saveState(win)
	})

	win.on('move', () => {
		if (win) mainWindowState.saveState(win)
	})

	mainWindowState.manage(win)

	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', new Date().toLocaleString())
	})

	appWindows.main = win

	if (process.env['ELECTRON_RENDERER_URL']) {
		win.loadURL(process.env['ELECTRON_RENDERER_URL'])
	} else {
		win.loadFile(path.join(__dirname, '../renderer/index.html'))
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
