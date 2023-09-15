import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';

const PageTransition = ({ children }: PropsWithChildren) => {
	return (
		<motion.div
			initial={{ y: '-25%', opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ ease: 'circOut', duration: 0.2 }}
			className="w-full h-full overflow-hidden"
		>
			{children}
		</motion.div>
	);
};

export default PageTransition;
