import SkeletonList from '@/renderer/components/YuzuVersionItem/SkeletonList'
import YuzuVersionItem from '@/renderer/components/YuzuVersionItem/YuzuVersionItem'
import { Pagination } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { YuzuVersion } from 'shared'
import InstalledYuzuVersionItem from '../YuzuVersionItem/InstalledYuzuVersionItem'

type Props = {
	data: YuzuVersion[]
	loading: boolean
	page: number
	pageCount: number
	onPageChange: (page: number) => void
	itemType: 'download' | 'install'
}

const VersionsTable = ({ data, loading, page, onPageChange, pageCount, itemType }: Props) => {
	return (
		<div className="flex flex-col justify-end gap-4">
			<motion.div
				className="flex flex-col gap-2 grow"
				animate={{
					transition: {
						delayChildren: 0.3,
						staggerChildren: 0.2,
					},
				}}
			>
				{loading ? (
					<SkeletonList length={8} />
				) : (
					(data || []).map((x) =>
						itemType === 'install' ? (
							<InstalledYuzuVersionItem data={x} key={x.name} />
						) : (
							<YuzuVersionItem data={x} key={x.name} />
						)
					)
				)}
			</motion.div>
			{pageCount && (
				<Pagination
					total={pageCount}
					page={page}
					siblings={0}
					onChange={onPageChange}
					showControls
					className="ml-auto mt-auto overflow-visible"
				/>
			)}
		</div>
	)
}

export default VersionsTable
