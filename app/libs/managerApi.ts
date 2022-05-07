import axios, { AxiosRequestConfig } from "axios";
import { Magic } from "magic-sdk";
import storage from "./storage";
import { Latlng } from "./types";

const api = axios.create();

const endpoints = {
  getNfts: "api/get-owner-nfts",
};

// api.interceptors.request.use(async (config: AxiosRequestConfig) => {
// if (config.headers === undefined) {
//   config.headers = {};
// }
// const jwt = await storage.getItem(storage.keys.token);
// if (jwt) {
//   config.headers.authorization = jwt;
// }
// return config;
// });

export const getOwnerNfts = async (owner: string) => {
  try {
    const response = await api
      .get(endpoints.getNfts, { params: { owner } })
      .catch((error) => {
        if (error.response) {
          const err = error.response.data;
          console.log(err);
          // return { data: { tx: null, message: err.message, error: err.error } };
        }
      });
    console.log(response);
    if (response) {
      const data = Object.keys(response.data).map((key) => {
        return response.data[key];
      });
      return data;
    }
  } catch (e) {
    console.log(e);
    console.error(e);
    return null;
  }
};

export default { getOwnerNfts };
