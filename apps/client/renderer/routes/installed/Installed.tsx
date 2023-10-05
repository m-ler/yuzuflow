import PageTransition from '@/renderer/components/Transitions/PageTransition'
import VersionsTable from '@/renderer/components/VersionsTable'
import { Tabs, Tab } from '@nextui-org/react'
import { useMemo, useState } from 'react'
import { YuzuType } from 'shared'
import useStorageState from '@/renderer/hooks/useStorageState'
import bgGradient from '@/public/app/img/background-gradient.png?asset'
import { installedVersionsState } from '@/renderer/store/installed-versions'
import { TABLE_PAGINATION_SIZE } from '@/renderer/config/constants'

const Installed = () => {
	const [selectedTab, setSelectedTab] = useStorageState<React.Key>('installed-tab', 'mainline')
	const setTab = (key: React.Key) => setSelectedTab(key)
	const [page, setPage] = useState(1)
	const installedVersions = installedVersionsState()[selectedTab as YuzuType]
	const pageData = useMemo(
		() => installedVersions.slice((page - 1) * TABLE_PAGINATION_SIZE, TABLE_PAGINATION_SIZE * page),
		[page, installedVersions]
	)

	return (
		<PageTransition>
			<div
				className={`fixed inset-0 bg-cover pointer-events-none ${
					selectedTab === 'ea' ? 'hue-rotate-[70deg] opacity-40' : 'opacity-30'
				} duration-500`}
				style={{ backgroundImage: `url(${bgGradient})` }}
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

					<VersionsTable
						loading={false}
						page={page}
						pageCount={Math.ceil(installedVersions.length / TABLE_PAGINATION_SIZE)}
						onPageChange={(page) => setPage(page)}
						data={pageData || []}
						itemType="install"
					/>
				</div>
			</section>
		</PageTransition>
	)
}

export default Installed
