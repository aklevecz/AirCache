import axios from "axios";
import { BigNumber, ethers } from "ethers";
import AirYaytsoInterface from "./AirYaytso.json";
import {
  abis,
  AIRCACHE_ADDRESS_MATIC,
  AIRCACHE_ADDRESS_MUMBAI,
} from "./constants";
import { delay, ipfstoIO, ipfsToPinata, isIpfs } from "./utils";
import { prod } from "./env";
import { onUpdateCache } from "./api";
import { FillTxState, TxState } from "./types";

export const ALCHEMY_KEY = prod
  ? process.env.NEXT_PUBLIC_ALCHEMY_KEY
  : process.env.NEXT_PUBLIC_ALCHEMY_KEY_MUMBAI;
const network = prod ? "matic" : "maticmum";
console.log("HELLO", prod, network, ALCHEMY_KEY);
export const alchemyProvider = new ethers.providers.AlchemyProvider(
  network,
  ALCHEMY_KEY
);
const contractAddress = prod ? AIRCACHE_ADDRESS_MATIC : AIRCACHE_ADDRESS_MUMBAI;
export const contract = new ethers.Contract(
  contractAddress,
  AirYaytsoInterface.abi,
  alchemyProvider
);

export { alchemyProvider as AlchemyProvider };

const getCache = async (
  id: number,
  provider:
    | ethers.providers.AlchemyProvider
    | ethers.providers.Web3Provider = alchemyProvider
) => {
  const contract = new ethers.Contract(
    contractAddress,
    AirYaytsoInterface.abi,
    provider
  );
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

const createCache = async (
  lat: number,
  lng: number,
  provider:
    | ethers.providers.AlchemyProvider
    | ethers.providers.Web3Provider = alchemyProvider,
  callback: any
) => {
  const contract = new ethers.Contract(
    contractAddress,
    AirYaytsoInterface.abi,
    provider
  );
  const signer = provider.getSigner();
  // maybe unncesscessary
  if (contract && signer) {
    const contractSigner = contract.connect(signer);
    const latBytes = ethers.utils.formatBytes32String(lat.toString());
    const lngBytes = ethers.utils.formatBytes32String(lng.toString());
    try {
      const tx = await contractSigner.createCache(latBytes, lngBytes);
      callback(TxState.Minting);
      const receipt = await tx.wait();
      for (const event of receipt.events) {
        console.log(event);
      }
      await delay(1000);
      callback(TxState.Completed);
      return true;
    } catch (e) {
      callback(TxState.Error);
      alert(JSON.stringify(e));
      console.error(e);
      return false;
    }
  }
};

const getNFTMeta = async (
  tokenId: number,
  tokenAddress: string,
  provider = alchemyProvider
) => {
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

const fillCache = async (
  cacheId: number,
  tokenId: number,
  tokenAddress: string,
  provider:
    | ethers.providers.AlchemyProvider
    | ethers.providers.Web3Provider = alchemyProvider,
  callback: any
) => {
  const contract = new ethers.Contract(
    contractAddress,
    AirYaytsoInterface.abi,
    provider
  );
  const signer = provider.getSigner();
  if (contract && signer) {
    const contractSigner = contract.connect(signer);
    try {
      callback(FillTxState.Signing);
      const fees = await fetch(
        `https://polygon-mainnet.g.alchemyapi.io/v2/` +
          "Lxf62YcgEvOlb2EN6cZaRG4rvD92usKy",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}',
        }
      ).then((response) => response.json());
      console.log(fees.result)
      const tx = await contractSigner.holdNFT(tokenAddress, tokenId, cacheId, {gasPrice:fees.result, gasLimit:"246274"});
      callback(FillTxState.Minting);

      const receipt = await tx.wait();
      let eventResponse = "";
      for (const event of receipt.events) {
        console.log(event);
        if (event.event === "NFTHeld") {
          callback(FillTxState.Completed);
          // Refactor: Should this be optimisic or a webhook?
          eventResponse = event.event;
        }
      }
      return eventResponse;
    } catch (e) {
      alert(JSON.stringify(e));
      callback(FillTxState.Error);
      console.error(e);
    }
  }
  return false;
};

export default {
  getCache,
  getAllCaches,
  getNFTMeta,
  createCache,
  fillCache,
  contract,
};
