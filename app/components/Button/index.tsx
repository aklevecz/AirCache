import clsx from "clsx";
import { motion } from "framer-motion";

export default function Button({ children, onClick, className, ...rest }: any) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className={clsx(
        "button relative bg-yellow-400 text-black rounded-full px-4 py-2 whitespace-nowrap border-4 border-solid border-yellow-400 hover:border-white active:border-white transition",
        className
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
