import { Maximize2, Menu, Minimize2, Minus, X } from 'lucide-react';
import Button from './Button';
import { useEffect, useState } from 'react';
import { navDrawerState } from '@/store/nav-drawer';

const TitleBar = () => {
	const [maximized, setMaximized] = useState(false);
	const { toggle: toggleNavigationDrawer } = navDrawerState();

	useEffect(() => {
		window.appWindow.isMaximized().then(result => setMaximized(result));
	}, []);

	const maximizeOnClick = () => {
		window.appWindow.maximize().then(result => setMaximized(result));
	};

	useEffect(() => {}, []);

	return (
		<div id="title-bar" className="w-screen flex items-center bg-zinc-950 border-b border-b-zinc-900 h-[36px]">
			<Button isIconOnly className="w-auto px-4" onClick={toggleNavigationDrawer}>
				<Menu size={16} />
			</Button>
			<div className="flex ml-auto h-full max-h-full">
				<Button onClick={window.appWindow.minimize}>
					<Minus size={14} className="text-white/60" />
				</Button>
				<Button onClick={maximizeOnClick}>
					{maximized ? <Minimize2 size={14} className="text-white/60" /> : <Maximize2 size={12} className="text-white/60" />}
				</Button>
				<Button onClick={window.appWindow.quit} className="hover:bg-red-800 text-white/60">
					<X size={14} />
				</Button>
			</div>
		</div>
	);
};

export default TitleBar;
