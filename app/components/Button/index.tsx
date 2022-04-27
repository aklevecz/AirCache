import clsx from "clsx";
import { motion } from "framer-motion";

export default function Button({ children, onClick, className, ...rest }: any) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className={clsx("bg-white text-black rounded-full px-3 py-2", className)}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
