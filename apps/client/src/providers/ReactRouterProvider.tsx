import Download from '@/routes/download/Download';
import Installed from '@/routes/installed/Installed';
import Root from '@/routes/Root';
import Settings from '@/routes/settings/Settings';
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
