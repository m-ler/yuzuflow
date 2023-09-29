import PageTransition from '@/components/Transitions/PageTransition'
import VersionsTable from '@/components/VersionsTable/VersionsTable'
import useYuzuVersionsRequest from '@/hooks/useYuzuVersionsRequest'
import { Tabs, Tab } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { YuzuType } from 'shared'
import RequestErrorState from './components/RequestErrorState'
import useStorageState from '@/hooks/useStorageState'
import { IpcRendererEvent } from 'electron'
import { downloadsState } from '@/store/downloads'
import toast from 'react-hot-toast'

const Download = () => {
	const [selectedTab, setSelectedTab] = useStorageState<React.Key>('downloads-tab', 'mainline')
	const setTab = (key: React.Key) => setSelectedTab(key)
	const [page, setPage] = useState(1)
	const request = useYuzuVersionsRequest({ type: selectedTab as YuzuType, page })
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

	return (
		<PageTransition>
			<div
				className={`fixed inset-0 bg-cover pointer-events-none ${
					selectedTab === 'ea' ? 'hue-rotate-[70deg] opacity-40' : 'opacity-30'
				} duration-500`}
				style={{ backgroundImage: 'url(/app/img/background-gradient.png)' }}
			></div>
			<section className="w-full h-full max-h-full p-4  overflow-auto">
				<div className="flex flex-col gap-4 mx-auto w-full h-full max-w-screen-lg">
					<Tabs
						color="primary"
						selectedKey={selectedTab}
						onSelectionChange={(value) => {
							setPage(1)
							setTab(value)
						}}
						classNames={{ tabList: 'bg-zinc-800', cursor: selectedTab === 'ea' ? 'bg-amber-600' : 'bg-rose-600' }}
					>
						<Tab key="mainline" title="Mainline"></Tab>
						<Tab key="ea" title="Early Access"></Tab>
					</Tabs>
					{request.error ? (
						<RequestErrorState />
					) : (
						<VersionsTable
							type={selectedTab}
							loading={request.isFetching}
							page={page}
							pageCount={request.data?.pageCount || 0}
							onPageChange={(page) => setPage(page)}
							data={request.data?.data || []}
						/>
					)}
				</div>
			</section>
		</PageTransition>
	)
}

export default Download
