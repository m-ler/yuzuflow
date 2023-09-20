import PageTransition from '@/components/Transitions/PageTransition'
import useYuzuVersionsRequest from '@/hooks/useYuzuVersionsRequest'
import { Tabs, Tab, Skeleton, Pagination } from '@nextui-org/react'
import { useState } from 'react'

const Download = () => {
	const [selectedTab, setSelectedTab] = useState<React.Key>('mainline')
	const [page, setPage] = useState(1)
	const setTab = (key: React.Key) => setSelectedTab(key)
	const request = useYuzuVersionsRequest({ type: 'mainline', page })

	return (
		<PageTransition>
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
				<div className="flex flex-col gap-2">
					{[...Array(10).fill(null)].map((x, i) => (
						<Skeleton className="w-full rounded-md" key={i}>
							<div className="h-10 w-3/5 rounded-lg bg-default-200"></div>
						</Skeleton>
					))}
				</div>
				{request.data?.pageCount && (
					<Pagination
						total={request.data?.pageCount || 0}
						page={page}
						onChange={setPage}
						className="ml-auto mt-auto overflow-visible"
					/>
				)}
			</section>
		</PageTransition>
	)
}

export default Download
