import PageTransition from '@/components/Transitions/PageTransition'
import SkeletonList from '@/components/YuzuVersionItem/SkeletonList'
import YuzuVersionItem from '@/components/YuzuVersionItem/YuzuVersionItem'
import useYuzuVersionsRequest from '@/hooks/useYuzuVersionsRequest'
import { Tabs, Tab, Pagination } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'
import { useState } from 'react'

const Download = () => {
	const [selectedTab, setSelectedTab] = useState<React.Key>('mainline')
	const [page, setPage] = useState(1)
	const setTab = (key: React.Key) => setSelectedTab(key)
	const request = useYuzuVersionsRequest({ type: 'mainline', page })

	return (
		<PageTransition>
			<div
				className={`fixed inset-0 bg-cover pointer-events-none ${
					selectedTab === 'ea' ? 'hue-rotate-[70deg] opacity-40' : 'opacity-30'
				} duration-500`}
				style={{ backgroundImage: 'url(/app/img/background-gradient.png)' }}
			></div>
			<section className="flex flex-col gap-4 mx-auto max-w-screen-lg h-full max-h-full p-4 overflow-auto">
				<Tabs
					color="primary"
					selectedKey={selectedTab}
					onSelectionChange={setTab}
					classNames={{ tabList: 'bg-zinc-800' }}
				>
					<Tab key="mainline" title="Mainline"></Tab>
					<Tab key="ea" title="Early Access"></Tab>
				</Tabs>
				<motion.div
					className="flex flex-col gap-2 grow"
					animate={{
						transition: {
							delayChildren: 0.3,
							staggerChildren: 0.2,
						},
					}}
				>
					{request.error ? (
						<div className="w-full px-2 py-5 flex flex-col items-center my-auto">
							<XCircle className="text-rose-500" />
							<h6 className="text-center text-zinc-300 text-md mt-2">Something when wrong</h6>
							<p className="text-zinc-500 text-sm text-center  leading-4">
								There was an error while retrieving the data from the server. <br /> Please try again later.
							</p>
						</div>
					) : request.isFetching ? (
						<SkeletonList length={10} />
					) : (
						request.data?.data.map((x) => <YuzuVersionItem data={x} key={x.name} />)
					)}
				</motion.div>
				{request.data?.pageCount && (
					<Pagination
						total={request.data?.pageCount || 0}
						page={page}
						siblings={0}
						onChange={setPage}
						showControls
						className="ml-auto mt-auto overflow-visible"
					/>
				)}
			</section>
		</PageTransition>
	)
}

export default Download
