import { motion } from "framer-motion";
import { fadeInOut } from "../../motion/variants";

export default function BouncyEgg({ size, className }: any) {
  return (
    <motion.img
      variants={fadeInOut}
      initial="initial"
      animate="animate"
      exit="exit"
      src="/egg.png"
      className={className}
      style={{
        width: size ? size : "var(--egg-width)",
        height: size ? size * 1.4 : "var(--egg-height)",
        animation: "bouncy-egg 1s ease-in infinite",
      }}
    />
  );
}
