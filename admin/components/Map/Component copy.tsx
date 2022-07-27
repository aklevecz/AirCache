import { forwardRef, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import darkMap from "../../assets/map-style/dark-map.json";
// import storage from "../../libs/storage";
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
          // const last_location = storage.getItem(storage.keys.user_location);
          // const center = last_location
          //   ? JSON.parse(last_location)
          //   : { lat: LA_COORDS.lat, lng: LA_COORDS.lng };
          const map = new google.maps.Map(mapContainer.current, {
            zoom: 16,
            styles: darkMap,
            center: cityCenters.la,
          });
          initMap(map);
        }
      });
    }, []);

    return (
      <div ref={mapContainer} style={{ height: "100%", width: "100%" }}></div>
    );
  }
);
