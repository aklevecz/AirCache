import clsx from "clsx";
import { m, motion, AnimatePresence } from "framer-motion";
import { fadeInOutY } from "../../motion/variants";

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
            className="z-10 p-10 max-w-lg rounded-3xl bg-white text-black bg-ring-current w-11/12 will-change-transform"
            style={{
              background: "rgb(56 56 56 / 80%)",
              backdropFilter: "blur(10px)",
            }}
          >
            {children}
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

const parentVariants = {
  initial: {
    opacity: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      delay: 0.5,
    },
  },
};
