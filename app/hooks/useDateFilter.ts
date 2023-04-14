import { useEffect, useMemo, useState } from "react";
import { currentDateNoHours, getTraitValue } from "../libs/utils";

export default function useDateFilter(caches: any) {
  const [filter, setFilter] = useState("");

  const applyFilter = (date: string) => {
    setFilter(date);
  };

  const dates = useMemo(() => {
    let dates = new Set<string>();
    if (caches && caches.length) {
      for (const cache of caches) {
        if (cache.nft && cache.nft.attributes) {
          const date = getTraitValue(cache.nft.attributes, "date");
          dates.add(date);
        }
      }
    }
    return Array.from(dates);
  }, [caches]);

  useEffect(() => {
    const currentDate = currentDateNoHours();
    for (const date of dates) {
      const dateTime = new Date(date).getTime() - 1000 * 60 * 60 * 8;
      if (currentDate === dateTime) {
        setFilter(date);
      }
    }
  }, [dates]);

  const filteredCaches = useMemo(() => {
    if (!caches) {
      return true;
    }
    return caches.filter((cache: any) => {
      if (!filter) {
        return true;
      }
      if (cache.nft && !cache.nft.attributes) {
        return true;
      }
      const date = getTraitValue(cache.nft.attributes, "date");

      // no date is for the park beans
      if (date === filter || date === "") {
        return true;
      }
      return false;
    });
  }, [filter]);

  return { filteredCaches, dates, filter, applyFilter };
}
