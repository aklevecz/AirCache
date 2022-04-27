import { useEffect, useRef, useState } from "react";
import { Map } from "../../components/Map/Component";
import eggIcon from "../../assets/icons/egg2.png";
import smiler from "../../assets/icons/smiler.svg";
import Button from "../../components/Button";
import useAirCache from "../../hooks/useAirCache";
import useModal from "../../hooks/useModal";
import TxModal from "../../components/Modals/TxModal";
import { TxState } from "../../libs/types";

export default function Create() {
  const [map, setMap] = useState<google.maps.Map>();
  const airCache = useAirCache(null);
  const modal = useModal();
  const [txState, setTxState] = useState<TxState>(TxState.Idle);

  const createCachePositionRef = useRef({ lat: 0, lng: 0 });

  const initMap = (map: google.maps.Map) => {
    setMap(map);
  };

  const createCache = async () => {
    modal.toggleModal();
    const { lat, lng } = createCachePositionRef.current;
    setTxState(TxState.Mining);
    const success = await airCache.createCache(lat, lng);
    if (success) {
      setTxState(TxState.Complete);
    } else {
      setTxState(TxState.Error);
    }
  };
  const createCacheMarker = (lat: number, lng: number) => {
    const icon = {
      url: eggIcon.src,
      scaledSize: new google.maps.Size(70, 70),
    };
    const cacheMarker = new google.maps.Marker({
      position: { lat, lng },
      map,
      icon,
      draggable: true,
    });

    cacheMarker.addListener("drag", (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      createCachePositionRef.current = { lat, lng };
    });
  };
  useEffect(() => {
    if (map && navigator.geolocation && typeof window !== "undefined") {
      try {
        navigator.geolocation.getCurrentPosition((position) => {
          const pos = position.coords;
          map.setCenter({
            lat: pos.latitude,
            lng: pos.longitude,
          });
          const icon = {
            url: smiler.src,
            scaledSize: new google.maps.Size(30, 30),
          };
          const latLng = { lat: pos.latitude, lng: pos.longitude };
          createCacheMarker(latLng.lat, latLng.lng);
        });
      } catch (e) {
        console.error("Geolocation is not supported by this browser.");
      }
    }
  }, [map]);

  return (
    <>
      <Map initMap={initMap} map={map} />
      <div className="absolute left-0 bottom-14 w-full flex justify-center">
        <Button
          onClick={createCache}
          style={{ background: "black", color: "white" }}
        >
          Create
        </Button>
      </div>
      <TxModal
        open={modal.open}
        toggleModal={modal.toggleModal}
        txState={txState}
      />
    </>
  );
}
