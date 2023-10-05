import { downloadsState } from '@/renderer/store/downloads'
import { IpcRendererEvent } from 'electron'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

const DownloadsStateManager = () => {
	const { addDownload, removeDownload, setDownloadProgress, setDownloadCompleted, setDownloadError } = downloadsState()

	useEffect(() => {
		const onDownloadStart = (_: IpcRendererEvent, id: number) => addDownload(id)
		const onDownloadUpdate = (_: IpcRendererEvent, id: number, progress: number) => setDownloadProgress(id, progress)
		const onDownloadRemoved = (_: IpcRendererEvent, id: number) => removeDownload(id)
		const onDownloadCompleted = (_: IpcRendererEvent, id: number) => setDownloadCompleted(id)
		const onDownloadError = (_: IpcRendererEvent, id: number, message: string) => {
			toast.error(message)
			setDownloadError(id, message)
		}

		window.yuzu.downloadEvents.onStart(onDownloadStart)
		window.yuzu.downloadEvents.onUpdate(onDownloadUpdate)
		window.yuzu.downloadEvents.onRemove(onDownloadRemoved)
		window.yuzu.downloadEvents.onCompleted(onDownloadCompleted)
		window.yuzu.downloadEvents.onError(onDownloadError)

		return () => {
			window.yuzu.downloadEvents.removeOnStart()
			window.yuzu.downloadEvents.removeOnUpdate()
			window.yuzu.downloadEvents.removeOnRemove()
			window.yuzu.downloadEvents.removeOnCompleted()
			window.yuzu.downloadEvents.removeOnError()
		}
	}, [])

	return <></>
}

export default DownloadsStateManager
