import { motion } from "framer-motion";
import Axe from "../Icons/Axe";

export default function AxeAnimation() {
  return (
    <motion.div
      animate={{ rotate: [-50, 90] }}
      transition={{
        repeat: Infinity,
        duration: 1,
        repeatType: "reverse",
      }}
      className="w-20 m-auto my-10"
    >
      <Axe />
    </motion.div>
  );
}
