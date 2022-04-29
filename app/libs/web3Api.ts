import axios from "axios";
import { ethers } from "ethers";
import AirYaytsoInterface from "../hooks/AirYaytso.json";
import { abis, AIRCACHE_ADDRESS_MATIC } from "./constants";
import { delay, ipfsToPinata, isIpfs } from "./utils";

const ALCHEMY_KEY = process.env.ALCHEMY_KEY;
const provider = new ethers.providers.AlchemyProvider("matic", ALCHEMY_KEY);
const contract = new ethers.Contract(
  AIRCACHE_ADDRESS_MATIC,
  AirYaytsoInterface.abi,
  provider
);

const getCache = async (id: number) => {
  const cache = await contract.caches(id);
  return cache;
};
const getAllCaches = async () => {
  const numCaches = (await contract.cacheId()).toNumber();
  const caches = [];
  for (let i = 1; i <= numCaches; i++) {
    const cache = await getCache(i);
    caches.push(cache);
  }

  return caches;
};

const getNFTMeta = async (tokenId: number, tokenAddress: string) => {
  const tokenContract = new ethers.Contract(
    tokenAddress,
    [abis.tokenURI],
    provider
  );

  const uri = await tokenContract.tokenURI(tokenId);

  if (!uri) {
    console.error("something wrong");
    return {};
  }

  if (!isIpfs(uri)) {
    // This should just return the uri
    return uri;
  }
  // const baseUrl = "https://gateway.pinata.cloud/ipfs/";
  // let metaurl = `${uri.replace("ipfs://", baseUrl)}`;

  const metaurl = ipfsToPinata(uri);
  await delay(1000);
  const response = await axios.get(metaurl);
  const metadata = response.data;

  return metadata;
};

export default { getCache, getAllCaches, getNFTMeta };
