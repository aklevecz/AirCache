import { FormEvent, useEffect, useRef, useState } from "react";
import { Map } from "../../components/Map/Component";
import eggIcon from "../../assets/icons/egg2.png";
import smiler from "../../assets/icons/smiler.svg";
import Button from "../../components/Button";
import useAirCache from "../../hooks/useAirCache";
import useModal from "../../hooks/useModal";
import TxModal from "../../components/Modals/TxModal";
import { TxState } from "../../libs/types";
import api, { endpoints, onCreateCache } from "../../libs/api";
import { LA_COORDS } from "../../libs/constants";
import { prod } from "../../libs/env";

export default function Create() {
  const [map, setMap] = useState<google.maps.Map>();
  const airCache = useAirCache(null);
  const modal = useModal();
  const [txState, setTxState] = useState<TxState>(TxState.Idle);
  const [latLng, setLatLng] = useState("");
  const [groupName, setGroupName] = useState("");
  const [note, setNote] = useState("");

  const createCachePositionRef = useRef({ lat: 0, lng: 0 });
  const createCacheMarkerRef = useRef<google.maps.Marker | null>(null);

  const initMap = (map: google.maps.Map) => {
    setMap(map);
  };

  const createCache = async () => {
    modal.toggleModal();
    const { lat, lng } = createCachePositionRef.current;
    setTxState(TxState.Mining);
    const success = await airCache.createCache(lat, lng);
    if (success) {
      // REFACTOR
      const cacheId = (await airCache.contract!.cacheId()).toNumber();

      onCreateCache(
        groupName,
        cacheId,
        lat,
        lng,
        airCache.contract!.address,
        note
      );
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

    createCacheMarkerRef.current! = cacheMarker;

    cacheMarker.addListener("drag", (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      createCachePositionRef.current = { lat, lng };
    });
  };
  useEffect(() => {
    if (map && !prod) {
      // createCacheMarker(LA_COORDS.lat, LA_COORDS.lng);
    }
    if (map && navigator.geolocation && typeof window !== "undefined") {
      try {
        navigator.geolocation.getCurrentPosition((position) => {
          const pos = position.coords;
          console.log(pos);
          map.setCenter({
            lat: pos.latitude,
            lng: pos.longitude,
          });
          const icon = {
            url: smiler.src,
            scaledSize: new google.maps.Size(30, 30),
          };
          const latLng = { lat: pos.latitude, lng: pos.longitude };
          !createCacheMarkerRef.current &&
            createCacheMarker(latLng.lat, latLng.lng);
        });
      } catch (e) {
        console.error("Geolocation is not supported by this browser.");
      }
    }
  }, [map]);

  const onLatLngChange = (e: FormEvent<HTMLInputElement>) => {
    const latLng = e.currentTarget.value;
    setLatLng(latLng);
    const ll = latLng.trim().split(",");
    const lat = parseFloat(ll[0]);
    const lng = parseFloat(ll[1]);
    map?.setCenter({ lat, lng });
    createCachePositionRef.current = { lat, lng };
    console.log(createCacheMarkerRef.current);
    createCacheMarkerRef.current?.setPosition({ lat, lng });
  };

  return (
    <>
      <Map initMap={initMap} map={map} />
      <div className="absolute left-0 top-0 h-full m-5">
        <div className="mb-5">
          <input
            placeholder="latlng"
            value={latLng}
            onChange={onLatLngChange}
          />
        </div>
        <div className="mb-5">
          <input
            placeholder="group"
            value={groupName}
            onChange={(e) => setGroupName(e.currentTarget.value)}
          />
        </div>
        <div className="mb-5">
          <input
            placeholder="note"
            value={note}
            onChange={(e) => setNote(e.currentTarget.value)}
          />
        </div>
        <div>
          <Button
            onClick={createCache}
            style={{ background: "black", color: "white" }}
          >
            Create
          </Button>
        </div>
      </div>
      <TxModal
        open={modal.open}
        toggleModal={modal.toggleModal}
        txState={txState}
      />
    </>
  );
}
