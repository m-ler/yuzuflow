import NavDrawer from '@/components/NavDrawer';
import TitleBar from '@/components/TitleBar';
import { Outlet } from 'react-router-dom';

const Root = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<TitleBar />
			<div className="flex grow relative">
				<NavDrawer />
				<main className="flex flex-col w-full p-4 grow overflow-hidden">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default Root;
