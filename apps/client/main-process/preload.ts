import { ipcRenderer, contextBridge, IpcRendererEvent } from 'electron'
import { YuzuVersion } from 'shared'
import { InstalledVersions } from './types'

export const api = {
	appWindow: {
		minimize: () => ipcRenderer.send('window/minimize'),
		maximize: (): Promise<boolean> => ipcRenderer.invoke('window/maximize'),
		isMaximized: (): Promise<boolean> => ipcRenderer.invoke('window/isMaximized'),
		quit: () => ipcRenderer.send('window/quit'),
	},
	fileExplorer: {
		selectDirectory: (): Promise<string[] | undefined> => ipcRenderer.invoke('dialog/select-directory'),
		openDirectory: (directory: string) => ipcRenderer.send('dialog/open-directory', directory),
	},
	yuzu: {
		downloadRelease: (yuzuObj: YuzuVersion) => ipcRenderer.invoke('download-release', yuzuObj),
		downloadEvents: {
			onStart: (callback: (_: IpcRendererEvent, id: number) => unknown) =>
				ipcRenderer.on('release-download/start', callback),
			removeOnStart: () => ipcRenderer.removeAllListeners('release-download/start'),

			onUpdate: (callback: (_: IpcRendererEvent, id: number, progress: number) => unknown) =>
				ipcRenderer.on('release-download/update', callback),
			removeOnUpdate: () => ipcRenderer.removeAllListeners('release-download/update'),

			onCompleted: (callback: (_: IpcRendererEvent, id: number) => unknown) =>
				ipcRenderer.on('release-download/completed', callback),
			removeOnCompleted: () => ipcRenderer.removeAllListeners('release-download/completed'),

			onError: (callback: (_: IpcRendererEvent, id: number, message: string) => unknown) =>
				ipcRenderer.on('release-download/error', callback),
			removeOnError: () => ipcRenderer.removeAllListeners('release-download/error'),

			onRemove: (callback: (_: IpcRendererEvent, id: number) => unknown) =>
				ipcRenderer.on('release-download/remove', callback),
			removeOnRemove: () => ipcRenderer.removeAllListeners('release-download/remove'),
		},
		detectInstalledVersions: () => ipcRenderer.send('detect-installed-versions'),
		onInstalledVersionsUpdate: (callback: (_: IpcRendererEvent, versions: InstalledVersions) => unknown) => {
			ipcRenderer.on('installed-versions/update', callback)
		},
		removeOnInstalledVersionsUpdate: () => {
			ipcRenderer.removeAllListeners('installed-versions/update')
		},
	},
	store: {
		get: (key: string) => {
			return ipcRenderer.sendSync('electron-store/get', key)
		},
		set: (key: string, val: unknown) => {
			ipcRenderer.send('electron-store/set', key, val)
		},
		clear: () => {
			ipcRenderer.send('electron-store/clear')
		},
	},
	node: {
		getNodeVariables: async () => {
			const response = ipcRenderer.invoke('get-node-variables')
			console.log(response)
		},
	},
}

Object.keys(api).forEach((key) => {
	contextBridge.exposeInMainWorld(key, api[key as keyof typeof api])
})
