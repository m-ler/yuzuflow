import { XCircle } from 'lucide-react'

const RequestErrorState = () => {
	return (
		<div className="w-full px-2 py-5 flex flex-col items-center my-auto">
			<XCircle className="text-rose-500" />
			<h6 className="text-center text-zinc-300 text-md mt-2">Something when wrong</h6>
			<p className="text-zinc-500 text-sm text-center  leading-4">
				There was an error while retrieving the data from the server. <br /> Please try again later.
			</p>
		</div>
	)
}

export default RequestErrorState
