import { Button } from '@nextui-org/react'
import { YuzuVersion } from '@shared'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'

type Props = {
	data: YuzuVersion
}

const YuzuVersionItem = ({ data }: Props) => {
	return (
		<motion.div
			className="w-full rounded-md bg-white/[.05] px-3 py-2 flex justify-between items-center"
			initial={{ opacity: 0.5, y: '-20%' }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ ease: 'circOut' }}
		>
			<span className="text-zinc-400 text-sm">{data.name}</span>
			<div>
				<motion.div whileHover="hover">
					<Button isIconOnly size="sm" className="bg-zinc-950/50 hover:bg-cyan-700">
						<motion.div
							animate={{ y: '0%' }}
							variants={{
								hover: {
									y: ['-25%', '0%'],
									transition: {
										repeatType: 'mirror',
										repeat: Infinity,
										duration: 0.3,
									},
								},
							}}
						>
							<Download size={14} className='text-zinc-300'/>
						</motion.div>
					</Button>
				</motion.div>
			</div>
		</motion.div>
	)
}

export default YuzuVersionItem
