import path from 'node:path'

export const get7ZipBinaryPath = () => {
	if (import.meta.env.DEV) return path.join(__dirname, '../../node_modules/7zip-bin/win', process.arch, '7za.exe')
	return path.join(process.cwd(), 'resources/app.asar.unpacked/node_modules/7zip-bin/win', process.arch, '7za.exe')
}
