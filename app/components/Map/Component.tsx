import { forwardRef, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import silverMap from "../../assets/map-style/silver-map.json";
import darkMap from "../../assets/map-style/dark-map.json";
import storage from "../../libs/storage";
import { BAHAMA_COORDS, LA_COORDS } from "../../libs/constants";

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GMAP_KEY as string,
  version: "weekly",
});

type Props = {
  initMap: (map: google.maps.Map) => void;
  map: google.maps.Map | undefined;
};

export type Ref = HTMLDivElement;

export const Map = forwardRef<Ref, Props>(({ initMap, map }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  // const userRef = useRef<any>(null);
  // const navigatorRef = useRef<any>(null);

  useEffect(() => {
    loader.load().then(() => {
      if (mapContainer.current) {
        const last_location = storage.getItem(storage.keys.user_location);
        const center = last_location
          ? JSON.parse(last_location)
          : { lat: LA_COORDS.lat, lng: LA_COORDS.lng };
        const map = new google.maps.Map(mapContainer.current, {
          zoom: 10,
          styles: darkMap,
          center,
        });
        initMap(map);
      }
    });
  }, []);

  return (
    <div ref={mapContainer} style={{ height: "100%", width: "100%" }}></div>
  );
});
