import clsx from "clsx";
import { motion } from "framer-motion";

export default function Button({
  children,
  onClick,
  className,
  variant = "primary",
  ...rest
}: any) {
  return (
    <motion.button
      onClick={onClick}
      className={clsx(
        variant === "primary" && "bg-primary text-black",
        variant === "secondary" && "bg-black text-white",
        variant === "maps-locate" &&
          "bg-white fill-gray-600 flex flex-col items-end",
        "relative rounded-full px-4 py-2 whitespace-nowrap",
        className
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
