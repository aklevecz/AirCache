import { forwardRef, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import darkMap from "../../assets/map-style/dark-map.json";
import storage from "../../libs/storage";
import { LA_COORDS, NY_COORDS } from "../../libs/constants";
import { motion } from "framer-motion";
import { fadeInOut } from "../../motion/variants";

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GMAP_KEY as string,
  version: "weekly",
});

type Props = {
  initMap: (map: google.maps.Map) => void;
  map: google.maps.Map | undefined;
  user?: any;
};

export type Ref = HTMLDivElement;

export const Map = forwardRef<Ref, Props>(
  ({ initMap, map, user = undefined }, ref) => {
    const mapContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
      loader.load().then(() => {
        if (mapContainer.current) {
          const last_location = storage.getItem(storage.keys.user_location);
          const center = last_location
            ? JSON.parse(last_location)
            : { lat: NY_COORDS.lat, lng: NY_COORDS.lng };
          const map = new google.maps.Map(mapContainer.current, {
            zoom: 12,
            styles: darkMap,
            center,
          });
          initMap(map);
          // init show opacity animation
        }
      });
    }, []);

    return (
      <motion.div
        variants={fadeInOut}
        initial="initial"
        animate="animate"
        exit="exit"
        ref={mapContainer}
        style={{ height: "100%", width: "100%" }}
      />
    );
  }
);
