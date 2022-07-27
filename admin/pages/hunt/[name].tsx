import { useRouter } from "next/router";
import { Map } from "../../components/Map/Component";
import { useMap } from "../../hooks/useMap";
import { AIRCACHE_ADDRESS, HUNT_CONFIG_S3 } from "../../libs/constants";
import { fetchAllGroups } from "../../libs/db";
import { parseLocationString } from "../../libs/utils";
import ErrorPage from "next/error";
import useWeb3Wallet from "../../hooks/useWeb3Wallet";
import { useWallet } from "../../contexts/WalletContext";
import { useEffect, useRef, useState } from "react";
import web3Api, { contract } from "../../libs/web3Api";
import { getCachesByGroup, onCreateCache } from "../../libs/api";
import { ethers } from "ethers";
import { Cache, LatLng } from "../../libs/types";
import useCachesByGroup from "../../hooks/useCachesByGroup";
import Modal from "../../components/Modal/Index";
import FillCache from "../../components/Modal/FillCache";

type Icons = {
  markerEmpty: string;
  markerFilled: string;
};

type Metadata = {
  name: string;
  description: string;
  location: string;
  icons: Icons;
};

const initialMetadata = {
  name: "",
  description: "",
  location: "",
  icons: { markerEmpty: "", markerFilled: "" },
};

type Props = {
  metadata: Metadata;
};

// const createCacheMarker = (lat: number, lng: number) => {
//   const icon = {
//     url: eggIcon.src,
//     scaledSize: new google.maps.Size(70, 70),
//   };
//   const cacheMarker = new google.maps.Marker({
//     position: { lat, lng },
//     map,
//     icon,
//     draggable: true,
//   });

//   createCacheMarkerRef.current! = cacheMarker;

//   cacheMarker.addListener("drag", (e: any) => {
//     const lat = e.latLng.lat();
//     const lng = e.latLng.lng();
//     console.log(lat, lng);
//     createCachePositionRef.current = { lat, lng };
//   });
// };
console.log(
  ethers.utils.parseBytes32String(
    "0x33342e3038333236333934303730343932000000000000000000000000000000"
  )
);
console.log(
  ethers.utils.parseBytes32String(
    "0x2d3131382e323137393435343639333133353500000000000000000000000000"
  )
);

const getSelectedCache = (caches: Cache[], selectedCache: string) =>
  caches.find((cache) => cache.cacheId === selectedCache);

export default function Hunt({ metadata }: Props) {
  const wallet = useWallet();
  const router = useRouter();
  const caches = useCachesByGroup(metadata.name);
  const createMarkerRef = useRef<google.maps.Marker>();
  const createMarkerPositionRef = useRef<LatLng>();

  const [selectedCache, setSelectedCache] = useState("");

  const [mapCenter, setMapCenter] = useState("");

  const modal = useRef<any>(null);

  if (!router.isFallback && !metadata) {
    return <ErrorPage statusCode={404} />;
  }

  const location = metadata ? metadata.location : "0,0";
  // Could contain this in another component to be less ugly
  const { map, mapContainerRef, createDragMarker, createStaticMarker } = useMap(
    {
      center: parseLocationString(location),
    }
  );
  const onCreateMarker = () => {
    const pos = parseLocationString(location);

    createDragMarker(
      metadata.icons.markerEmpty,
      70,
      pos.lat,
      pos.lng,
      createMarkerRef,
      createMarkerPositionRef
    );
  };

  const onCreate = async () => {
    // const pos = parseLocationString(metadata.location);
    const pos = createMarkerPositionRef.current;
    const provider = wallet.web3Wallet.metaMask.provider;
    if (provider && pos) {
      const groupName = metadata.name;
      const success = await web3Api.createCache(pos.lat, pos.lng, provider);

      if (success) {
        createMarkerRef.current!.setMap(null);
        createMarkerPositionRef.current = undefined;
        const cacheId = (await contract.cacheId()).toNumber();

        const res = await onCreateCache(
          groupName,
          cacheId,
          pos.lat,
          pos.lng,
          AIRCACHE_ADDRESS,
          ""
        );
        console.log(res);
        caches.mutate();
      }
    }
  };

  useEffect(() => {
    if (map && caches.data && caches.data.caches.length > 0) {
      // getCachesByGroup(metadata.name).then(({ caches }) => {
      caches.data.caches.forEach((cache: Cache) => {
        const isCacheFilled = cache.tokenId;
        createStaticMarker(
          isCacheFilled
            ? metadata.icons.markerFilled
            : metadata.icons.markerEmpty,
          70,
          {
            lat: parseFloat(cache.lat),
            lng: parseFloat(cache.lng),
          },
          () => {
            if (isCacheFilled) {
              alert("Cache is currently filled");
            } else {
              setSelectedCache(cache.cacheId);
              modal.current.open();
            }
          }
          // {
          //   id: cache.cacheId,
          //   tokenId: cache.tokenId,
          //   tokenAddress: cache.tokenAddress,
          //   position: [cache.lat, cache.lng],
          // }
        );
      });
      // web3Api.getCache(cacheId).then((c) => {
      //   console.log(ethers.utils.parseBytes32String(c.lat));
      // });
      // });
    }
  }, [map, caches.data]);

  useEffect(() => {
    try {
      const ll = mapCenter.trim().split(",");
      const lat = parseFloat(ll[0]);
      const lng = parseFloat(ll[1]);
      console.log(lat, lng);
    } catch (e) {
      console.log(e);
    }
  }, [mapCenter]);

  return (
    <div className="h-full w-full">
      {caches.data && (
        <Modal ref={modal}>
          <FillCache
            cache={getSelectedCache(caches.data.caches, selectedCache)}
            ownerAddress={wallet.web3Wallet.metaMask.accounts[0]}
            provider={wallet.web3Wallet.metaMask.provider}
            huntName={metadata.name}
            mutate={caches.mutate}
          />
        </Modal>
      )}
      <img
        onClick={onCreateMarker}
        className="absolute left-10 top-50 z-50"
        src={metadata.icons.markerFilled}
      />
      <input
        value={mapCenter}
        onChange={(e: any) => setMapCenter(e.currentTarget.value)}
      />
      <Map ref={mapContainerRef} />
      <button onClick={onCreate} className="absolute bottom-10 left-1/2">
        Create
      </button>
    </div>
  );
}

export async function getStaticPaths() {
  const hunts = await fetchAllGroups();
  return {
    paths: hunts.map((hunt) => `/hunt/${hunt.name}`) ?? [],
    fallback: true,
  };
}

type Params = {
  params: any;
};

// Maybe should be get ServerSideProps
export const getStaticProps = async ({ params }: Params) => {
  const { name } = params;
  const url = `${HUNT_CONFIG_S3}/${name}/metadata.json`;
  // const metadata = await fetch(url)
  //   .then((r) => r.json())
  //   .catch((e) => {
  //     console.log(`The metadata for ${name} is missing...`);
  //   });
  // if (!metadata) {
  //   return {
  //     notFound: true,
  //   };
  // }
  const metadata = {
    name: "only-gems",
    creator: "ariel",
  };
  console.log(metadata);
  return {
    props: { metadata: metadata ?? initialMetadata },
  };
};
