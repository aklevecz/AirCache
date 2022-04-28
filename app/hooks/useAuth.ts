import { Magic } from "magic-sdk";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import api, { endpoints, getUser } from "../libs/api";
import storage from "../libs/storage";

export const testAddress = "0x04f6595ca4D8AC68A9D6A1eD2Cd52280BdcD7B17";
export default function useAuth() {
  const { data: user, error, mutate } = useSWR(endpoints.user, getUser);
  const [fetching, setFetching] = useState(false);
  const router = useRouter();
  const login = async (email: string) => {
    // if (typeof window === "undefined") {
    //   return console.error("No Window");
    // }

    setFetching(true);
    let redirectURI = "https://air.yaytso.art/callback";
    if (typeof window !== "undefined") {
      redirectURI = `${window.location.protocol}//${window.location.host}/callback`;
    }
    // const redirectURI = "https://air.yaytso.art/callback";
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY!);
    const did = await magic.auth.loginWithMagicLink({
      email,
      redirectURI,
    });
    const authRequest = await api.post(endpoints.login, null, {
      headers: { Authorization: `Bearer ${did}` },
    });
    if (authRequest.status === 200) {
      const { token } = authRequest.data;
      storage.setItem(storage.keys.token, token);
      mutate();
      setTimeout(() => {
        router.push("/");
        // window.location.reload();
        setFetching(false);
      }, 1000);
    }
  };

  const logout = async () => {
    // const logoutReq = await fetch("/api/logout");
    // if (logoutReq.ok) {
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY!);
    magic.user.logout();
    storage.deleteItem(storage.keys.token);
    mutate();
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
  };
}
