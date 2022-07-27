import useSWR from "swr";
import { endpoints, getCachesByGroup } from "../libs/api";

export default function useCachesByGroup(name: string) {
  const { data, error, mutate } = useSWR(endpoints.getCachesByGroup, () =>
    getCachesByGroup(name)
  );
  return { data, error, mutate };
}
