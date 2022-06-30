import axios from "axios";
import { BigNumber, ethers } from "ethers";
import AirYaytsoInterface from "../hooks/AirYaytso.json";
import PolyaytsoInterface from "./Polyaytso.json";
import AlphabetCityInterface from "./AlphabetCity.json";
import {
  abis,
  AIRCACHE_ADDRESS_MATIC,
  AIRCACHE_ADDRESS_MUMBAI,
  ALPHABET_CITY,
  oldContracts,
  POLYAYTSO_ADDRESS_MATIC,
  POLYAYTSO_ADDRESS_MUMBAI,
} from "./constants";
import { alphabetMap, delay, ipfstoIO, ipfsToPinata, isIpfs } from "./utils";
import { prod } from "./env";

export const ALCHEMY_KEY = prod
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

const oldCacheAddresses = prod ? oldContracts.matic : oldContracts.matic_mum;

// export const oldCacheContracts = oldCacheAddresses.reduce((pv, cv) => {
//   const contract = new ethers.Contract(cv, AirYaytsoInterface.abi, provider);
//   return { ...pv, [cv]: contract };
// }, {});

export const oldCacheContracts = oldCacheAddresses.map((address: string) => {
  return new ethers.Contract(address, AirYaytsoInterface.abi, provider);
});

export { provider as AlchemyProvider };

// Utilize get cached caches
// or use the dynamodb as source of truth for caches and their location
// then need an intelligent way to check if they are available
// ALSO get cache by the groupName
const getCache = async (id: number) => {
  const cache = await contract.caches(id);
  return { ...cache, contractAddress: contract.address };
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
    let url = uri;
    // Need some interator for various ERC-1155 schemes
    if (uri.includes("{id}")) {
      url = uri.replace("{id}", tokenId.toString(16).padStart(64, "0"));
    }
    try {
      const response = await axios.get(url);
      const metadata = response.data;

      return metadata;
    } catch (e) {
      return { name: "Broken NFT", image: "" };
    }
  }

  // Not supporting IPFS for static at the moment
  return { name: "A NFT!", image: "" };

  // const baseUrl = "https://gateway.pinata.cloud/ipfs/";
  // let metaurl = `${uri.replace("ipfs://", baseUrl)}`;

  const metaurl = ipfsToPinata(uri);
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

const alphabetCityContract = new ethers.Contract(
  ALPHABET_CITY,
  AlphabetCityInterface.abi,
  provider
);

const getCurrentWord = async () => {
  const wordArray = await alphabetCityContract.getWord();
  const letterArray = wordArray.map(
    (bigNumberWord: BigNumber) => alphabetMap[bigNumberWord.toNumber()]
  );
  return letterArray.join(" ");
};

const getAccountsCurrentLetters = async (account: string) => {
  const wordArray = await alphabetCityContract.getUsersGuesses(account);
  const word = wordArray.map((lId: number) => alphabetMap[lId]).join("");
  return word;
};

const accountHasWord = async (account: string) => {
  const hasWord = await alphabetCityContract.accountHasWord(account);
  return hasWord;
};

export default {
  getCache,
  getAllCaches,
  getNFTMeta,
  getPolyaytsoBalance,
  accountHasWord,
  getCurrentWord,
  getAccountsCurrentLetters,
  contract,
  alphabetCityContract,
};
