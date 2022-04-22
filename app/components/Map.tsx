import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import silverMap from "../assets/map-style/silver-map.json";
import smiler from "../assets/icons/smiler.svg";
import cacheIcon from "../assets/icons/cache.png";
import { ethers } from "ethers";
import { claimCache } from "../libs/api";

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GMAP_KEY as string,
  version: "weekly",
});

const LA_COORDS = {
  lat: 37.7664967,
  lng: -122.4293212,
};

type Props = {
  markerPosition: any;
  caches: any;
};

export default function Map({ markerPosition, caches }: Props) {
  const [map, setMap] = useState<google.maps.Map>();
  const mapContainer = useRef<HTMLDivElement>(null);

  const userRef = useRef<any>(null);
  const navigatorRef = useRef<any>(null);

  const createCacheMarker = (lat: number, lng: number, id: number) => {
    const icon = {
      url: cacheIcon.src,
      scaledSize: new google.maps.Size(40, 40),
    };
    const cacheMarker = new google.maps.Marker({
      position: { lat, lng },
      map,
      icon,
    });
    const cacheLocation = { lat, lng };

    cacheMarker.addListener("click", () => {
      const timestamp = navigatorRef.current.timestamp;
      const coords = navigatorRef.current.coords;
      const o = {
        accuracy: coords.accuracy,
        altitude: coords.altitude,
        altitudeAccuracy: coords.altitudeAccuracy,
        heading: coords.heading,
        latitude: coords.latitude,
        longitude: coords.longitude,
        speed: coords.speed,
      };
      claimCache(id, cacheLocation, userRef.current, { timestamp, o });
    });
  };
  useEffect(() => {
    if (map) {
      for (let i = 0; i < caches.length; i++) {
        const id = caches[i].id.toNumber();
        const tokenId = caches[i].id.toNumber();
        if (tokenId === 0) {
          console.log("Empty Cache");
        } else {
          const lat = ethers.utils.parseBytes32String(caches[i].lat);
          const lng = ethers.utils.parseBytes32String(caches[i].lng);
          createCacheMarker(parseFloat(lat), parseFloat(lng), id);
        }
      }
    }
  }, [caches, map]);
  useEffect(() => {
    loader.load().then(() => {
      if (mapContainer.current) {
        const map = new google.maps.Map(mapContainer.current, {
          zoom: 13,
          styles: silverMap,
          center: {
            lat: LA_COORDS.lat,
            lng: LA_COORDS.lng,
          },
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
        console.log("polling");
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

  useEffect(() => {
    if (map && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = position.coords;
        map.setCenter({
          lat: pos.latitude,
          lng: pos.longitude,
        });
        const icon = {
          url: smiler.src,
          scaledSize: new google.maps.Size(20, 20),
        };
        // console.log(ethers.utils.formatBytes32String(pos.latitude.toString()));
        // console.log(ethers.utils.formatBytes32String(pos.longitude.toString()));
        const latLng = { lat: pos.latitude, lng: pos.longitude };
        const userMarker = new google.maps.Marker({
          position: latLng,
          map,
          icon,
          draggable: true,
        });
        console.log(position);
        getMarker(`img[src='${smiler.src}']`).then((marker: any) => {
          console.log(marker);
          marker.classList.add("pulse");
          marker.classList.add("user-marker");
        });
        userRef.current = latLng;
        navigatorRef.current = position;
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [map]);

  return <div ref={mapContainer} style={{ height: "100vh" }}></div>;
}
