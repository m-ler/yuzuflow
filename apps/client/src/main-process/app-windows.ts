import { BrowserWindow } from 'electron'
export const getMainWindow = () => BrowserWindow.getAllWindows()[0]
