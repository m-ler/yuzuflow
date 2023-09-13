import { PropsWithChildren } from 'react';
import NextUIProvider from './NextUIProvider';

const Providers = ({ children }: PropsWithChildren) => {
	return <NextUIProvider>{children}</NextUIProvider>;
};

export default Providers;
