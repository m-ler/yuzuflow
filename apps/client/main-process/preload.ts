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
		downloadRelease: (assetId: number, type: YuzuType, directory: string) =>
			ipcRenderer.invoke('download-release', assetId, type, directory),
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
