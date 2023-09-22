import SkeletonList from '@/components/YuzuVersionItem/SkeletonList'
import YuzuVersionItem from '@/components/YuzuVersionItem/YuzuVersionItem'
import { Pagination } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { YuzuVersion } from '@shared'

type Props = {
	data: YuzuVersion[]
	loading: boolean
	page: number
	pageCount: number
	onPageChange: (page: number) => void
}

const VersionsTable = ({ data, loading, page, onPageChange, pageCount }: Props) => {
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
				{loading ? <SkeletonList length={8} /> : (data || []).map((x) => <YuzuVersionItem data={x} key={x.name} />)}
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
