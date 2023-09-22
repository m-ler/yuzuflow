import PageTransition from '@/components/Transitions/PageTransition'
import VersionsTable from '@/components/VersionsTable/VersionsTable'
import useYuzuVersionsRequest from '@/hooks/useYuzuVersionsRequest'
import { Tabs, Tab } from '@nextui-org/react'
import { useState } from 'react'
import { YuzuType } from '@shared'
import RequestErrorState from './components/RequestErrorState'

const Download = () => {
	const [selectedTab, setSelectedTab] = useState<React.Key>('mainline')
	const setTab = (key: React.Key) => setSelectedTab(key)
	const [page, setPage] = useState(1)

	const request = useYuzuVersionsRequest({ type: selectedTab as YuzuType, page })

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
						loading={request.isFetching}
						page={page}
						pageCount={request.data?.pageCount || 0}
						onPageChange={(page) => setPage(page)}
						data={request.data?.data || []}
					/>
				)}
			</section>
		</PageTransition>
	)
}

export default Download
