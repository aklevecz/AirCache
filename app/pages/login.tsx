import FullCenter from "../components/Layout/FullCenter";
import useAuth from "../hooks/useAuth";
import LoginComponent from "../components/Auth/Login";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

export default function Login() {
  const auth = useAuth();
  const router = useRouter();

  const goHome = () => {
    console.log("going home");
    router.push("/");
  };

  useEffect(() => {
    if (auth.user) {
      //   alert(auth.user.email);
      goHome();
    }
  }, [auth.user]);

  return (
    <div>
      <LoginComponent
        login={auth.login}
        logout={auth.logout}
        mutate={auth.mutate}
        fetching={auth.fetching}
        goHome={goHome}
      />
    </div>
  );
}
