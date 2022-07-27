import { ethers } from "ethers";
import { Magic } from "magic-sdk";
import { appKeys } from "./config";
import { abis, AIRCACHE_ADDRESS } from "./constants";
import storage from "./storage";
import { Latlng } from "./types";

const asin = Math.asin;
const cos = Math.cos;
const sin = Math.sin;
const sqrt = Math.sqrt;
const PI = Math.PI;

const R = 6378137;

function squared(x: number) {
  return x * x;
}
function toRad(x: number) {
  return (x * PI) / 180.0;
}
function hav(x: number) {
  return squared(sin(x / 2));
}
export function haversineDistance(a: Latlng, b: Latlng) {
  const aLat = toRad(Array.isArray(a) ? a[1] : a.lat);
  const bLat = toRad(Array.isArray(b) ? b[1] : b.lat);
  const aLng = toRad(Array.isArray(a) ? a[0] : a.lng);
  const bLng = toRad(Array.isArray(b) ? b[0] : b.lng);

  const ht = hav(bLat - aLat) + cos(aLat) * cos(bLat) * hav(bLng - aLng);
  return 2 * R * asin(sqrt(ht));
}

export const maticMumBaiNodeOptions = {
  rpcUrl:
    "https://polygon-mumbai.g.alchemy.com/v2/e9f3zs2O-BVmBkCXfZEUI-xmdt6wpzz9", // Polygon RPC URL
  chainId: 80001, // Polygon chain id
};

export const maticNodeOptions = {
  rpcUrl: "https://rpc-mainnet.maticvigil.com/", // Polygon RPC URL
  chainId: 137, // Polygon chain id
};

export const getMumbaiProvider = () => {
  const magic = new Magic(getMagicPubKey(), {
    network: maticMumBaiNodeOptions,
  });
  const provider = new ethers.providers.Web3Provider(magic.rpcProvider as any);
  return provider;
};

export const getMaticProvider = () => {
  const magic = new Magic(getMagicPubKey(), {
    network: maticNodeOptions,
  });
  const provider = new ethers.providers.Web3Provider(magic.rpcProvider as any);
  return provider;
};

export const getTokenURI = async (
  tokenId: number,
  tokenAddress: string,
  provider: ethers.providers.Provider
): Promise<string> => {
  console.log(provider);
  const tokenContract = new ethers.Contract(
    tokenAddress,
    [abis.tokenURI, abis.uri],
    provider
  );
  let uri;
  try {
    uri = await tokenContract.tokenURI(tokenId);
  } catch (e) {
    uri = await tokenContract.uri(tokenId);
    uri = uri.replace("{id}", "0x" + tokenId.toString(16).padStart(2, "0"));
  }
  return uri;
};

export const approveToken = async (
  tokenId: number,
  tokenAddress: string,
  signer: ethers.Signer
) => {
  console.log(signer);
  const tokenContract = new ethers.Contract(
    tokenAddress,
    [abis.approve],
    signer
  );
  const tx = await tokenContract.approve(AIRCACHE_ADDRESS, tokenId);
  console.log(tx);
};

const IPFS_IO = "https://ipfs.io";
const PINATA = "https://gateway.pinata.cloud";
export const ipfsToPinata = (uri: string) =>
  uri.replace("ipfs://", `${PINATA}/ipfs/`);

export const ipfstoIO = (uri: string) =>
  uri.replace("ipfs://", `${IPFS_IO}/ipfs/`);

export const isIpfs = (uri: string) => {
  return uri.slice(0, 7) === "ipfs://";
};

export const delay = (t = 500) =>
  new Promise((resolve) => {
    setTimeout(resolve, t);
  });

export const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export const alphabetMap: { [key: number]: string } = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "E",
  6: "F",
  7: "G",
  8: "H",
  9: "I",
  10: "J",
  11: "K",
  12: "L",
  13: "M",
  14: "N",
  15: "O",
  16: "P",
  17: "Q",
  18: "R",
  19: "S",
  20: "T",
  21: "U",
  22: "V",
  23: "W",
  24: "X",
  25: "Y",
  26: "Z",
};

const wordHunts = ["nft-nyc", "venice", "la"];

export const isWordHunt = (hunt: string) => wordHunts.includes(hunt);

export const getMagicPubKey = () => {
  if (typeof localStorage !== "undefined") {
    const currentGroup = storage.getItem(storage.keys.current_group);
    if (currentGroup) {
      const keys = appKeys[currentGroup];
      if (keys) {
        console.log(appKeys);
        return keys.pub;
      }
    }
  }
  return process.env.NEXT_PUBLIC_MAGIC_PUB_KEY as string;
};
