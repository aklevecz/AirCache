import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInOutY, parentVariants } from "../../motion/variants";
import Close from "../Icons/Close";

type Props = {
  children: JSX.Element | JSX.Element[];
  open: boolean;
  toggleModal: () => void;
  center?: boolean;
};

export default function Container({
  children,
  open,
  toggleModal,
  center = false,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal"
          variants={parentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={clsx(
            center ? "fixed" : "absolute",
            "w-full h-full top-0 flex justify-center items-center backdrop-blur-lg z-[9999] will-change-transform"
          )}
        >
          <motion.div
            variants={fadeInOutY}
            initial="initial"
            animate="animate"
            exit="exit"
            className="z-10 p-10 max-w-lg rounded-3xl bg-white text-black bg-ring-current w-11/12 will-change-transform relative"
            // initial={{ opacity: 0 }}
            // animate={{ opacity: 1 }}
            // exit={{ opacity: 0 }}
            // className="p-6 pb-10 z-10 max-w-lg rounded-3xl bg-tail bg-ring-current w-11/12"
            // style={{ zIndex: 9999999, position: "relative", background: "rgb(56 56 56 / 80%)", backdropFilter: "blur(10px)" }}
          >
            {children}
            <div
              onClick={toggleModal}
              className="absolute top-3 right-5 w-7 h-7 flex items-center justify-center rounded-full border-[1px] border-black text-black cursor-pointer"
            >
              <Close />
            </div>
          </motion.div>

          <div
            onClick={toggleModal}
            className="absolute w-full h-full top-0 bg-black z-0 opacity-30 "
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
