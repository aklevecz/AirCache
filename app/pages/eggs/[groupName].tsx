import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import eggIcon from "../../assets/icons/egg2.png";
import blankEggIcon from "../../assets/icons/egg.png";
import { Map } from "../../components/Map/Component";
import { getMarker } from "../../components/Map/utils";
import CacheContentModal from "../../components/Modals/CacheContent";
import useAirCache from "../../hooks/useAirCache";
import useAuth from "../../hooks/useAuth";
import useModal from "../../hooks/useModal";
import { AIRCACHE_ADDRESS, cacheByGroupTableName } from "../../libs/constants";
import db from "../../libs/db";
import storage from "../../libs/storage";
import { Latlng } from "../../libs/types";
import smiler from "../../assets/icons/smiler.svg";
import Button from "../../components/Button";
import Locate from "../../components/Icons/Locate";
import web3Api from "../../libs/web3Api";

import nycEggMeta from "../../nycMeta.json";
import { getCachesByGroup } from "../../libs/api";
import { seoConfig } from "../../libs/config";
import BlackWrappedSpinner from "../../components/Loading/BlackWrappedSpinner";
import { isWordHunt } from "../../libs/utils";
import AlphabetCTA from "../../components/Modals/AlphabetCTA";

const nycDeleteList = [
  64, 71, 90, 102, 103, 97, 92, 80, 66, 60, 68, 82, 87, 99, 75, 58, 72, 79, 63,
  109,
];

// Notes:
// Most of the things here need to wait for the map to initialize.
// Should probably have a better loading state for understanding that
// Or the Map should be the container and only load once it is loaded
type Props = { caches: any[]; groupName: string; nftMetadata: any };

