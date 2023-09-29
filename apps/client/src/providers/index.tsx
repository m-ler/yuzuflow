import { PropsWithChildren } from 'react'
import NextUIProvider from './NextUIProvider'
import ReactRouterProvider from './ReactRouterProvider'
import ReactQueryProvider from './ReactQueryProvider'
import ReactHotToastProvider from './ReactHotToastProvider'

const Providers = ({ children }: PropsWithChildren) => {
	return (
		<NextUIProvider>
			<ReactQueryProvider>
				<ReactRouterProvider />
				<ReactHotToastProvider />
				{children}
			</ReactQueryProvider>
		</NextUIProvider>
	)
}

export default Providers
