import Download from '@/renderer/routes/download/Download';
import Installed from '@/renderer/routes/installed/Installed';
import Root from '@/renderer/routes/Root';
import Settings from '@/renderer/routes/settings/Settings';
import { createHashRouter, RouterProvider } from 'react-router-dom';

const router = createHashRouter([
	{
		path: '/',
		element: <Root />,
		children: [
			{ index: true, element: <Download /> },
			{
				path: '/installed',
				element: <Installed />,
			},
			{
				path: '/settings',
				element: <Settings />,
			},
		],
	},
]);

const ReactRouterProvider = () => {
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
};

export default ReactRouterProvider;
