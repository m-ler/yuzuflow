import { NextUIProvider as Provider } from '@nextui-org/react';
import { PropsWithChildren } from 'react';

const NextUIProvider = ({ children }: PropsWithChildren) => {
	return <Provider>{children}</Provider>;
};

export default NextUIProvider;
