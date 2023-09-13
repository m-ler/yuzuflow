import { Maximize2, Minimize2, Minus, X } from 'lucide-react';
import Button from './Button';
import { useEffect, useState } from 'react';

const TitleBar = () => {
	const [maximized, setMaximized] = useState(false);
	console.log(window.appWindow.isMaximized());

	useEffect(() => {
		window.appWindow.isMaximized().then(result => setMaximized(result));
	}, []);

	const maximizeOnClick = () => {
		window.appWindow.maximize().then(result => setMaximized(result));
	};

	useEffect(() => {}, []);

	return (
		<div id="title-bar" className="w-screen flex bg-slate-900 border-b border-b-slate-800 h-[36px]">
			<div className="flex ml-auto">
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
