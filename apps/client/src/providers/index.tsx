import { PropsWithChildren } from 'react';
import NextUIProvider from './NextUIProvider';
import ReactRouterProvider from './ReactRouterProvider';
import ReactQueryProvider from './ReactQueryProvider';

const Providers = ({ children }: PropsWithChildren) => {
	return (
		<NextUIProvider>
			<ReactQueryProvider>
				<ReactRouterProvider />
				{children}
			</ReactQueryProvider>
		</NextUIProvider>
	);
};

export default Providers;
