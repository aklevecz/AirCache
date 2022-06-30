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

const nycDeleteList = [
  64, 71, 90, 102, 103, 97, 92, 80, 66, 60, 68, 82, 87, 99, 75, 58, 72, 79, 63,
  109,
];

type Props = { caches: any[]; groupName: string };
export default function Group({ caches: c, groupName }: Props) {
  const modal = useModal();
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

  const { user } = auth;

  const inputRef = useRef<HTMLInputElement>(null);

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
      if (groupName === "nft-nyc") caches = caches.filter(filterOutEmptyNYC);
      setCaches(
        caches.map((cache: any) => {
          const data: any = cache;
          if (cache.tokenId) {
            // To do: too specific to NYC
            const nft = nycEggMeta.find(
              (nft) =>
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
    if (!modal.open) refreshMarkers();
    // To do: Naive and does not scale
  }, [modal.open]);

  useEffect(() => {
    const hunt = router.query.groupName;
    // To do: better reducer for different hunts
    if (hunt === "nft-nyc") {
      web3Api.getCurrentWord().then(setWord);
      if (auth.user && auth.user.publicAddress) {
        web3Api
          .getAccountsCurrentLetters(auth.user.publicAddress)
          .then(setLetters);

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
      navigator.geolocation.getCurrentPosition((position) => {
        const latLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        userPositionRef.current = latLng;
        resolve(latLng);
      });
    });
  };

  const updateUserMarker = async () => {
    if (userRef.current) {
      const position = await getUserLocation();
      if (position && userMarkerRef.current) {
        userMarkerRef.current.setPosition(position as Latlng);
        // map!.setCenter(position as Latlng);
      }
    }
  };

  useEffect(() => {
    let interval: any;
    if (user) {
      interval = setInterval(updateUserMarker, 3000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [user]);

  useEffect(() => {
    if (map && navigator.geolocation && typeof window !== "undefined" && user) {
      try {
        navigator.geolocation.getCurrentPosition((position) => {
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
        });
      } catch (e) {
        console.error("Geolocation error");
      }
    }
  }, [map, user]);

  const getIcon = (tokenId: number, nft: any) => {
    console.log(tokenId, nft);
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
    console.log(icon);
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
    console.log(tokenId, nft);
    const icon = getIcon(tokenId, nft);
    console.log(icon);
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
      console.log(markersRef.current);
      if (markersRef.current.length === 0) map.setCenter(head.map_center);
      const markers: any[] = [];
      caches.forEach((cache) => {
        const markerExists = markersRef.current.find(
          (marker) => marker.cacheId === cache.cacheId
        );
        if (markerExists) {
          const icon = getIcon(cache.tokenId, cache.nft);
          console.log("chaning icon");
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
      console.log(markersRef.current);
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
      {word && (
        <div className="absolute bottom-28 w-full text-center z-50 text-xl pointer-events-none">
          <span className="bg-black p-5 font-fatfrank">
            Spell:
            <span style={{ fontSize: "2rem", marginLeft: 10 }}>{word}</span>
          </span>
        </div>
      )}
      <div className="absolute bottom-44 w-full text-center z-50 text-xl pointer-events-none">
        {letters && (
          <span className="bg-red-500 px-5 py-2 font-fatfrank text-2xl tracking-widest">
            {letters}
          </span>
        )}
      </div>
      <Map initMap={initMap} map={map} user={auth.user} />
      {user && (
        <Button
          onClick={centerMap}
          className="recenter-button"
          style={{ display: "flex" }}
        >
          Recenter <Locate />
        </Button>
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
  console.log(allCachesByGroup);
  return {
    paths:
      allCachesByGroup.Items!.map((cache) => `/eggs/${cache.groupName}`) ?? [],
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
  const { groupName } = params;
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

  if (groupName === "nft-nyc") caches = caches!.filter(filterOutEmptyNYC);

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

  const mergedData = caches.map((cache) => {
    const data: any = cache;
    if (cache.tokenId && groupName === "nft-nyc") {
      const nft = nycEggMeta.find(
        (nft) =>
          nft.tokenId === cache.tokenId &&
          cache.tokenAddress === nft.tokenAddress
      );
      data.nft = nft;
    }
    return data;
  });
  return {
    props: { caches: mergedData, groupName: params.groupName },
  };
};
