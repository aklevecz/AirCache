import { useEffect, useMemo, useState } from "react";
import { currentDateNoHours, getTraitValue } from "../libs/utils";

export default function useDateFilter(caches: any) {
  const [filter, setFilter] = useState("");

  const applyFilter = (date: string) => {
    setFilter(date);
  };

  const dates = useMemo(() => {
    let dates = new Set<string>();
    if (caches.length) {
      for (const cache of caches) {
        const date = getTraitValue(cache.nft.attributes, "date");
        dates.add(date);
      }
    }
    return Array.from(dates);
  }, [caches]);

  useEffect(() => {
    const currentDate = currentDateNoHours();
    for (const date of dates) {
      const dateTime = new Date(date).getTime();
      if (currentDate === dateTime) {
        setFilter(date);
      }
    }
  }, [dates]);

  const filteredCaches = useMemo(() => {
    return caches.filter((cache: any) => {
      if (!filter) return true;
      const date = getTraitValue(cache.nft.attributes, "date");
      if (date === filter) {
        return true;
      }
      return false;
    });
  }, [filter]);

  return { filteredCaches, dates, filter, applyFilter };
}
