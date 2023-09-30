import NavDrawer from '@/renderer/components/NavDrawer';
import TitleBar from '@/renderer/components/TitleBar';
import { Outlet } from 'react-router-dom';

const Root = () => {
	return (
		<div className="flex flex-col min-h-screen max-h-screen overflow-hidden">
			<TitleBar />
			<div className="flex grow relative min-h-0">
				<NavDrawer />
				<main className="flex flex-col w-full grow overflow-hidden">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default Root;
