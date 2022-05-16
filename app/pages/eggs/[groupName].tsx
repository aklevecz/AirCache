import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import eggIcon from "../../assets/icons/egg2.png";
import { Map } from "../../components/Map/Component";
import CacheContentModal from "../../components/Modals/CacheContent";
import useAirCache from "../../hooks/useAirCache";
import useAuth from "../../hooks/useAuth";
import useModal from "../../hooks/useModal";
import { AIRCACHE_ADDRESS, FRONTEND_HOST } from "../../libs/constants";
import db from "../../libs/db";

const host =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://air.yaytso.art";
const seoConfig: { [key: string]: any } = {
  permissionless: {
    title: "Permissionless Egg Hunt",
    description:
      "Find eggs filled with NFT Pixeltrosses scattered around Palm Beach!",
    image: `${host}/permissionless_banner.png`,
    map_center: { lat: 26.70621060954564, lng: -80.03699564611513 },
  },
};

type Props = { caches: any[]; groupName: string };
export default function Group({ caches, groupName }: Props) {
  const modal = useModal();
  const [map, setMap] = useState<google.maps.Map>();
  const airCache = useAirCache(null);
  const auth = useAuth();

  const inputRef = useRef<HTMLInputElement>(null);

  const head = seoConfig[groupName] ?? {};

  const initMap = (map: google.maps.Map) => {
    setMap(map);
  };

  const createCacheMarker = (
    lat: number,
    lng: number,
    id: number,
    contractAddress: string
  ) => {
    const icon = {
      url: eggIcon.src,
      scaledSize: new google.maps.Size(40, 40),
    };
    const cacheMarker = new google.maps.Marker({
      position: { lat, lng },
      map,
      icon,
      draggable: true,
    });

    cacheMarker.addListener("click", () => {
      modal.toggleModal({
        cache: { id, contractAddress, location: { lat, lng } },
        NFT: {},
      });
    });
  };
  useEffect(() => {
    if (caches && caches.length && map) {
      console.log(head.map_center);
      map.setCenter(head.map_center);
      caches.forEach((cache) => {
        createCacheMarker(
          parseFloat(cache.lat),
          parseFloat(cache.lng),
          cache.cacheId,
          cache.address ?? AIRCACHE_ADDRESS
        );
      });
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

      <Map initMap={initMap} map={map} />
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
    .scan({ TableName: "cache-by-group" })
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
export const getStaticProps = async ({ params }: Params) => {
  // console.log("static params", params);
  // const host =
  //   process.env.NODE_ENV === "development"
  //     ? "http://localhost:3000"
  //     : "https://air.yaytso.art";
  // const res = await axios.get(host + "/api/get-caches-by-group", {
  //   params: { groupName: params.groupName },
  // });
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
  const caches = dbRes.Items;
  return {
    props: { caches, groupName: params.groupName },
  };
};
