import { DownloadCloud, MonitorDown, Settings } from 'lucide-react';
import NavButton from './NavButton';

const NavDrawer = () => {
	return (
		<nav className="flex flex-col border-r border-r-zinc-900 grow py-4 min-w-[180px]">
			<ul className="flex flex-col">
				<li>
					<NavButton startContent={<DownloadCloud size={14} />}>Download</NavButton>
				</li>
				<li>
					<NavButton startContent={<MonitorDown size={14} />}>Installed</NavButton>
				</li>
				<li>
					<NavButton startContent={<Settings size={14} />}>Settings</NavButton>
				</li>
			</ul>
			<span className="block mt-auto text-zinc-500 text-center text-xs">YuzuFlow 1.0</span>
		</nav>
	);
};

export default NavDrawer;
