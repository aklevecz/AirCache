import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import FullCenter from "../components/Layout/FullCenter";
import FullScreenSpinner from "../components/Loading/FullScreenSpinner";
import Map from "../components/Map";
import CacheContentModal from "../components/Modals/CacheContent";
import useAirCache from "../hooks/useAirCache";
import useAuth from "../hooks/useAuth";
import useModal from "../hooks/useModal";
import Head from "next/head";

const Home: NextPage = () => {
  const router = useRouter();
  const { cache } = router.query;

  const markerPosition = useRef<{ lat: number; lng: number }>(null);
  const auth = useAuth();
  const airCache = useAirCache(null);
  const modal = useModal();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (airCache.web3Ready) {
      airCache.collectCacheMeta();
    }
  }, [airCache.web3Ready]);

  // useEffect(() => {
  //   if (auth.user === null) {
  //     router.push("/login");
  //   }
  // }, [auth.user]);

  if (auth.user === undefined) {
    return (
      <FullCenter>
        <Head>
          <title>EGGS</title>
          <meta property="og:description" content={`Find eggs!`} />
          <meta property="og:image" content="/egg.png" />
        </Head>
        <div className="text-4xl">Loading...</div>
      </FullCenter>
    );
  }
  // if (auth.user === null) {
  //   return (
  //     <FullCenter>
  //       <Link href="/login">Login</Link>
  //     </FullCenter>
  //   );
  // }
  // ????
  if (!cache) {
    <div className="relative">
      <Head>
        <title>EGGS</title>
        <meta property="og:description" content={`Find eggs!`} />
        <meta property="og:image" content="/egg.png" />
      </Head>
      {/* <div className="absolute w-full bg-black z-10">
        <div className="overflow-hidden">{auth.user.publicAddress}</div>
      </div> */}
      <Map
        caches={airCache.caches}
        markerPosition={markerPosition}
        toggleModal={modal.toggleModal}
        showEmpty={false}
        user={auth.user}
      />
      {airCache.loading && <FullScreenSpinner />}
    </div>;
  }
  // const cacheInfo = airCache.caches[0];
  // const emptyCache = cacheInfo && cacheInfo.tokenId === 0;
  return (
    <div className="relative" style={{ height: "100%", paddingBottom: 50 }}>
      <Head>
        <title>EGGS</title>
        <meta property="og:description" content={`Find eggs!`} />
        <meta property="og:image" content="/egg.png" />
      </Head>
      {/* <div className="absolute w-full z-10">
        <div className="flex justify-center items-center">
          <label className="text-black" htmlFor="show-empty">
            Show empty
          </label>
          <input
            className="m-2"
            style={{ width: 15, height: 15 }}
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(!checked)}
          />
        </div>
      </div> */}
      <Map
        caches={airCache.caches}
        markerPosition={markerPosition}
        toggleModal={modal.toggleModal}
        showEmpty={checked}
        user={auth.user}
      />
      {!airCache.loading && (
        <CacheContentModal
          open={modal.open}
          toggleModal={modal.toggleModal}
          airCache={airCache}
          auth={auth}
          data={modal.data}
        />
      )}
      {airCache.loading && <FullScreenSpinner />}
    </div>
  );
};

export default Home;
