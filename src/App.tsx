import { motion } from 'framer-motion';

function App() {
	return (
		<main className="flex flex-col justify-center items-center w-full h-screen gap-4">
			<h1 className="text-center text-5xl font-semibold text-cyan-500">
				Yuzu
				<span className="text-red-500">Flow</span>
			</h1>
			<motion.div
				className="w-[20px] h-[20px] bg-red-500 rounded-full"
				variants={{
					initial: {
						x: '100%',
					},
					bounce: {
						x: ['-100%', '100%'],
						transition: {
							when: '',
							x: {
								duration: 1,
								ease: 'easeInOut',
								repeat: Infinity,
								repeatType: 'mirror',
							},
						},
					},
				}}
				animate="bounce"
			/>
			<motion.div
				className="w-[20px] h-[20px] bg-cyan-500 rounded-full"
				variants={{
					initial: {
						y: '100%',
					},
					bounce: {
						y: ['-100%', '100%'],
						transition: {
							when: '',
							y: {
								duration: 1,
								ease: 'easeInOut',
								repeat: Infinity,
								repeatType: 'mirror',
							},
						},
					},
				}}
				animate="bounce"
			/>
		</main>
	);
}

export default App;
