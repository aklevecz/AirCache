import clsx from "clsx";
import { motion } from "framer-motion";

export default function Button({ children, onClick, className, ...rest }: any) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className={clsx(
        "relative bg-black text-white rounded-full px-4 py-2 whitespace-nowrap text-sm",
        className
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
