import clsx from "clsx";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import { colors } from "../../libs/constants";
import DateIcon from "../Icons/Date";

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
      controls.start({ opacity: 1 });
    } else {
      controls.start({ opacity: 0 });
    }
  }, [open]);

  const onApply = (filter: string) => {
    toggleOpen();
    applyFilter(filter);
  };

  return (
    <>
      <div className="absolute flex flex-col gap-2 right-2 top-[120px] z-10" style={{ maxWidth: 150 }}>
        <motion.div layout onClick={toggleOpen} className="bg-white rounded- text-black p-2 cursor-pointer">
          {!open ? (
            <div className="flex gap-2 px-1 items-center justify-between">
              <div style={{ color: colors.lavender }} className={`font-bold text-[${colors.red}]`}>
                {filter.replace("/2023", "") || "4/11 - 4/15"}
              </div>{" "}
              <div className="h-6">
                <DateIcon />
              </div>
            </div>
          ) : (
            "Pick a date!"
          )}
        </motion.div>
      </div>
      <motion.div className="absolute z-[19] right-2 top-[170px]" initial={{ opacity: 0 }} exit={{ opacity: 0 }} animate={controls}>
        <div onClick={() => onApply("")} className={clsx(filter === "" ? `bg-lavender` : "bg-white", "text-black p-2 cursor-pointer")}>
          4/11 - 4/15
        </div>
        {dates
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
          .filter((d) => d)
          .map((date) => (
            <div
              onClick={() => onApply(date)}
              className={clsx(filter === date ? `bg-lavender` : "bg-white", "text-black p-2 cursor-pointer")}
              key={date}
            >
              {date.replace("/2023", "")}
            </div>
          ))}
      </motion.div>
    </>
  );
}
