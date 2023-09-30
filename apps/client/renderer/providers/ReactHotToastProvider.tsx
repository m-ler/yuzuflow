import { XCircle } from 'lucide-react'
import toast, { ToastBar, Toaster } from 'react-hot-toast'

const ReactHotToastProvider = () => {
	return (
		<Toaster
			position="bottom-center"
			toastOptions={{
				className: '!bg-zinc-900 !border !border-zinc-800 !text-zinc-200 !text-sm',
			}}
		>
			{(t) => (
				<ToastBar toast={t}>
					{({ icon, message }) => (
						<>
							{icon}
							{message}
							{t.type !== 'loading' && (
								<button onClick={() => toast.dismiss(t.id)} className='p-2 [&>svg]:hover:text-zinc-200'>
									<XCircle size={16} className='text-zinc-500'/>
								</button>
							)}
						</>
					)}
				</ToastBar>
			)}
		</Toaster>
	)
}

export default ReactHotToastProvider
