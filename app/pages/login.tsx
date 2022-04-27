import FullCenter from "../components/Layout/FullCenter";
import useAuth from "../hooks/useAuth";
import LoginComponent from "../components/Auth/Login";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

export default function Login() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.user) {
      router.push("/");
    }
  }, [auth.user]);

  return (
    <FullCenter>
      <LoginComponent
        login={auth.login}
        logout={auth.logout}
        fetching={auth.fetching}
      />
    </FullCenter>
  );
}
