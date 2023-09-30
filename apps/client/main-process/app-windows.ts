import { BrowserWindow } from 'electron'

type AppWindow = 'main'

const appWindows: Record<AppWindow, BrowserWindow | null> = {
	main: null,
}

export default appWindows
