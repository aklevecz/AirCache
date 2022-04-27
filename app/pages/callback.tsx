import { useRouter } from "next/router";
import { useEffect } from "react";
import { Magic } from "magic-sdk";
import { mutate } from "swr";
import { endpoints } from "../libs/api";

export default function Callback() {
  const router = useRouter();

  const onCreds = async (cred: string) => {
    const did = await new Magic(
      process.env.NEXT_PUBLIC_MAGIC_PUB_KEY!
    ).auth.loginWithCredential(cred);

    const authRequest = await fetch("/api/login", {
      method: "POST",
      headers: { Authorization: `Bearer ${did}` },
    });

    if (authRequest.ok) {
      console.log("great job");
      router.push("/");
      mutate(endpoints.user);
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
