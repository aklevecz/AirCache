import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  filter: string;
  applyFilter: (key: string) => void;
  dates: string[];
};

export default function FilterDate({ filter, applyFilter, dates }: Props) {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  const onApply = (filter: string) => {
    toggleOpen();
    applyFilter(filter);
  };

  function formatDateString(dateString: string): string {
    const monthNames: string[] = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date: Date = new Date(dateString);
    const day: number = date.getDate();
    const monthIndex: number = date.getMonth();
    const monthName: string = monthNames[monthIndex];

    return `${day} ${monthName}`;
  }

  const allDays = "All days";

  return (
    <div className="absolute right-[12px] top-[12px] w-[100px] z-10 cursor-pointer rounded-full bg-white text-black whitespace-nowrap">
      <div onClick={toggleOpen} className="relative z-20 px-4 py-2">
        {filter !== "" ? formatDateString(filter) : allDays}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            key="dates"
            className="z-10 absolute top-[44px] left-0 w-full bg-white rounded-md overflow-hidden"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            <div
              onClick={() => onApply("")}
              className={clsx(
                filter === "" ? "bg-primary" : "bg-white",
                "text-black p-2 cursor-pointer"
              )}
            >
              {allDays}
            </div>
            {dates
              .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
              .map((date) => (
                <div
                  onClick={() => onApply(date)}
                  className={clsx(
                    filter === date ? "bg-primary" : "bg-white",
                    "text-black p-2 cursor-pointer hover:bg-primary"
                  )}
                  key={date}
                >
                  {formatDateString(date)}
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
