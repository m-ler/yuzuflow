import { Button, Progress, Spinner } from '@nextui-org/react'
import { YuzuType, YuzuVersion } from 'shared'
import { AnimatePresence, motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { useMemo, useState } from 'react'
import { downloadsState } from '@/renderer/store/downloads'
import DialogFolderInput from '../DialogFolderInput/DialogFolderInput'
import toast from 'react-hot-toast'

type Props = {
	data: YuzuVersion
	type: YuzuType
}

const YuzuVersionItem = ({ data, type }: Props) => {
	const { currentDownloads, removeDownload } = downloadsState()
	const currentDownload = data.assetId ? currentDownloads[data.assetId] : null
	const [showDownloadFolderDialog, setShowDownloadFolderDialog] = useState(false)

	const date = useMemo(() => {
		const dateTime = new Date(data.date)
		return `${dateTime.toLocaleDateString()} - ${dateTime.toLocaleTimeString()}`
	}, [data.date])

	const downloadOnClick = async () => {
		const directory = JSON.parse(localStorage.getItem(`${type}-download-directory`) || 'null')
		if (!data.assetId) {
			toast.error('It seems that the files for this release are not available.')
			return
		}

		removeDownload(data.assetId)

		if (!directory) {
			setShowDownloadFolderDialog(true)
			return
		}

		startDownload(directory)
	}

	const startDownload = (directory: string) => {
		window.yuzu.downloadRelease(data.assetId!, data.type, directory, data.versionTag)
	}

	const downloading = Boolean(currentDownload && !currentDownload.completed)
	const blockDownloadButton = downloading && !currentDownload?.error

	return (
		<>
			<motion.div
				className="w-full rounded-md bg-white/[.05] flex flex-col"
				initial={{ opacity: 0.5, y: '-20%' }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ ease: 'circOut' }}
			>
				<div className="flex justify-between items-center px-3 py-2 ">
					<div>
						<span className="text-zinc-400 text-sm block">{data.name}</span>
						<span className="text-zinc-500 text-xs ">{date}</span>
					</div>
					<div>
						<motion.div whileHover="hover">
							<Button
								isIconOnly
								size="sm"
								className={`bg-zinc-950/50 hover:bg-cyan-700 ${blockDownloadButton ? 'pointer-events-none' : ''}`}
								onClick={downloadOnClick}
								disabled={blockDownloadButton}
							>
								{blockDownloadButton ? (
									<Spinner size="sm" />
								) : (
									<motion.div
										animate={{ y: '0%' }}
										variants={{
											hover: {
												y: ['-25%', '0%'],
												transition: {
													repeatType: 'mirror',
													repeat: Infinity,
													duration: 0.3,
												},
											},
										}}
									>
										<Download size={14} className="text-zinc-300" />
									</motion.div>
								)}
							</Button>
						</motion.div>
					</div>
				</div>
				<AnimatePresence>
					{downloading && (
						<motion.div exit={{ scaleY: 0 }} transition={{ duration: 0.5 }}>
							<Progress
								aria-label="download-progress"
								value={(currentDownload?.progress || 0) * 100}
								className="rounded-none"
								color={currentDownload?.error ? 'danger' : 'primary'}
								classNames={{ base: 'h-1', track: 'rounded-t-none', indicator: 'rounded-t-none' }}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
			<DialogFolderInput
				open={showDownloadFolderDialog}
				onClose={(directory) => {
					setShowDownloadFolderDialog(false)
					if (directory) startDownload(directory)
				}}
				type={type}
			/>
		</>
	)
}

export default YuzuVersionItem
