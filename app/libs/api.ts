import axios, { AxiosRequestConfig } from "axios";
import { Magic } from "magic-sdk";
import { CDN_HOST } from "./constants";
import storage from "./storage";
import { Latlng } from "./types";

const api = axios.create();

export const endpoints = {
  login: "/api/login",
  user: "/api/user",
  claim: "/api/claim",
  onCreateCache: "/api/on-create-cache",
  onUpdateCache: "/api/on-update-cache",
  getCachesByGroup: "/api/get-caches-by-group",
  checkClaim: "/api/check-claim",
  claimVoucher: "/api/claim-voucher",
  claimSacret: "/api/claim-sacret",
  emailSignup: "/api/on-email-signup",
  airCash: "/api/air-cash",
};

api.interceptors.request.use(async (config: AxiosRequestConfig) => {
  if (config.headers === undefined) {
    config.headers = {};
  }

  const jwt = await storage.getItem(storage.keys.token);
  if (jwt) {
    config.headers.authorization = jwt;
  }
  return config;
});

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

export const claimCache = async (
  cacheId: number,
  groupName: string,
  tokenAddress: string,
  cacheLocation: Latlng,
  userLocation: Latlng,
  navigator: any
) => {
  try {
    const response = await api
      .post(endpoints.claim, {
        cacheId,
        groupName,
        tokenAddress,
        cacheLocation,
        userLocation,
        navigator,
      })
      .catch((error) => {
        if (error.response) {
          const err = error.response.data;
          return { data: { tx: null, message: err.message, error: err.error } };
        }
      });
    if (response) return response.data;
  } catch (e) {
    console.log(e);
    console.error(e);
    return null;
  }
};

export const claimVoucher = async (tokenAddress: string, tokenType: string, cacheLocation: Latlng, userLocation: Latlng, navigator: any) => {
  console.log(tokenAddress, tokenType);
  try {
    const response = await api
      .post(endpoints.claimVoucher, {
        tokenAddress,
        tokenType,
        cacheLocation,
        userLocation,
        navigator,
      })
      .catch((error) => {
        if (error.response) {
          const err = error.response.data;
          return { data: { tx: null, message: err.message, error: err.error } };
        }
      });
    return response && response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const onCreateCache = (groupName: string, cacheId: number, lat: number, lng: number, address: string, note: string) => {
  const res = api.post(endpoints.onCreateCache, {
    groupName,
    cacheId,
    lat,
    lng,
    address,
    note,
  });
};

export const onUpdateCache = (cacheId: string, tokenId: number, tokenAddress: string, groupName: string) => {
  const res = api.post(endpoints.onUpdateCache, {
    cacheId,
    tokenId,
    tokenAddress,
    groupName,
  });
};

export const getCachesByGroup = async (groupName: string) => {
  const res = await api.get(endpoints.getCachesByGroup, {
    params: { groupName },
  });
  return res.data;
};

export const checkClaim = async (claim: string) => {
  const res = await api.get(endpoints.checkClaim, { params: { claim } });
  return res.data;
};

export const claimSacret = async (sacret: string) => {
  const res = await api.post(endpoints.claimSacret, { sacret });
  return res.data;
};

export const onEmailSignup = async (email: string, environment: string) => {
  const res = await api.post(endpoints.emailSignup, { email, environment });
  return res;
};

export default api;

// CDN?
export const fetchHuntMeta = async (huntName: string) => {
  const res = await axios.get(`${CDN_HOST}/hunt_configs/${huntName}/metadata.json`);
  return res.data;
};
