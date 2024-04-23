import React, { forwardRef, useMemo } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type PageTransitionProps = HTMLMotionProps<'div'>;
type PageTransitionRef = React.ForwardedRef<HTMLDivElement>;

function PageTransition(
	{ children, ...rest }: PageTransitionProps,
	ref: PageTransitionRef
) {
	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0.1 }}
			layout
			animate={{ opacity: 1 }}
			transition={{
				opacity: { ease: 'linear' },
				layout: { duration: 0.4 },
			}}
			{...rest}
		>
			{children}
		</motion.div>
	);
}

export default forwardRef(PageTransition);
