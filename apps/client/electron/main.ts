import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, 'app/img/app-icon.ico'),
		autoHideMenuBar: true,
		frame: false,
		titleBarStyle: 'hidden',
		width: 1080,
		height: 720,
		minWidth: 320,
		minHeight: 320,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	// Test active push message to Renderer-process.
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', new Date().toLocaleString());
	});

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL);
	} else {
		// win.loadFile('dist/index.html')
		win.loadFile(path.join(process.env.DIST, 'index.html'));
	}
}

ipcMain.on('window/quit', () => {
	app.quit();
});

ipcMain.handle('window/maximize', () => {
	const window = BrowserWindow.getFocusedWindow();
	if (!window) return;
	window.isMaximized() ? window.unmaximize() : window.maximize();
	return window.isMaximized();
});

ipcMain.on('window/minimize', () => {
	BrowserWindow.getFocusedWindow()?.minimize();
});

ipcMain.handle('window/isMaximized', () => {
	return Boolean(BrowserWindow.getFocusedWindow()?.isMaximized());
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
		win = null;
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.whenReady().then(createWindow);
