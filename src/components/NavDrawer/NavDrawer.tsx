import { DownloadCloud, MonitorDown, Settings } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { navDrawerState } from '@/store/nav-drawer';
import NavButton from './NavButton';

const NavDrawer = () => {
	const smallScreen = useMediaQuery('(max-width: 640px)');
	const { open, setOpen } = navDrawerState();
	useEffect(() => {
		setOpen(!smallScreen);
	}, [smallScreen]);

	const content = useMemo(
		() => (
			<nav className="flex flex-col bg-zinc-950 border-r border-r-zinc-900 grow py-4 w-full h-full">
				<ul className="flex flex-col">
					<li>
						<NavButton route="/" startContent={<DownloadCloud size={14} />}>
							Download
						</NavButton>
					</li>
					<li>
						<NavButton route="/installed" startContent={<MonitorDown size={14} />}>
							Installed
						</NavButton>
					</li>
					<li>
						<NavButton route="/settings" startContent={<Settings size={14} />}>
							Settings
						</NavButton>
					</li>
				</ul>
				<span className="block mt-auto text-zinc-500 text-center text-xs">YuzuFlow 1.0</span>
			</nav>
		),
		[]
	);

	return smallScreen ? (
		<AnimatePresence>
			{open && (
				<div className="absolute inset-0 z-10 ">
					<motion.div
						onClick={() => setOpen(false)}
						className="absolute inset-0 bg-black/50 z-[-1] backdrop-blur-md"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					></motion.div>
					<motion.div
						className="h-full min-w-[180px] max-w-[180px]"
						initial={{ x: '-50%', opacity: 0.8 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: '-100%', opacity: 0.8 }}
						transition={{ ease: 'circOut' }}
					>
						{content}
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	) : (
		open && <div className="min-w-[180px] max-w-[180px] grow">{content}</div>
	);
};

export default NavDrawer;
