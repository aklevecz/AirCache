import { useEffect, useMemo, useRef, useState } from "react";
import { getCachesByGroup } from "../libs/api";
import { seoConfig } from "../libs/config";
import eggIcon from "../assets/icons/egg2.png";
import blankEggIcon from "../assets/icons/egg.png";
import { AIRCACHE_ADDRESS } from "../libs/constants";

// This gathers the markers and updates them
// The markerRef holds the references to the map markers and updates if they exist or creates new ones
// This could probably be wrapped into the more map oriented spaces
export default function useCacheMarkers(
  groupName: string,
  map: any,
  c: any[],
  huntMeta: any,
  nftMetadata: any,
  modal: any
) {
  const [caches, setCaches] = useState(c);
  const markersRef = useRef<any[]>([]);

  const mapMeta: any = useMemo(() => {
    let mapMeta = huntMeta;
    if (mapMeta) {
      const latLngSplit = mapMeta.location.split(", ");
      const lat = parseFloat(latLngSplit[0]);
      const lng = parseFloat(latLngSplit[1]);
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
            const nft = nftMetadata.find(
              (nft: any) => nft.tokenId === cache.tokenId && cache.tokenAddress === nft.tokenAddress
            );
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
    let icon = {
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
      console.log(nft);
      icon.url = nft.image;
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
    // @todo CHANGE
    index: number
  ) => {
    const icon = getIcon(tokenId, nft);
    const cacheMarker = new google.maps.Marker({
      position: { lat, lng },
      map,
      icon,
      // draggable: true,
    });

    (cacheMarker as any).cacheId = id;

    cacheMarker.addListener("click", () => {
      console.log(index);
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
        progContractTokenType: index + 1,
        groupName,
        NFT: {},
      });
    });
    return cacheMarker;
  };
  useEffect(() => {
    // Lots of redundancy here -- hmm what the hell was I doing here
    // basically this is what the whole hook does by waiting for cache updates and then updating the markers on the map accordinglin
    // markerRef just holds the references to the markers as they are on the map
    if (caches && caches.length && map) {
      if (markersRef.current.length === 0) map.setCenter(mapMeta.map_center);
      const markers: any[] = [];
      caches.forEach((cache, index) => {
        console.log(cache.tokenId, cache);
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
          // @todo CHANGE
          index
        );
        markers.push(marker);
      });
      markersRef.current = markers;
    }
  }, [caches, map]);
  return true;
}
