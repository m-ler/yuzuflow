import { Tabs, Tab, Button, Image } from '@nextui-org/react';
import { ArrowBigDownDash, Calendar, Clock1, Folder } from 'lucide-react';
import { useState } from 'react';
import TitleBar from './components/TitleBar';

function App() {
	const [selectedTab, setSelectedTab] = useState<React.Key>('mainline');
	const setTab = (key: React.Key) => setSelectedTab(key);
	console.log(window);

	return (
		<>
			<TitleBar />
			<main className="flex flex-col w-full p-4">
				<section className="flex items-center justify-between gap-4">
					<Tabs color="primary" selectedKey={selectedTab} onSelectionChange={setTab} classNames={{ tabList: 'bg-slate-800 p-1.5' }}>
						<Tab key="mainline" title="Mainline"></Tab>
						<Tab key="ea" title="Early Access"></Tab>
					</Tabs>
					<div className="max-w-screen-md grow bg-slate-800  rounded-xl flex items-center justify-between cursor-pointer overflow-hidden">
						<span className="px-4 text-slate-500 text-sm text-sm whitespace-nowrap text-ellipsis overflow-hidden">
							Select download directory
						</span>
						<Button isIconOnly className="rounded-tl-none rounded-bl-none">
							<Folder size={14} />
						</Button>
					</div>
				</section>
				<div className="flex flex-row items-center w-full p-4 mt-4 bg-black/20 shadow-none rounded-xl">
					<Image
						alt="nextui logo"
						height={32}
						radius="sm"
						src="https://www.saashub.com/images/app/service_logos/29/8cca87f6ae82/large.png?1549849214"
						width={32}
					/>
					<div className="ml-4">
						<h6 className="text-lg font-semibold text-sky-100">Latest 1555</h6>
						<div className="flex gap-2">
							<span className="text-xs text-slate-500 flex items-center gap-1">
								<Calendar size={13} className="inline" />
								9/11/2023
							</span>
							<span className="text-xs text-slate-500 flex items-center gap-1">
								<Clock1 size={13} className="inline" />
								14:34
							</span>
						</div>
					</div>
					<Button className="ml-auto" color="primary" startContent={<ArrowBigDownDash />}>
						Download
					</Button>
				</div>
			</main>
		</>
	);
}

export default App;
