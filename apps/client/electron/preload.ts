import { ipcRenderer, contextBridge } from 'electron';

export const api = {
	appWindow: {
		minimize: () => ipcRenderer.send('window/minimize'),
		maximize: (): Promise<boolean> => ipcRenderer.invoke('window/maximize'),
		isMaximized: (): Promise<boolean> => ipcRenderer.invoke('window/isMaximized'),
		quit: () => ipcRenderer.send('window/quit'),
	},
};

Object.keys(api).forEach(key => {
	contextBridge.exposeInMainWorld(key, api[key as keyof typeof api]);
});
