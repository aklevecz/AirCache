import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import FullCenter from "../../components/Layout/FullCenter";
import FullScreenSpinner from "../../components/Loading/FullScreenSpinner";
import Map from "../../components/Map";
import CacheContentModal from "../../components/Modals/CacheContent";
import useAirCache from "../../hooks/useAirCache";
import useAuth from "../../hooks/useAuth";
import useModal from "../../hooks/useModal";

const Cache: NextPage = () => {
  const router = useRouter();
  const { id: cache } = router.query;
  const markerPosition = useRef<{ lat: number; lng: number }>(null);
  const auth = useAuth();
  const airCache = useAirCache(cache as string);
  const modal = useModal();

  useEffect(() => {
    if (auth.user === null) {
      router.push("/login");
    }
  }, [auth.user]);

  useEffect(() => {
    if (airCache.web3Ready) {
      airCache.collectCacheMeta();
    }
  }, [airCache.web3Ready]);

  if (auth.user === undefined) {
    return (
      <FullCenter>
        <div className="text-4xl">Loading...</div>
      </FullCenter>
    );
  }

  //   if (auth.user === null) {
  //     return (
  //       <FullCenter>
  //         <Login login={auth.login} logout={auth.logout} />
  //       </FullCenter>
  //     );
  //   }

  if (!cache) {
    <div className="relative">
      {/* <div className="absolute w-full bg-black z-10">
        <div className="overflow-hidden">{auth.user.publicAddress}</div>
      </div> */}
      <Map
        caches={airCache.caches}
        markerPosition={markerPosition}
        toggleModal={modal.toggleModal}
        showEmpty={false}
      />
      {airCache.loading && <FullScreenSpinner />}
    </div>;
  }

  const cacheInfo = airCache.caches && airCache.caches[0];
  const emptyCache = cacheInfo && cacheInfo.tokenId === 0;
  return (
    <div className="relative">
      {/* <div className="absolute w-full bg-black z-10">
        <div className="overflow-hidden">{auth.user.publicAddress}</div>
      </div> */}
      <Map
        caches={airCache.caches}
        markerPosition={markerPosition}
        toggleModal={modal.toggleModal}
        showEmpty={false}
      />
      {!airCache.loading && cacheInfo && (
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

export default Cache;
