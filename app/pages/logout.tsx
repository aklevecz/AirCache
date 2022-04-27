import FullCenter from "../components/Layout/FullCenter";
import useAuth from "../hooks/useAuth";
import LoginComponent from "../components/Auth/Login";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import LogoutComponent from "../components/Auth/Logout";

export default function Logout() {
  const auth = useAuth();
  const router = useRouter();

  return (
    <FullCenter>
      <LogoutComponent
        login={auth.login}
        logout={auth.logout}
        fetching={auth.fetching}
      />
    </FullCenter>
  );
}
