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
import { colors } from "../../libs/constants";

enum View {
  List,
  Map,
}

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

  const [view, setView] = useState(View.List);

  const toggleList = () => {
    setView(view === View.List ? View.Map : View.List);
  };

  const onSelectList = (lat: number, lng: number) => {
    map && map.setCenter({ lat, lng });
  };

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
    cacheMarker.addListener("click", () => {
      modal.toggleModal({ cacheId: id });
      setSelectedCache(id);
    });
    // cacheMarker.addListener("drag", (e: any) => {
    //   const lat = e.latLng.lat();
    //   const lng = e.latLng.lng();
    //   createCachePositionRef.current = { lat, lng };
    // });
  };

  useEffect(() => {
    for (let i = 0; i < caches.length; i++) {
      const cache = caches[i];
      let id = 0,
        lat = "",
        lng = "";
      try {
        id = cache.id.toNumber();
        lat = ethers.utils.parseBytes32String(cache.lat);
        lng = ethers.utils.parseBytes32String(cache.lng);
      } catch (e) {
        console.log("FIX THIS CRAP");
        id = cache.cacheId;
        lat = cache.lat;
        lng = cache.lng;
      }
      createCacheMarker(id, parseFloat(lat), parseFloat(lng));
    }
  }, [caches]);

  const hasCaches = caches.length > 0;
  console.log(caches);
  return (
    <div className="h-full w-full items-center flex flex-col">
      {/* <Big
        style={{ display: hasCaches ? "none" : "block" }}
        onClick={getAvailableCaches}
      >
        {fetching ? <BlackWrappedSpinner /> : "Get Caches"}
      </Big> */}
      {fetching && <FullScreenSpinner />}
      <Big onClick={toggleList} className="absolute top-5 w-64 z-30">
        {view === View.List ? "Hide List" : "View List"}
      </Big>
      {view === View.List && (
        <div
          className="absolute left-0 top-20 z-10"
          style={{ maxHeight: "90vh", overflow: "scroll" }}
        >
          {caches.map((cache, i) => {
            let id = 0,
              lat = "",
              lng = "";
            try {
              id = cache.id.toNumber();
              lat = ethers.utils.parseBytes32String(cache.lat);
              lng = ethers.utils.parseBytes32String(cache.lng);
            } catch (e) {
              console.log("FIX THIS CRAP");
              id = cache.cacheId;
              lat = cache.lat;
              lng = cache.lng;
            }
            return (
              <div
                key={cache + i}
                className="m-2 p-1 px-2 text-1xl border-white border-2 cursor-pointer"
                style={{
                  backgroundColor:
                    selectedCache === id ? colors.lavender : "black",
                }}
                onClick={() => {
                  // setSelectedCache(i + 1);
                  setSelectedCache(id);
                  onSelectList(parseFloat(lat), parseFloat(lng));
                }}
              >
                {id} - {lat.slice(0, 7)}, {lng.slice(0, 7)}
              </div>
            );
          })}
        </div>
      )}
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
      <div
        className="absolute bottom-5 text-center text-2xl font-bold w-full"
        style={{ color: colors.lavender }}
      >
        {" "}
        <div>Time to pick an empty egg to place your NFT into</div>
        <div>Click the egg on the map to pick it!</div>
      </div>
    </div>
  );
}
