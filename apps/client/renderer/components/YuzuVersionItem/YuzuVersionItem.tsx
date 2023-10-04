import { Progress } from '@nextui-org/react'
import { YuzuType, YuzuVersion } from 'shared'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'
import { downloadsState } from '@/renderer/store/downloads'
import { installedVersionTagsState } from '@/renderer/store/installed-version-tags'
import DownloadButton from './DownloadButton'
import { Check } from 'lucide-react'
import OpenFolderButton from './OpenFolderButton'

type Props = {
	data: YuzuVersion
	type: YuzuType
}

const YuzuVersionItem = ({ data, type }: Props) => {
	const { currentDownloads } = downloadsState()
	const installedVersions = installedVersionTagsState()[type]
	const currentDownload = data.assetId ? currentDownloads[data.assetId] : null
	const installed = useMemo(() => installedVersions.includes(data.versionTag), [installedVersions])

	const date = useMemo(() => {
		const dateTime = new Date(data.date)
		return `${dateTime.toLocaleDateString()} - ${dateTime.toLocaleTimeString()}`
	}, [data.date])

	const downloading = Boolean(currentDownload && !currentDownload.completed)

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
						<span className="text-zinc-400 text-sm block flex items-center gap-1">
							{data.name}
							{installed && <Check size={14} className="text-green-500" />}
						</span>
						<span className="text-zinc-500 text-xs ">{date}</span>
					</div>
					<div>
						{installed ? (
							<OpenFolderButton type={type} versionTag={data.versionTag} />
						) : (
							<DownloadButton data={data} type={type} />
						)}
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
		</>
	)
}

export default YuzuVersionItem
