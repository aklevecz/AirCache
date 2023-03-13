import useSWR from "swr";
import { fetchHuntMeta } from "../libs/api";

const fetcher = async (groupName: string) => {
  const meta = await fetchHuntMeta(groupName);
  return meta;
};

export default function useHuntMeta(groupName: string) {
  const { data } = useSWR(groupName, groupName ? () => fetcher(groupName) : null, { revalidateIfStale: false });
  return { huntMeta: data };
}
