import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useRef } from "react";
import Login from "../components/Auth/Login";
import FullCenter from "../components/Layout/FullCenter";
import Map from "../components/Map";
import useAirCache from "../hooks/useAirCache";
import useAuth from "../hooks/useAuth";

const Home: NextPage = () => {
  const router = useRouter();
  const markerPosition = useRef<{ lat: number; lng: number }>(null);

  const auth = useAuth();
  const { cache } = router.query;
  const airCache = useAirCache(cache as string);

  if (auth.user === undefined) {
    return (
      <FullCenter>
        <div className="text-4xl">Loading...</div>
      </FullCenter>
    );
  }

  if (auth.user === null) {
    return (
      <FullCenter>
        <Login login={auth.login} logout={auth.logout} />
      </FullCenter>
    );
  }

  return (
    <div>
      <div className="absolute w-full h-10 bg-black z-10">
        <div>{auth.user.publicAddress}</div>
        {/* <button
          onClick={() =>
            airCache.createCache(
              markerPosition.current!.lat,
              markerPosition.current!.lng
            )
          }
        >
          Create Cache
        </button> */}
      </div>
      <Map caches={airCache.caches} markerPosition={markerPosition} />
    </div>
  );
};

export default Home;
