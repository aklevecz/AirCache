import { useEffect, useState } from "react";
import { Web3Wallet } from "../../libs/types";
import Big from "../Button/Big";
import BlackWrappedSpinner from "../Loading/BlackWrappedSpinner";
import { Map } from "../Map/Component";
import eggIcon from "../../assets/icons/egg2.png";
import { ethers } from "ethers";
import useModal from "../../hooks/useModal";
import PickCache from "../Modals/PickCache";
import FullScreenSpinner from "../Loading/FullScreenSpinner";

type Props = {
  web3Wallet: Web3Wallet;
  getAvailableCaches: () => void;
  caches: any[];
  setCaches: any;
  selectedCache: any;
  setSelectedCache: any;
  fetching: boolean;
  goToFillCache: () => void;
};

export default function Caches({
  web3Wallet,
  getAvailableCaches,
  caches,
  selectedCache,
  setSelectedCache,
  fetching,
  goToFillCache,
}: Props) {
  const modal = useModal();
  const [map, setMap] = useState<google.maps.Map>();

  const initMap = (map: google.maps.Map) => {
    setMap(map);
  };

  useEffect(() => {
    getAvailableCaches();
  }, []);

  const createCacheMarker = (id: number, lat: number, lng: number) => {
    const icon = {
      url: eggIcon.src,
      scaledSize: new google.maps.Size(30, 30),
    };
    const cacheMarker = new google.maps.Marker({
      position: { lat, lng },
      map,
      icon,
      draggable: true,
    });
    console.log(lat, lng);
    cacheMarker.addListener("click", () => {
      modal.toggleModal({ cacheId: id });
    });
    // cacheMarker.addListener("drag", (e: any) => {
    //   const lat = e.latLng.lat();
    //   const lng = e.latLng.lng();
    //   createCachePositionRef.current = { lat, lng };
    // });
  };
  console.log(modal);
  useEffect(() => {
    for (let i = 0; i < caches.length; i++) {
      const cache = caches[i];
      createCacheMarker(
        cache.id.toNumber(),
        parseFloat(ethers.utils.parseBytes32String(cache.lat)),
        parseFloat(ethers.utils.parseBytes32String(cache.lng))
      );
    }
  }, [caches]);

  const hasCaches = caches.length > 0;
  console.log(fetching);
  return (
    <div className="h-full w-full items-center justify-center flex flex-col">
      <Big
        style={{ display: hasCaches ? "none" : "block" }}
        onClick={getAvailableCaches}
      >
        {fetching ? <BlackWrappedSpinner /> : "Get Caches"}
      </Big>
      {fetching && <FullScreenSpinner />}
      {/* {caches.map((cache, i) => {
        return (
          <div
            key={cache + i}
            className="w-1/2 m-2 p-5 text-2xl border-white border-2"
            style={{
              backgroundColor: selectedCache === i + 1 ? "red" : "black",
            }}
            onClick={() => {
              setSelectedCache(i + 1);
            }}
          >
            {cache.id.toNumber()}
          </div>
        );
      })} */}
      {/* {selectedCache ? (
        <Big onClick={goToFillCache}>
          {fetching ? <BlackWrappedSpinner /> : "Fill Cache"}
        </Big>
      ) : (
        ""
      )} */}
      <Map initMap={initMap} map={map} />
      <PickCache
        toggleModal={modal.toggleModal}
        open={modal.open}
        cacheId={modal.data && modal.data.cacheId}
        confirm={() => {
          setSelectedCache(modal.data.cacheId);
          goToFillCache();
        }}
      />
    </div>
  );
}
