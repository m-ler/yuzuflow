import PageTransition from '@/components/Transitions/PageTransition'
import VersionsTable from '@/components/VersionsTable/VersionsTable'
import useYuzuVersionsRequest from '@/hooks/useYuzuVersionsRequest'
import { Tabs, Tab } from '@nextui-org/react'
import { useState } from 'react'
import { YuzuType } from 'shared'
import RequestErrorState from './components/RequestErrorState'
import useStorageState from '@/hooks/useStorageState'

const Download = () => {
	const [selectedTab, setSelectedTab] = useStorageState<React.Key>('downloads-tab', 'mainline')
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
			<section className="w-full h-full max-h-full p-4  overflow-auto">
				<div className="flex flex-col gap-4 mx-auto w-full h-full max-w-screen-lg">
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
				</div>
			</section>
		</PageTransition>
	)
}

export default Download
