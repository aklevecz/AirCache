import clsx from "clsx";
import { AnimatePresence, motion, useAnimate, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  filter: string;
  applyFilter: (key: string) => void;
  dates: string[];
};

export default function FilterDate({ filter, applyFilter, dates }: Props) {
  const controls = useAnimationControls();
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  useEffect(() => {
    if (open) {
      console.log("gooo");
      controls.start({ x: -102 });
    } else {
      controls.start({ x: 100 });
    }
  }, [open]);

  const onApply = (filter: string) => {
    toggleOpen();
    applyFilter(filter);
  };

  return (
    <>
      <div className="absolute flex flex-col gap-2 right-2 top-20 z-10 w-[95px]">
        <div onClick={toggleOpen} className="bg-white text-black p-2 cursor-pointer ">
          {filter || "All"}
        </div>
      </div>
      <motion.div className="absolute z-10 right-2 top-20" initial={{ x: 100 }} exit={{ x: 100 }} animate={controls}>
        <div onClick={() => onApply("")} className={clsx(filter === "" ? "bg-red-500" : "bg-white", "text-black p-2 cursor-pointer")}>
          All
        </div>
        {dates
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
          .map((date) => (
            <div
              onClick={() => onApply(date)}
              className={clsx(filter === date ? "bg-red-500" : "bg-white", "text-black p-2 cursor-pointer")}
              key={date}
            >
              {date}
            </div>
          ))}
      </motion.div>
    </>
  );
}
