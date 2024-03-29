import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import api, { endpoints, getUser } from "../libs/api";
import storage from "../libs/storage";
import { getMagicPubKey } from "../libs/utils";
import parsePhoneNumber from "libphonenumber-js";
import useHuntMeta from "./useHuntMeta";

export const testAddress = "0x04f6595ca4D8AC68A9D6A1eD2Cd52280BdcD7B17";
export default function useAuth() {
  const { data: user, error, mutate } = useSWR(endpoints.user, getUser);
  const [fetching, setFetching] = useState(false);
  const router = useRouter();

  // BAD
  const [hunt, setHunt] = useState(router.query.groupName as string);
  const { huntMeta } = useHuntMeta(hunt);

  useEffect(() => {
    if (router.query.groupName) {
      setHunt(router.query.groupName as string);
    } else if (!router.query.groupName && typeof localStorage !== "undefined") {
      setHunt(storage.getItem(storage.keys.current_group)!);
    }
  }, [router.query.groupName]);

  const isConnect = huntMeta && huntMeta.magicLinkType === "connect";
  const login = async (email: string, destination = "/") => {
    // if (typeof window === "undefined") {
    //   return console.error("No Window");
    // }
    // logout();

    return new Promise(async (resolve) => {
      setFetching(true);
      let redirectURI = "https://air.yaytso.art/callback" + destination;
      if (typeof window !== "undefined") {
        redirectURI = `${window.location.protocol}//${window.location.host}/callback${destination}`;
      }
      // const redirectURI = "https://air.yaytso.art/callback";
      // const redirectDestination =
      //   destination === "/"
      //     ? `?${destination.split("/")[0]}=${destination.split("/")[1]}`
      //     : "";
      const key = getMagicPubKey();
      const magic = new Magic(key, {
        network: "mainnet",
      });

      // const did = await magic.auth.loginWithMagicLink(config);
      // monkey patching for connect
      let did: string | null = "";
      if (isConnect) {
        const accounts = await magic.wallet.connectWithUI();
        did = accounts[0];
      } else {
        const config: any = { phoneNumber: parsePhoneNumber(email, "US")!.number };
        if (!window.location.href.includes("192")) {
          config.redirectURI = redirectURI;
        }
        did = await magic.auth.loginWithSMS(config);
      }
      const authRequest = await api.post(
        endpoints.login,
        { destination },
        {
          headers: { Authorization: `Bearer ${did}` },
        }
      );
      if (authRequest.status === 200) {
        const { token } = authRequest.data;
        storage.setItem(storage.keys.token, token);
        mutate();
        setTimeout(() => {
          // router.push("/eggs/nft-nyc");
          // router.push(
          //   destination === "/" ? destination : `${destination.replace("-", "/")}`
          // );
          setFetching(false);
          resolve(true);
        }, 100);
      }
    });
  };

  const logout = async () => {
    return new Promise(async (resolve) => {
      const magic = new Magic(getMagicPubKey());
      try {
        await magic.user.logout();
      } catch (e) {
        await magic.wallet.disconnect();
      }
      storage.deleteItem(storage.keys.token);
      // localStorage.clear();
      mutate();
      resolve(true);
      // setTimeout(() => resolve(true), 500);
    });

    // }
    // return logoutReq.ok;
  };

  const loading = user === undefined;
  return {
    user,
    login,
    logout,
    loading,
    fetching,
    mutate,
    error,
    isConnect,
  };
}
