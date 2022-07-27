import { LatLng } from "./types";

export const parseLocationString = (locationString: string): LatLng => {
  const splitLocationString = locationString.split(",");
  if (splitLocationString.length < 2) {
    return { lat: 0, lng: 0 };
  }
  const lat = parseFloat(splitLocationString[0]);
  const lng = parseFloat(splitLocationString[1]);
  return { lat, lng };
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
