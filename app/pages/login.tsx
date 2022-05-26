import useAuth from "../hooks/useAuth";
import LoginComponent from "../components/Auth/LoginRaptor";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Raptor from "../components/Icons/Raptor";

export default function Login() {
  const auth = useAuth();
  const router = useRouter();
  const [render, setRender] = useState(false);

  const goHome = () => {
    if (router.query.cache) {
      router.push(`/cache/${router.query.cache}`);
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    if (auth.user) {
      // goHome();
    } else {
      // I don't know why I need to do this otherwise magic barfs about cookies and locks up the renders
      // auth.logout();
    }
  }, [auth.user]);
  console.log(router.query.claim);
  return (
    <div>
      <div className="m-auto mt-10" style={{ width: 300 }}>
        {/* <img src={airYaytsoLogo.src} /> */}
        <Raptor />
      </div>
      <LoginComponent
        login={auth.login}
        logout={auth.logout}
        mutate={auth.mutate}
        fetching={auth.fetching}
        goHome={goHome}
        cacheId={router.query.cache}
        claim={router.query.claim}
      />
    </div>
  );
}
