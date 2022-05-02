import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import silverMap from "../assets/map-style/silver-map.json";
import smiler from "../assets/icons/smiler.svg";
import cacheIcon from "../assets/icons/cache.png";
import eggIcon from "../assets/icons/egg2.png";
import { ethers } from "ethers";
import storage from "../libs/storage";
import { Latlng } from "../libs/types";
import { BAHAMA_COORDS, LA_COORDS } from "../libs/constants";

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GMAP_KEY as string,
  version: "weekly",
});

type Props = {
  markerPosition: any;
  caches: any;
  toggleModal: (data: any) => void;
  showEmpty: boolean;
  user: any;
};

export default function Map({
  markerPosition,
  caches,
  toggleModal,
  showEmpty,
  user,
}: Props) {
  const [map, setMap] = useState<google.maps.Map>();
  const mapContainer = useRef<HTMLDivElement>(null);

  const userRef = useRef<any>(null);
  const navigatorRef = useRef<any>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const markerRefs = useRef<any>([]);

  const createCacheMarker = (
    lat: number,
    lng: number,
    id: number,
    NFT: any
  ) => {
    const icon = {
      url: eggIcon.src,
      scaledSize: new google.maps.Size(40, 40),
    };
    const cacheMarker = new google.maps.Marker({
      position: { lat, lng },
      map,
      icon,
    });
    // console.log(NFT);
    // if (!NFT.name) {
    //   cacheMarker.setMap(null);
    // }
    markerRefs.current = [...markerRefs.current, { marker: cacheMarker, NFT }];
    cacheMarker.addListener("click", () => {
      toggleModal({ cache: { id, location: { lat, lng } }, NFT });
    });
  };

  useEffect(() => {
    markerRefs.current.forEach((marker: any) => {
      if (marker.NFT.name || showEmpty) {
        marker.marker.setMap(map);
      } else {
        marker.marker.setMap(null);
      }
    });
  }, [showEmpty]);
  useEffect(() => {
    if (map) {
      for (let i = 0; i < caches.length; i++) {
        // const id = caches[i].id.toNumber();
        const id = caches[i].id;
        const tokenId = caches[i].tokenId;
        const isEmpty = tokenId === 0;
        // if (isEmpty) {
        //   console.log("Empty Cache");
        // } else {
        // const lat = ethers.utils.parseBytes32String(caches[i].lat);
        // const lng = ethers.utils.parseBytes32String(caches[i].lng);
        const lat = caches[i].lat;
        const lng = caches[i].lng;
        createCacheMarker(parseFloat(lat), parseFloat(lng), id, caches[i].NFT);
      }
      // }
    }
  }, [caches, map]);

  useEffect(() => {
    loader.load().then(() => {
      if (mapContainer.current) {
        const last_location = storage.getItem(storage.keys.user_location);
        const center = last_location
          ? JSON.parse(last_location)
          : { lat: LA_COORDS.lat, lng: LA_COORDS.lng };
        const map = new google.maps.Map(mapContainer.current, {
          zoom: 15,
          styles: silverMap,
          center,
        });
        setMap(map);
      }
    });
  }, []);

  const getMarker = (selector: string): any => {
    const MAX_TRIES = 100;
    let tries = 0;
    return new Promise((resolve, __) => {
      const pollMarker = (): any => {
        const markerDom = document.querySelector(selector) as HTMLImageElement;
        if (!markerDom && tries < MAX_TRIES) {
          tries++;
          return setTimeout(pollMarker, 200);
        }
        return resolve(markerDom);
      };
      pollMarker();
    });
  };

  const getUserLocation = () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    });
  };

  const updateUserMarker = async () => {
    const position = await getUserLocation();
    if (position && userMarkerRef.current) {
      userMarkerRef.current.setPosition(position as Latlng);
    }
  };

  useEffect(() => {
    let interval: any;
    if (user) {
      interval = setInterval(updateUserMarker, 3000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [user]);
  console.log(user);
  useEffect(() => {
    if (map && navigator.geolocation && typeof window !== "undefined" && user) {
      try {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log("getting loc");
          const pos = position.coords;
          map.setCenter({
            lat: pos.latitude,
            lng: pos.longitude,
          });
          const icon = {
            url: smiler.src,
            scaledSize: new google.maps.Size(20, 20),
          };
          const latLng = { lat: pos.latitude, lng: pos.longitude };
          const userMarker = new google.maps.Marker({
            position: latLng,
            map,
            icon,
            // draggable: true,
            clickable: false,
          });
          getMarker(`img[src='${smiler.src}']`).then((marker: any) => {
            if (marker) {
              marker.classList.add("pulse");
              marker.classList.add("user-marker");
            }
          });
          userMarkerRef.current = userMarker;
          userRef.current = latLng;
          navigatorRef.current = position;
          storage.setItem(storage.keys.user_location, JSON.stringify(latLng));
        });
      } catch (e) {
        console.error("Geolocation error");
      }
    }
  }, [map, user]);

  return <div ref={mapContainer} style={{ height: "100%" }}></div>;
}
