import axios from "axios";
import { BigNumber, ethers } from "ethers";
import AirYaytsoInterface from "../hooks/AirYaytso.json";
import PolyaytsoInterface from "./Polyaytso.json";
import {
  abis,
  AIRCACHE_ADDRESS_MATIC,
  AIRCACHE_ADDRESS_MUMBAI,
  oldContracts,
  POLYAYTSO_ADDRESS_MATIC,
  POLYAYTSO_ADDRESS_MUMBAI,
} from "./constants";
import { delay, ipfstoIO, ipfsToPinata, isIpfs } from "./utils";

const prod = process.env.NODE_ENV === "development";
const ALCHEMY_KEY = prod
  ? process.env.ALCHEMY_KEY
  : process.env.ALCHEMY_KEY_MUMBAI;
const network = prod ? "matic" : "maticmum";
export const provider = new ethers.providers.AlchemyProvider(
  network,
  ALCHEMY_KEY
);
const contractAddress = prod ? AIRCACHE_ADDRESS_MATIC : AIRCACHE_ADDRESS_MUMBAI;
const contract = new ethers.Contract(
  contractAddress,
  AirYaytsoInterface.abi,
  provider
);

export const oldCaches = oldContracts.airCacheMatic.reduce((pv, cv) => {
  const contract = new ethers.Contract(cv, AirYaytsoInterface.abi, provider);
  return { ...pv, [cv]: contract };
}, {});

export { provider as AlchemyProvider };

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
    [abis.tokenURI, abis.uri],
    provider
  );
  let uri = "";
  console.log(tokenId, tokenAddress);
  try {
    uri = await tokenContract.tokenURI(tokenId);
  } catch (e) {
    uri = await tokenContract.uri(tokenId);
  }

  if (!uri) {
    console.error("something wrong");
    return {};
  }

  if (!isIpfs(uri)) {
    // This should just return the uri
    // If it has id replacement
    let url = "";
    if (uri.includes("{id}")) {
      url = uri.replace("{id}", tokenId.toString());
    }
    try {
      console.log("hello");
      const response = await axios.get(url);
      const metadata = response.data;
      return metadata;
    } catch (e) {
      return { name: "Broken NFT", image: "" };
    }
  }
  // const baseUrl = "https://gateway.pinata.cloud/ipfs/";
  // let metaurl = `${uri.replace("ipfs://", baseUrl)}`;

  const metaurl = ipfstoIO(uri);
  await delay(1000);
  const response = await axios.get(metaurl);
  const metadata = response.data;

  return metadata;
};

const polyaytsoAddress = prod
  ? POLYAYTSO_ADDRESS_MATIC
  : POLYAYTSO_ADDRESS_MUMBAI;
const polyaytsoContract = new ethers.Contract(
  polyaytsoAddress,
  PolyaytsoInterface.abi,
  provider
);

const getPolyaytsoBalance = async (address: string) => {
  const balances = await polyaytsoContract.getYaytsosOfAccount(address);
  const tokens = balances
    .map((token: BigNumber, i: number) => token.toNumber() && i)
    .filter((token: number) => token)
    .map((tokenID: number) => ({
      tokenID,
      contractAddress: polyaytsoContract.address,
    }));
  return tokens;
};

export default { getCache, getAllCaches, getNFTMeta, getPolyaytsoBalance };
