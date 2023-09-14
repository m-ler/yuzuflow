import { Tabs, Tab } from '@nextui-org/react';
import { useState } from 'react';
import TitleBar from './components/TitleBar';
import NavDrawer from './components/NavDrawer';

function App() {
	const [selectedTab, setSelectedTab] = useState<React.Key>('mainline');
	const setTab = (key: React.Key) => setSelectedTab(key);

	return (
		<div className="flex flex-col min-h-screen">
			<TitleBar />
			<div className="flex grow relative">
				<NavDrawer />
				<main className="flex flex-col w-full p-4 grow overflow-hidden">
					<section className="flex items-center justify-between gap-4">
						<Tabs color="primary" selectedKey={selectedTab} onSelectionChange={setTab} classNames={{ tabList: 'bg-zinc-800' }}>
							<Tab key="mainline" title="Mainline"></Tab>
							<Tab key="ea" title="Early Access"></Tab>
						</Tabs>
					</section>
				</main>
			</div>
		</div>
	);
}

export default App;
