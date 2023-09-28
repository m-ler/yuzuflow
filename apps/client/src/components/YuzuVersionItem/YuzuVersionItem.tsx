import { Button, Progress, Spinner } from '@nextui-org/react'
import { YuzuVersion } from 'shared'
import { AnimatePresence, motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { useMemo } from 'react'
import { downloadsState } from '@/store/downloads'

type Props = {
	data: YuzuVersion
}

const YuzuVersionItem = ({ data }: Props) => {
	const currentDownload = data.assetId ? downloadsState().currentDownloads[data.assetId] : null

	const date = useMemo(() => {
		const dateTime = new Date(data.date)
		return `${dateTime.toLocaleDateString()} - ${dateTime.toLocaleTimeString()}`
	}, [data.date])

	const downloadOnClick = async () => {
		if (!data.assetId) {
			alert('Could not find release.')
			return
		}

		window.yuzu.downloadRelease(data.assetId, data.type)
	}

	const downloading = Boolean(currentDownload && !currentDownload.completed && !currentDownload.error)

	return (
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
							className={`bg-zinc-950/50 hover:bg-cyan-700 ${downloading ? 'pointer-events-none' : ''}`}
							onClick={downloadOnClick}
							disabled={downloading}
						>
							{downloading ? (
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
							classNames={{ base: 'h-1', track: 'rounded-t-none', indicator: 'rounded-t-none' }}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

export default YuzuVersionItem
