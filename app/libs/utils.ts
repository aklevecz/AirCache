import { ethers } from "ethers";
import { Magic } from "magic-sdk";
import { abis, AIRCACHE_ADDRESS } from "./constants";
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
  rpcUrl: "https://rpc-mumbai.maticvigil.com/", // Polygon RPC URL
  chainId: 80001, // Polygon chain id
};

export const maticNodeOptions = {
  rpcUrl: "https://rpc-mainnet.maticvigil.com/", // Polygon RPC URL
  chainId: 137, // Polygon chain id
};

export const getMumbaiProvider = () => {
  const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY!, {
    network: maticMumBaiNodeOptions,
  });
  const provider = new ethers.providers.Web3Provider(magic.rpcProvider as any);
  return provider;
};

export const getMaticProvider = () => {
  const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY!, {
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
  const tokenContract = new ethers.Contract(
    tokenAddress,
    [abis.tokenURI],
    provider
  );
  const uri = await tokenContract.tokenURI(tokenId);
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
