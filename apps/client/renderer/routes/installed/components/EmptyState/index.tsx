import { motion } from 'framer-motion'
import Illustration from './Illustration'

const EmptyState = () => {
	return (
		<motion.div
			className="flex flex-col items-center px-4 py-8"
			initial={{ y: '20%', opacity: 0.6 }}
			animate={{ y: '0', opacity: 1 }}
		>
			<Illustration width={72} className="text-zinc-600" />
			<h4 className="text-zinc-500 font-semibold text-sm mt-2">No installations found.</h4>
		</motion.div>
	)
}

export default EmptyState
