import React, { forwardRef, useMemo } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type PageTransitionProps = HTMLMotionProps<"div">;
type PageTransitionRef = React.ForwardedRef<HTMLDivElement>;

function PageTransition(
  { children, ...rest }: PageTransitionProps,
  ref: PageTransitionRef
) {
  const collapsed = { scale: 0 };
  const expanded = { scale: 1 };

  const transition = { duration: 0.7, ease: "easeInOut" };

  return (
    <motion.div
      ref={ref}
      initial={collapsed}
      animate={expanded}
      exit={collapsed}
      transition={transition}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export default forwardRef(PageTransition);
