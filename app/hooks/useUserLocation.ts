import { useEffect, useRef, useState } from "react";
import smiler from "../assets/icons/smiler.svg";
import { getMarker } from "../components/Map/utils";
import storage from "../libs/storage";
import { Latlng } from "../libs/types";

export default function useUserLocation(userPositionRef:any, positionRef:any, map:any) {
    const [fetchingLocation, setFetchingLocation] = useState(false);
    const [locationAllowed, setLocationAllowed] = useState(false);

    const userRef = useRef<any>(null);
    const userMarkerRef = useRef<google.maps.Marker | null>(null);
    const getUserLocation = () => {
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const latLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              userPositionRef.current = latLng;
              console.log(userPositionRef.current)
              resolve(latLng);
            },
            (e) => console.log(e),
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            }
          );
        });
      };
    
      const updateUserMarker = async () => {
        if (userRef.current) {
          const position = await getUserLocation();
          if (position && userMarkerRef.current) {
            userMarkerRef.current.setPosition(position as Latlng);
            storage.setItem(storage.keys.user_location, JSON.stringify(position));
            try {
              positionRef.current.innerHTML = JSON.stringify(position);
            } catch (e) {}
          }
        }
      };
    
      useEffect(() => {
        let interval: any;
        if (locationAllowed) {
            updateUserMarker()
            if (typeof window !== 'undefined' && window.innerWidth < 768)
          interval = setInterval(updateUserMarker, 500);
        }
    
        return () => {
          clearInterval(interval);
        };
      }, [locationAllowed]);
    
      const initiateUserLocation = () => {
        setFetchingLocation(true);
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // Maybe overkill
              if (!userMarkerRef.current) {
                const pos = position.coords;
                const icon = {
                  url: smiler.src,
                  scaledSize: new google.maps.Size(30, 30),
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
                storage.setItem(storage.keys.user_location, JSON.stringify(latLng));
                storage.setItem(storage.keys.has_located, JSON.stringify(true));
                resolve(true);
                setLocationAllowed(true);
                setFetchingLocation(false);
              }
            },
            function (error) {
              setFetchingLocation(false);
    
              if (error.message === "User denied Geolocation") {
                return alert(
                  "You must have denied access to your location at some point. This can only be remedied in your browser settings."
                );
              }
    
              return alert(
                "There was an error fetching your location. I'm not sure what it was, but please try again and/or check your browser settings"
              );
            }
          );
        });
      };
      
    return {locationAllowed, fetchingLocation, initiateUserLocation}
}