import clsx from "clsx";
import { motion } from "framer-motion";

export default function Button({ children, onClick, className, ...rest }: any) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className={clsx(
        "relative bg-primary text-black rounded-full px-4 py-2 whitespace-nowrap",
        className
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
