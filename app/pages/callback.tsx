import { useRouter } from "next/router";
import { useEffect } from "react";
import { Magic } from "magic-sdk";
import { mutate } from "swr";
import api, { endpoints } from "../libs/api";
import storage from "../libs/storage";

// DEPRECATED?
export default function Callback() {
  const router = useRouter();

  const onCreds = async (cred: string) => {
    const did = await new Magic(
      process.env.NEXT_PUBLIC_MAGIC_PUB_KEY!
    ).auth.loginWithCredential(cred);

    const authRequest = await api.post(endpoints.login, null, {
      headers: { Authorization: `Bearer ${did}` },
    });
    if (authRequest.status === 200) {
      console.log("great job");
      const { token } = authRequest.data;
      storage.setItem(storage.keys.token, token);
      mutate(endpoints.user);
      router.push("/");
    }
  };

  useEffect(() => {
    const { magic_credential } = router.query;
    if (magic_credential) {
      onCreds(magic_credential as string);
    }
  }, [router.query]);
  return <div></div>;
}
