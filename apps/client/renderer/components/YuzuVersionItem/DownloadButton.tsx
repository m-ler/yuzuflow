import { downloadsState } from '@/renderer/store/downloads'
import { Button, Spinner } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { YuzuType, YuzuVersion } from 'shared'
import DialogFolderInput from '../DialogFolderInput'
import { useState } from 'react'

type Props = {
	data: YuzuVersion
	type: YuzuType
}

const DownloadButton = ({ data, type }: Props) => {
	const { currentDownloads, removeDownload } = downloadsState()
	const currentDownload = data.assetId ? currentDownloads[data.assetId] : null
	const [showDownloadFolderDialog, setShowDownloadFolderDialog] = useState(false)

	const downloadOnClick = async () => {
		const directory = window.store.get(`${type}-download-directory`) || null
		if (!data.assetId) {
			toast.error('It seems that the files for this release are not available.')
			return
		}

		removeDownload(data.assetId)

		if (!directory) {
			setShowDownloadFolderDialog(true)
			return
		}

		startDownload()
	}

	const startDownload = () => {
		window.yuzu.downloadRelease(data)
	}

	const downloading = Boolean(currentDownload && !currentDownload.completed)
	const blockDownloadButton = downloading && !currentDownload?.error

	return (
		<>
			<motion.div whileHover="hover">
				<Button
					isIconOnly
					size="sm"
					className={`bg-zinc-950/50 hover:bg-black ${blockDownloadButton ? 'pointer-events-none' : ''}`}
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

			<DialogFolderInput
				open={showDownloadFolderDialog}
				onClose={(directory) => {
					setShowDownloadFolderDialog(false)
					if (directory) startDownload()
				}}
				type={type}
			/>
		</>
	)
}

export default DownloadButton
