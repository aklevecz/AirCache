import { Magic } from "magic-sdk";
import useSWR from "swr";
import api, { endpoints, getUser } from "../libs/api";
import storage from "../libs/storage";

const email = "arielklevecz@gmail.com";
export default function useAuth() {
  const { data: user, error, mutate } = useSWR(endpoints.user, getUser);

  const login = async () => {
    if (typeof window === "undefined") {
      return console.error("No Window");
    }
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY!);

    const did = await magic.auth.loginWithMagicLink({
      email,
      redirectURI: `${window.location.protocol}//${window.location.host}/callback`,
    });
    const authRequest = await api.post(endpoints.login, null, {
      headers: { Authorization: `Bearer ${did}` },
    });
    if (authRequest.status === 200) {
      const { token } = authRequest.data;
      storage.setItem(storage.keys.token, token);
      mutate();
    }
  };

  const logout = async () => {
    // const logoutReq = await fetch("/api/logout");
    // if (logoutReq.ok) {
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY!);
    // magic.user.logout();
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
    mutate,
    error,
  };
}
