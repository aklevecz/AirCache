import { useEffect, useMemo, useRef, useState } from "react";
import { getCachesByGroup } from "../libs/api";
import { seoConfig } from "../libs/config";
import eggIcon from "../assets/icons/egg2.png";
import blankEggIcon from "../assets/icons/egg.png";
import { AIRCACHE_ADDRESS } from "../libs/constants";
import { NFT } from "../libs/types";
import { getMarker } from "../components/Map/utils";

// This gathers the markers and updates them
// The markerRef holds the references to the map markers and updates if they exist or creates new ones
// This could probably be wrapped into the more map oriented spaces
export default function useCacheMarkers(groupName: string, map: any, c: any[], huntMeta: any, nftMetadata: any, modal: any, collected: NFT[]) {
  const [caches, setCaches] = useState(c);
  const markersRef = useRef<any[]>([]);

  const mapMeta: any = useMemo(() => {
    let mapMeta = huntMeta;
    if (mapMeta) {
      const latLngSplit = mapMeta.location.split(",");
      const lat = parseFloat(latLngSplit[0].trim());
      const lng = parseFloat(latLngSplit[1].trim());
      mapMeta.map_center = { lat, lng };
      const { markerEmpty, markerFilled } = mapMeta.icons;
      mapMeta.icon = {
        image: {
          empty: { src: markerEmpty },
          filled: { src: markerFilled },
        },
      };
    }
    if (!mapMeta) {
      mapMeta = seoConfig[groupName] ?? {};
    }
    return mapMeta;
  }, [groupName]);

  const refreshMarkers = () => {
    getCachesByGroup(groupName).then((data) => {
      let caches = data.caches;
      setCaches(
        caches.map((cache: any) => {
          const data: any = cache;
          if (cache.tokenId) {
            const nft = nftMetadata.find((nft: any) => nft.tokenId === cache.tokenId && cache.tokenAddress === nft.tokenAddress);
            data.nft = nft;
          }
          return data;
        })
      );
    });
  };

  useEffect(() => {
    // don't refresh markers if prog -- or refresh them in a different way to show personal progression
    if (!modal.open && groupName && huntMeta.huntType !== "prog") refreshMarkers();
    // To do: Naive and does not scale
  }, [modal.open, groupName]);

  // Definition for the icon of a marker
  const getIcon = (tokenId: number, nft: any) => {
    let icon: google.maps.Icon = {
      url: tokenId ? eggIcon.src : blankEggIcon.src,
      scaledSize: new google.maps.Size(40, 40),
    };

    // Marker from the map metadata
    if (mapMeta.icon && mapMeta.icon.image) {
      icon = {
        url: tokenId ? mapMeta.icon.image.filled.src : mapMeta.icon.image.empty.src,
        scaledSize: new google.maps.Size(40, 40),
      };
    } else {
    }

    // Custom marker from the NFT metadata
    if (nft) {
      icon.url = nft.image + `#${nft.name}`;
      icon.size = new google.maps.Size(80, 80);
      icon.scaledSize = new google.maps.Size(40, 40);
      icon.anchor = new google.maps.Point(20, 20);
    }
    return icon;
  };

  const createCacheMarker = (
    lat: number,
    lng: number,
    id: number,
    contractAddress: string,
    tokenId: number,
    tokenAddress: string,
    nft: any,
    progContractTokenType: number
  ) => {
    const icon = getIcon(tokenId, nft);
    const cacheMarker = new google.maps.Marker({
      position: { lat, lng },
      map,
      icon,
      // draggable: true,
    });

    (cacheMarker as any).cacheId = id;
    (cacheMarker as any).nft = nft;
    cacheMarker.addListener("click", () => {
      console.log(progContractTokenType);
      modal.toggleModal({
        cache: {
          id,
          contractAddress,
          location: { lat, lng },
          callback: refreshMarkers,
        },
        huntType: huntMeta.huntType,
        progContract: huntMeta.contract,
        // @todo CHANGE
        progContractTokenType,
        groupName,
        NFT: {},
        // @todo check on this
        nft,
      });
    });
    return cacheMarker;
  };

  useEffect(() => {
    if (collected.length) {
      for (const nft of collected) {
        // @todo change image to type
        const marker = markersRef.current.find((marker) => marker.nft.image === nft.image);
        if (marker) {
          marker.setOpacity(0.5);
        }
      }
    }
  }, [collected]);

  useEffect(() => {
    // Lots of redundancy here -- hmm what the hell was I doing here
    // basically this is what the whole hook does by waiting for cache updates and then updating the markers on the map accordinglin
    // markerRef just holds the references to the markers as they are on the map

    const animate = (currentSize: number, newSize: number, direction: number) => {
      let size = currentSize;
      const expandEgg = (timestamp: number) => {
        size += 1 * direction;
        markersRef.current.map((marker) => {
          var icon = marker.getIcon();
          icon.scaledSize = new google.maps.Size(size, size);
          icon.anchor = new google.maps.Point(size / 2, size / 2);
          marker.setIcon(icon);
        });
        if (direction > 0) {
          if (size <= newSize) {
            requestAnimationFrame(expandEgg);
          }
        } else {
          if (size >= newSize) {
            requestAnimationFrame(expandEgg);
          }
        }
      };
      requestAnimationFrame(expandEgg);
    };
    let animating = false;
    const resizeMarker = () => {
      const currentSize = markersRef.current[0].getIcon().scaledSize.width;
      if (map.zoom < 13) {
        const size = 20;
        if (currentSize !== size && !animating) {
          animate(currentSize, size, -1);
        }
      } else {
        const size = 80;
        if (currentSize !== size && !animating) {
          animate(currentSize, size, 1);
        }
      }
    };
    if (caches && caches.length && map) {
      console.log(mapMeta);
      if (markersRef.current.length === 0) map.setCenter(mapMeta.map_center);
      const markers: any[] = [];
      caches.forEach((cache, index) => {
        const markerExists = markersRef.current.find((marker) => marker.cacheId === cache.cacheId);
        if (markerExists) {
          const icon = getIcon(cache.tokenId, cache.nft);
          markerExists.setIcon(icon);
          markers.push(markerExists);
          return;
        }
        const marker = createCacheMarker(
          parseFloat(cache.lat),
          parseFloat(cache.lng),
          cache.cacheId,
          cache.address ?? AIRCACHE_ADDRESS,
          cache.tokenId,
          cache.tokenAddress,
          cache.nft,
          // @todo CHANGE -- this is progContractTokenType
          cache.tokenId
        );
        markers.push(marker);
      });
      markersRef.current = markers;

      google.maps.event.addListener(map, "zoom_changed", resizeMarker);

      getMarker(`img[src='https://cdn.yaytso.art/magicmap/images/equalize.png#EQUALIZE NFT.NYC w/ BRUX + DOT']`).then((marker: any) => {
        if (marker) {
          marker.classList.add("shift");
        }
      });
    }

    return () => {
      try {
        // @ts-ignore
        google.maps.event.removeListener(map, "zoom_change", resizeMarker);
      } catch (e) {}
    };
  }, [caches, map]);
  return true;
}
