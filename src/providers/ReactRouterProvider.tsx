import Root from '@/routes/Root';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
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
