import { Loader } from "@googlemaps/js-api-loader";
import React, { useEffect, useRef, useState } from "react";
import darkMap from "../assets/map-style/dark-map.json";
import { LatLng } from "../libs/types";

const cityCenters = {
  palmBeach: { lat: 26.70605988106027, lng: -80.04643388959501 },
  austin: { lat: 30.27317532798779, lng: -97.74452745161928 },
  alphabet_city: { lat: 40.72563642453208, lng: -73.97979855792384 },
  hudson_river: { lat: 40.70851962382408, lng: -74.01021772654222 },
  prospect_park: { lat: 40.66103384799173, lng: -73.9698999374802 },
  la: { lat: 34.08326394070492, lng: -118.21794546931355 },
  venice_beach: { lat: 33.9946586623243, lng: -118.48187211490418 },
};

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GMAP_KEY as string,
  version: "weekly",
});

type Props = {
  center: LatLng;
};

export const useMap = ({ center = cityCenters.la }: Props) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const createDragMarker = (
    imgUrl: string,
    scale = 70,
    lat: number,
    lng: number,
    markerRef: React.MutableRefObject<any>,
    positionRef: React.MutableRefObject<any>
  ) => {
    const icon = {
      url: imgUrl,
      scaledSize: new google.maps.Size(scale, scale),
    };
    const cacheMarker = new google.maps.Marker({
      position: { lat, lng },
      map,
      // icon,
      draggable: true,
      zIndex: 999,
    });

    markerRef.current! = cacheMarker;
    cacheMarker.addListener("drag", (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      positionRef.current = { lat, lng };
    });
  };

  const createStaticMarker = (imgUrl: string, scale = 70, position: LatLng, callback: () => void) => {
    const icon = {
      url: imgUrl,
      scaledSize: new google.maps.Size(scale, scale),
      origin: new google.maps.Point(0, -14),
      // anchor: new google.maps.Point(10, 0),
    };
    const cacheMarker = new google.maps.Marker({
      position,
      map,
      icon,
      draggable: false,
    });
    cacheMarker.addListener("click", () => {
      callback();
    });
    return cacheMarker;
  };

  const initMap = () => {
    loader.load().then(() => {
      if (mapContainerRef.current) {
        // const last_location = storage.getItem(storage.keys.user_location);
        // const center = last_location
        //   ? JSON.parse(last_location)
        //   : { lat: LA_COORDS.lat, lng: LA_COORDS.lng };
        const map = new google.maps.Map(mapContainerRef.current, {
          zoom: 16,
          styles: darkMap,
          center,
        });
        setMap(map);
        map.setCenter(center);
      }
    });
  };
  useEffect(() => {
    initMap();
  }, [mapContainerRef]);

  // useEffect(() => {
  //   if (map && center) {
  //     map.setCenter(center);
  //   }
  // }, [center, map]);

  return { map, mapContainerRef, createDragMarker, createStaticMarker };
};
