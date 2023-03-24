import axios, { AxiosRequestConfig } from "axios";
import { HUNT_CONFIG_S3 } from "./constants";
// import { Magic } from "magic-sdk";
// import storage from "./storage";
// import { Latlng } from "./types";

const api = axios.create();

export const endpoints = {
  login: "/api/login",
  user: "/api/user",
  claim: "/api/claim",
  onCreateCache: "/api/on-create-cache",
  onUpdateCache: "/api/on-update-cache",
  getCachesByGroup: "/api/get-caches-by-group",
  checkClaim: "/api/check-claim",
  claimSacret: "/api/claim-sacret",
  getOwnerNFTs: "/api/get-owner-nfts",
};

api.interceptors.request.use(async (config: AxiosRequestConfig) => {
  if (config.headers === undefined) {
    config.headers = {};
  }

  // const jwt = await storage.getItem(storage.keys.token);
  // if (jwt) {
  //   config.headers.authorization = jwt;
  // }
  return config;
});

export const getHuntMetadata = async (name: string) => {
  const url = `${HUNT_CONFIG_S3}/${name}/metadata.json`;
  const metadata = await fetch(url)
    .then((r) => r.json())
    .catch((e) => {
      console.log(`The metadata for ${name} is missing...`);
    });
  return metadata;
};

export const getUser = async () => {
  try {
    const response = await api.get(endpoints.user);
    return response.data.user;
  } catch (e) {
    // const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY!);
    // magic.user.logout();
    // storage.deleteItem(storage.keys.token);
    return null;
  }
};

export const onCreateCache = (
  groupName: string,
  cacheId: number,
  lat: number,
  lng: number,
  address: string,
  note: string,
  tokenId: string
) => {
  const res = api.post(endpoints.onCreateCache, {
    groupName,
    cacheId,
    lat,
    lng,
    address,
    note,
    tokenId,
  });
  return res;
};

export const onUpdateCache = async (cacheId: string, tokenId: number, tokenAddress: string, groupName: string) => {
  const res = await api.post(endpoints.onUpdateCache, {
    cacheId,
    tokenId,
    tokenAddress,
    groupName,
  });
  return res.data;
};

export const getCachesByGroup = async (groupName: string) => {
  const res = await api.get(endpoints.getCachesByGroup, {
    params: { groupName },
  });
  console.log(res.data);
  return res.data;
};

export default api;
