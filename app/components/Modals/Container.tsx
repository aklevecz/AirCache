import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  children: JSX.Element | JSX.Element[];
  open: boolean;
  toggleModal: () => void;
};

export default function Container({ children, open, toggleModal }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <div
          className={clsx(
            "absolute w-full h-full top-0 flex justify-center items-center"
          )}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-10 pb-10 z-10 max-w-lg rounded-3xl bg-tail bg-ring-current w-11/12"
            style={{ zIndex: 9999999, background: "#3b82f680" }}
          >
            {children}
          </motion.div>
          <div
            onClick={toggleModal}
            className="absolute w-full h-full top-0 bg-black z-0 opacity-30"
          />
        </div>
      )}
    </AnimatePresence>
  );
}
