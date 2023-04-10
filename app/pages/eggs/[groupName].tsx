import { useEffect, useRef, useState } from "react";

import { Map } from "../../components/Map/Component";
import CacheContentModal from "../../components/Modals/CacheContent";
import useAirCache from "../../hooks/useAirCache";
import useAuth from "../../hooks/useAuth";
import useModal from "../../hooks/useModal";
import { cacheByGroupTableName } from "../../libs/constants";
import db from "../../libs/db";
import storage from "../../libs/storage";
import { Latlng, NFT } from "../../libs/types";
import Button from "../../components/Button";
import Locate from "../../components/Icons/Locate";

import BouncyEgg from "../../components/Loading/BouncyEgg";
import { isWordHunt } from "../../libs/utils";
import WordsUI from "../../components/WordsUI";
import useAlphabetCity from "../../hooks/useAlphabetCity";
import HeadHunt from "../../components/Head/Hunt";
import useUserLocation from "../../hooks/useUserLocation";
import useCacheMarkers from "../../hooks/useCacheMarkers";
import useProgression from "../../hooks/useProgression";
import useDateFilter from "../../hooks/useDateFilter";
import clsx from "clsx";
import FilterDate from "../../components/Filter/Date";

// Notes:
// Most of the things here need to wait for the map to initialize.
// Should probably have a better loading state for understanding that
// Or the Map should be the container and only load once it is loaded
type Props = {
  caches: any[];
  groupName: string;
  nftMetadata: any;
  huntMeta: any;
};

export default function Group({
  caches: c,
  groupName,
  nftMetadata,
  huntMeta,
}: Props) {
  const modal = useModal();
  const ctaModal = useModal();
  const airCache = useAirCache(null);
  const auth = useAuth();
  const [map, setMap] = useState<google.maps.Map>();
  const userPositionRef = useRef<any>(null);
  const positionRef = useRef<any>("");
  const { locationAllowed, fetchingLocation, initiateUserLocation } =
    useUserLocation(userPositionRef, positionRef, map);
  const { collected, updateCollected } = useProgression();
  // how to update marker after fetching the token
  const { filteredCaches, dates, filter, applyFilter } = useDateFilter(c);

  // for now will pass the filtered caches into this function for comparison, this way the filter logic can always live outside of this scope
  useCacheMarkers(
    groupName,
    map,
    c,
    huntMeta,
    nftMetadata,
    modal,
    collected,
    filteredCaches
  );

  const { user } = auth;

  const { word, letters } = useAlphabetCity();

  const initMap = (map: google.maps.Map) => {
    setMap(map);
  };

  useEffect(() => {
    if (map) {
      storage.setItem(storage.keys.current_group, groupName);
    }
  }, [map]);

  const centerMap = async () => {
    map!.setCenter(userPositionRef.current as Latlng);
  };

  const [loaded, setLoaded] = useState(true);
  useEffect(() => {
    if (map && navigator.geolocation && typeof window !== "undefined" && user) {
      // setTimeout(() => setLoaded(true), 5000);
      // initiateUserLocation();
    }
  }, [map, user]);

  return (
    <>
      <HeadHunt mapMeta={huntMeta} />
      <div className="absolute l-2 t-2 z-10">
        {collected.map((nft: NFT, i) => {
          return (
            <div key={nft.name + nft.tokenId + i} className="w-12 h-12">
              <img src={nft.image} />
            </div>
          );
        })}
      </div>

      {loaded && (
        <FilterDate dates={dates} applyFilter={applyFilter} filter={filter} />
      )}

      <Map initMap={initMap} map={map} user={auth.user} />

      {!locationAllowed &&
        (fetchingLocation ? (
          <BouncyEgg className="absolute right-[130px] top-[22px] z-[700] flex flex-col items-end" />
        ) : (
          <Button
            onClick={initiateUserLocation}
            className="recenter-button flex flex-col items-end"
            variant="maps-locate"
            title="center to location"
          >
            <Locate />
          </Button>
        ))}

      {locationAllowed && (
        <Button
          onClick={initiateUserLocation}
          className="recenter-button flex flex-col items-end"
          variant="maps-locate"
          title="center to location"
        >
          <Locate />
        </Button>
      )}

      <div
        ref={positionRef}
        style={{ display: "none" }}
        className="absolute bottom-20 w-full text-center l-50 text-red-500 z-50"
      />

      {!airCache.loading && (
        <CacheContentModal
          open={modal.open}
          toggleModal={modal.toggleModal}
          airCache={airCache}
          auth={auth}
          data={modal.data}
          updateCollected={updateCollected}
        />
      )}
      <WordsUI
        ctaModal={ctaModal}
        isWordHunt={isWordHunt(groupName)}
        letters={letters}
        word={word}
      />
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: ["/eggs/fools"],
    fallback: true,
  };
  const allCachesByGroup = await db
    .scan({ TableName: cacheByGroupTableName })
    .promise();

  const caches = allCachesByGroup.Items!.map((cache) => {
    return cache.groupName;
  });

  return {
    paths: caches.map((groupName) => `/eggs/${groupName}`) ?? [],
    fallback: true,
  };
}

type Params = {
  params: any;
};

// Could be in a bucket too... or fetched more live
export const getStaticProps = async ({ params }: Params) => {
  let { groupName } = params;
  const data: any = await import("../../libs/allHuntData.json");
  const mergedData = data[groupName].caches;
  const nftMetadata = data[groupName].nftMetadata;
  const huntMeta = data[groupName].metadata;
  return {
    props: {
      caches: mergedData,
      groupName: params.groupName,
      nftMetadata,
      huntMeta,
    },
  };
};

// const filterOutEmptyNYC = (cache: any) => {
//   if (nycDeleteList.includes(parseInt(cache!.cacheId))) {
//     return false;
//   }
//   return true;
// };
