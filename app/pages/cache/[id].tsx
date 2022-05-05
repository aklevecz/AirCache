import { ethers } from "ethers";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import FullCenter from "../../components/Layout/FullCenter";
import FullScreenSpinner from "../../components/Loading/FullScreenSpinner";
import Map from "../../components/Map";
import CacheContentModal from "../../components/Modals/CacheContent";
import useAirCache from "../../hooks/useAirCache";
import useAuth from "../../hooks/useAuth";
import useModal from "../../hooks/useModal";
import { ipfsToPinata } from "../../libs/utils";
import web3Api from "../../libs/web3Api";

const Cache: NextPage = (props: any) => {
  // console.log(props);
  const router = useRouter();
  // const { id: cache } = router.query;
  const cache = props;
  const markerPosition = useRef<{ lat: number; lng: number }>(null);
  const auth = useAuth();
  const airCache = useAirCache(cache.id as string);
  const modal = useModal();

  // useEffect(() => {
  //   if (auth.user === null) {
  //     router.push({ pathname: "/login", query: { cache } });
  //   }
  // }, [auth.user]);

  useEffect(() => {
    if (airCache.web3Ready) {
      airCache.collectCacheMeta();
    }
  }, [airCache.web3Ready]);

  if (auth.user === undefined) {
    return (
      <FullCenter>
        <Head>
          <title>
            {props.id} - {props.NFT ? props.NFT.name : "empty egg"}
          </title>
          <meta
            property="og:description"
            content={`An egg with ${
              props.NFT ? props.NFT.name : "nothing"
            } inside!`}
          />
          <meta
            property="og:image"
            content={`${
              props.NFT
                ? ipfsToPinata(props.NFT.image)
                : "https://eggs.raptor.pizza/egg.png"
            }`}
          />
        </Head>
        <div className="text-4xl">Loading...</div>
        <FullScreenSpinner />
      </FullCenter>
    );
  }

  //   if (auth.user === null) {
  //     return (
  //       <FullCenter>
  //         <Login login={auth.login} logout={auth.logout} />
  //       </FullCenter>
  //     );
  //   }

  if (!cache) {
    return <div>loading...</div>;
    //   <div className="relative h-full">
    //     {/* <div className="absolute w-full bg-black z-10">
    //       <div className="overflow-hidden">{auth.user.publicAddress}</div>
    //     </div> */}
    //     <Map
    //       // caches={airCache.caches}
    //       caches={props}
    //       markerPosition={markerPosition}
    //       toggleModal={modal.toggleModal}
    //       showEmpty={false}
    //       user={auth.user}
    //     />
    //     {airCache.loading && <FullScreenSpinner />}
    //   </div>;
  }

  //   const cacheInfo = airCache.caches && airCache.caches[0];
  //   const emptyCache = cacheInfo && cacheInfo.tokenId === 0;

  // I COULD JUST SET THE NFT META DATA FROM THE STATIC PARAMS
  return (
    <div className="relative h-full">
      <Head>
        <title>
          {props.id} - {props.NFT ? props.NFT.name : "empty egg"}
        </title>
        <meta
          property="og:description"
          content={`An egg with ${
            props.NFT ? props.NFT.name : "nothing"
          } inside!`}
        />
        <meta
          property="og:image"
          content={`${
            props.NFT
              ? ipfsToPinata(props.NFT.image)
              : "https://eggs.raptor.pizza/egg.png"
          }`}
        />
      </Head>
      {/* <div className="absolute w-full bg-black z-10">
        <div className="overflow-hidden">{auth.user.publicAddress}</div>
      </div> */}
      <Map
        // caches={airCache.caches}
        user={auth.user}
        caches={[props]}
        markerPosition={markerPosition}
        toggleModal={modal.toggleModal}
        showEmpty={false}
        singleCache={true}
      />

      {!airCache.loading && props && (
        <CacheContentModal
          open={modal.open}
          toggleModal={modal.toggleModal}
          airCache={airCache}
          auth={auth}
          data={modal.data}
        />
      )}
      {airCache.loading && <FullScreenSpinner />}
    </div>
  );
};

export default Cache;

export async function getStaticPaths() {
  const caches = await web3Api.getAllCaches();
  return {
    paths: caches.map((cache) => `/cache/${cache.id.toNumber()}`) ?? [],
    fallback: true,
  };
}

type Params = {
  params: any;
};
export const getStaticProps = async ({ params }: Params) => {
  const cache = await web3Api.getCache(parseInt(params.id));
  const { id, lat, lng, tokenId, tokenAddress } = cache;
  const tokenIdNumber = tokenId.toNumber();
  let NFT = null;
  if (tokenIdNumber) {
    NFT = await web3Api.getNFTMeta(tokenId.toNumber(), tokenAddress);
  }
  return {
    props: {
      id: id.toNumber(),
      lat: parseFloat(ethers.utils.parseBytes32String(lat)),
      lng: parseFloat(ethers.utils.parseBytes32String(lng)),
      tokenId: tokenId.toNumber(),
      tokenAddress,
      NFT,
    },
  };
};
