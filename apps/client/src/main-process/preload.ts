import { ipcRenderer, contextBridge, IpcRendererEvent } from 'electron'
import { YuzuType } from 'shared'

export const api = {
	appWindow: {
		minimize: () => ipcRenderer.send('window/minimize'),
		maximize: (): Promise<boolean> => ipcRenderer.invoke('window/maximize'),
		isMaximized: (): Promise<boolean> => ipcRenderer.invoke('window/isMaximized'),
		quit: () => ipcRenderer.send('window/quit'),
	},
	fileExplorer: {
		selectDirectory: (): Promise<string[] | undefined> => ipcRenderer.invoke('dialog/select-directory'),
	},
	yuzu: {
		downloadRelease: (assetId: number, type: YuzuType) => ipcRenderer.invoke('download-release', assetId, type),
		downloadEvents: {
			onStart: (callback: (_: IpcRendererEvent, id: number) => unknown) =>
				ipcRenderer.on('release-download/start', callback),
			removeOnStart: (callback: (_: IpcRendererEvent, id: number) => unknown) =>
				ipcRenderer.removeListener('release-download/start', callback),
			onUpdate: (callback: (_: IpcRendererEvent, id: number, progress: number) => unknown) =>
				ipcRenderer.on('release-download/update', callback),
			removeOnUpdate: (callback: (_: IpcRendererEvent, id: number, progress: number) => unknown) =>
				ipcRenderer.on('release-download/update', callback),
			onCompleted: (callback: (_: IpcRendererEvent, id: number) => unknown) =>
				ipcRenderer.on('release-download/completed', callback),
			removeOnCompleted: (callback: (_: IpcRendererEvent, id: number) => unknown) =>
				ipcRenderer.on('release-download/completedupdate', callback),
			onError: (callback: (_: IpcRendererEvent, id: number) => unknown) =>
				ipcRenderer.on('release-download/error', callback),
			removeOnError: (callback: (_: IpcRendererEvent, id: number) => unknown) =>
				ipcRenderer.on('release-download/error', callback),
			onRemove: (callback: (_: IpcRendererEvent, id: number) => unknown) =>
				ipcRenderer.on('release-download/remove', callback),
			removeOnRemove: (callback: (_: IpcRendererEvent, id: number) => unknown) =>
				ipcRenderer.on('release-download/remove', callback),
		},
	},
}

Object.keys(api).forEach((key) => {
	contextBridge.exposeInMainWorld(key, api[key as keyof typeof api])
})
