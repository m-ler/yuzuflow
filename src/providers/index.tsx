import { PropsWithChildren } from 'react';
import NextUIProvider from './NextUIProvider';
import ReactRouterProvider from './ReactRouterProvider';

const Providers = ({ children }: PropsWithChildren) => {
	return (
		<NextUIProvider>
			<ReactRouterProvider />
			{children}
		</NextUIProvider>
	);
};

export default Providers;