export default function Group({ caches: c, groupName, nftMetadata }: Props) {
  const modal = useModal();
  const ctaModal = useModal();
  const [map, setMap] = useState<google.maps.Map>();
  const airCache = useAirCache(null);
  const auth = useAuth();
  const router = useRouter();

  // Note: maybe this needs a context
  const [caches, setCaches] = useState(c);
  const markersRef = useRef<any[]>([]);

  //word stuff - could be in its own hook
  const [word, setWord] = useState<string>("");
  const [letters, setLetters] = useState<string>("");

  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState(false);

  const { user } = auth;

  const inputRef = useRef<HTMLInputElement>(null);

  const positionRef = useRef<any>("");

  const head = seoConfig[groupName] ?? {};

  const initMap = (map: google.maps.Map) => {
    setMap(map);
  };

  const userRef = useRef<any>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const userPositionRef = useRef<any>(null);

  const onWordWon = (winner: any, word: any, event: any) => {
    if (winner === auth.user.publicAddress) {
      alert(`You won the word! Congratz!`);
    }
  };

  const refreshMarkers = () => {
    getCachesByGroup(groupName).then((data) => {
      let caches = data.caches;
      setCaches(
        caches.map((cache: any) => {
          const data: any = cache;
          if (cache.tokenId) {
            // To do: too specific to NYC
            const nft = nftMetadata.find(
              (nft: any) =>
                nft.tokenId === cache.tokenId &&
                cache.tokenAddress === nft.tokenAddress
            );
            data.nft = nft;
          }
          return data;
        })
      );
    });
  };

  useEffect(() => {
    if (map) {
      storage.setItem(storage.keys.current_group, groupName);

      // const locationAllowed = storage.getItem(storage.keys.has_located);

      // if (locationAllowed && JSON.parse(locationAllowed)) {
      //   initiateUserLocation();
      //   setLocationAllowed(true);
      // }
    }
  }, [map]);

  useEffect(() => {
    if (!modal.open && groupName) refreshMarkers();
    // To do: Naive and does not scale
  }, [modal.open, groupName]);

  useEffect(() => {
    const hunt = router.query.groupName;
    // To do: better reducer for different hunts
    if (isWordHunt(hunt as string)) {
      web3Api.getCurrentWord().then(setWord);
      if (auth.user && auth.user.publicAddress) {
        web3Api
          .getAccountsCurrentLetters(auth.user.publicAddress)
          .then((letters) => {
            setLetters(letters);
          });

        web3Api.alphabetCityContract.on("WordWon", onWordWon);
      }
    }

    return () => {
      if (auth.user && auth.user.publicAddress) {
        web3Api.alphabetCityContract.off("WordWon", onWordWon);
      }
    };
  }, [router, auth.user]);

  const centerMap = async () => {
    map!.setCenter(userPositionRef.current as Latlng);
  };

  const getUserLocation = () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          userPositionRef.current = latLng;
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

  // USER LOCATION STUFF --- MAYBE MOVE INTO ITS OWN HOOK??

  const updateUserMarker = async () => {
    if (userRef.current) {
      const position = await getUserLocation();
      if (position && userMarkerRef.current) {
        userMarkerRef.current.setPosition(position as Latlng);
        storage.setItem(storage.keys.user_location, JSON.stringify(position));
        try {
          positionRef.current.innerHTML = JSON.stringify(position);
        } catch (e) {}
        // map!.setCenter(position as Latlng);
      }
    }
  };

  useEffect(() => {
    let interval: any;
    if (locationAllowed) {
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
            // navigatorRef.current = position;
            storage.setItem(storage.keys.user_location, JSON.stringify(latLng));
            storage.setItem(storage.keys.has_located, JSON.stringify(true));
            resolve(true);
            setLocationAllowed(true);
            setFetchingLocation(false);
            // map?.setCenter(latLng);
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

  useEffect(() => {
    if (map && navigator.geolocation && typeof window !== "undefined" && user) {
      // initiateUserLocation();
    }
  }, [map, user]);

  // useEffect(() => {
  //   let id = 0;
  //   if (locationAllowed) {
  //     id = navigator.geolocation.watchPosition(
  //       function (position) {
  //         if (userMarkerRef.current && position) {
  //           const latLng = {
  //             lat: position.coords.latitude,
  //             lng: position.coords.longitude,
  //           };
  //           userMarkerRef.current.setPosition(latLng as Latlng);

  //           userPositionRef.current = latLng;
  //           console.log("i'm tracking you!");
  //         }
  //       },
  //       function (error) {
  //         if (error.code == error.PERMISSION_DENIED)
  //           console.log("you denied me :-(");
  //         storage.setItem(storage.keys.has_located, JSON.stringify(false));
  //       }
  //     );
  //   }
  //   return () => {
  //     navigator.geolocation.clearWatch(id);
  //   };
  // }, [locationAllowed]);

  // *** END USER LOCATION STUFF --- MAYBE MOVE INTO ITS OWN HOOK?? ****

  const getIcon = (tokenId: number, nft: any) => {
    let icon = {
      url: tokenId ? eggIcon.src : blankEggIcon.src,
      scaledSize: new google.maps.Size(40, 40),
    };
    if (head.icon && head.icon.image) {
      icon = {
        url: tokenId ? head.icon.image.filled.src : head.icon.image.empty.src,
        scaledSize: new google.maps.Size(40, 40),
      };
    } else {
    }

    if (nft) {
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
    nft: any
  ) => {
    const icon = getIcon(tokenId, nft);
    if (nft) {
      console.log(icon);
    }
    const cacheMarker = new google.maps.Marker({
      position: { lat, lng },
      map,
      icon,
      // draggable: true,
    });

    (cacheMarker as any).cacheId = id;

    // SOLANA
    // - if Solana then also send the token information here (or in the modal?)
    cacheMarker.addListener("click", () => {
      modal.toggleModal({
        cache: {
          id,
          contractAddress,
          location: { lat, lng },
          callback: refreshMarkers,
        },
        groupName,
        NFT: {},
      });
    });
    return cacheMarker;
  };
  useEffect(() => {
    // Lots of redundancy here
    if (caches && caches.length && map) {
      if (markersRef.current.length === 0) map.setCenter(head.map_center);
      const markers: any[] = [];
      caches.forEach((cache) => {
        const markerExists = markersRef.current.find(
          (marker) => marker.cacheId === cache.cacheId
        );
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
          cache.nft
        );
        markers.push(marker);
      });
      markersRef.current = markers;
    }
  }, [caches, map]);
  return (
    <>
      <Head>
        <title>{head.title}</title>
        <meta property="og:title" content={head.title} />
        <meta property="og:description" content={head.description} />
        <meta property="og:image" content={head.image} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image" content={head.image} />
        <meta name="twitter:title" content={head.title} />
        <meta name="twitter:text:title" content={head.title} />
      </Head>

      <div className="absolute bottom-44 w-full text-center z-50 text-xl pointer-events-none flex justify-center">
        {Array.from(letters).map((letter) => {
          return (
            <div className="bg-red-500 w-10 h-10 font-fatfrank text-2xl tracking-widest uppercase m-2 flex justify-center items-center">
              {letter}
            </div>
          );
        })}
      </div>
      {!locationAllowed && (
        <div
          className="absolute"
          style={{
            left: 0,
            top: 20,
            width: "100%",
            zIndex: 999,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button className="font-fatfrank w-40" onClick={initiateUserLocation}>
            {fetchingLocation ? <BlackWrappedSpinner /> : "Track My Location"}
          </Button>
        </div>
      )}
      <Map initMap={initMap} map={map} user={auth.user} />
      {locationAllowed && (
        <Button
          onClick={centerMap}
          className="recenter-button"
          style={{ display: "flex" }}
        >
          Recenter <Locate />
        </Button>
      )}
      {word && (
        <div className="absolute bottom-28 w-full text-center z-50 text-xl pointer-events-none w-full text-white font-fatfrank">
          {/* <span className="bg-black p-5 font-fatfrank w-full"> */}
          <div className="underline">Solve</div>
          <div style={{ fontSize: "2rem" }}>{word}</div>
          {/* </span> */}
        </div>
      )}
      <div
        ref={positionRef}
        style={{ display: "none" }}
        className="absolute bottom-20 w-full text-center l-50 text-red-500 z-50"
      ></div>
      {isWordHunt(groupName) && (
        <AlphabetCTA open={ctaModal.open} toggleModal={ctaModal.toggleModal} />
      )}
      {!airCache.loading && (
        <CacheContentModal
          open={modal.open}
          toggleModal={modal.toggleModal}
          airCache={airCache}
          auth={auth}
          data={modal.data}
        />
      )}
    </>
  );
}

export async function getStaticPaths() {
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

const filterOutEmptyNYC = (cache: any) => {
  if (nycDeleteList.includes(parseInt(cache!.cacheId))) {
    return false;
  }
  return true;
};

export const getStaticProps = async ({ params }: Params) => {
  let { groupName } = params;

  //patch
  // groupName = groupName === "myosin-yacht" ? "blackbeard" : groupName;

  const dbparams = {
    TableName: "cache-by-group",
    ExpressionAttributeValues: {
      ":g": groupName,
    },
    // IndexName: "groupName-index",
    FilterExpression: "groupName = :g",
  };
  const dbRes = await db.scan(dbparams).promise();
  let caches = dbRes.Items!;

  // if (groupName === "nft-nyc") caches = caches!.filter(filterOutEmptyNYC);

  // Do this before the buildstep to create a config then have all of the cache calls read from it
  // Note: What should it do if there are no caches?
  // if (caches) {
  //   for (let i = 0; i < caches.length; i++) {
  //     const cacheData = await web3Api.getCache(caches[i].cacheId);
  //     caches[i].tokenAddress = cacheData.tokenAddress;
  //     caches[i].tokenId = cacheData.tokenId.toNumber();
  //   }
  // }
  // fs.writeFileSync("./data.json", JSON.stringify(caches));

  // const metas = [];
  // for (let i = 0; i < nycEggData.length; i++) {
  //   const egg = nycEggData[i];
  //   if (egg.tokenId) {
  //     const meta = await web3Api.getNFTMeta(egg.tokenId, egg.tokenAddress);
  //     metas.push({
  //       ...meta,
  //       tokenId: egg.tokenId,
  //       tokenAddress: egg.tokenAddress,
  //     });
  //   }
  // }
  // fs.writeFileSync("nycMeta.json", JSON.stringify(metas));
  const mergedData = [];
  const nftMetadata = [];
  // const mergedData = caches.map(async (cache) => {
  for (let i = 0; i < caches.length; i++) {
    const cache = caches[i];
    let data: any = cache;
    if (cache.tokenId && isWordHunt(groupName)) {
      const meta = await web3Api.getNFTMeta(cache.tokenId, cache.tokenAddress);
      var nft = {
        ...meta,
        tokenId: cache.tokenId,
        tokenAddress: cache.tokenAddress,
      };
      nftMetadata.push(nft);
      // const nft = nycEggMeta.find(
      //   (nft) =>
      //     nft.tokenId === cache.tokenId &&
      //     cache.tokenAddress === nft.tokenAddress
      // );
      data.nft = nft;
    }
    mergedData.push(data);
    // return data;
  }
  return {
    props: { caches: mergedData, groupName: params.groupName, nftMetadata },
  };
};
