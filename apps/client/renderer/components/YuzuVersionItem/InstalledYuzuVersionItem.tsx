import { YuzuVersion } from 'shared'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import OpenFolderButton from './OpenFolderButton'
import PlayButton from './PlayButton'
import RemoveVersionButton from './RemoveVersionButton'

type Props = {
	data: YuzuVersion
}

const InstalledYuzuVersionItem = ({ data }: Props) => {
	const date = useMemo(() => {
		const dateTime = new Date(data.date)
		return `${dateTime.toLocaleDateString()} - ${dateTime.toLocaleTimeString()}`
	}, [data.date])

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
						<div className="flex items-center gap-2">
							<RemoveVersionButton data={data} />
							<OpenFolderButton data={data} />
							<PlayButton data={data} />
						</div>
					</div>
				</div>
			</motion.div>
		</>
	)
}

export default InstalledYuzuVersionItem
