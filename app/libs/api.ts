import axios, { AxiosRequestConfig } from "axios";
import { Magic } from "magic-sdk";
import storage from "./storage";
import { Latlng } from "./types";

const api = axios.create();

export const endpoints = {
  login: "/api/login",
  user: "/api/user",
  claim: "/api/claim",
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
  cacheLocation: Latlng,
  userLocation: Latlng,
  navigator: any
) => {
  try {
    const response = await api
      .post(endpoints.claim, {
        cacheId,
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

export default api;
