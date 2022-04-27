import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { claimCache } from "../../libs/api";
import { Latlng } from "../../libs/types";
import Button from "../Button";
import Axe from "../Icons/Axe";
import Spinner from "../Loading/Spinner";
import Container from "./Container";
import { motion } from "framer-motion";
import Sad from "../Icons/Sad";
import AxeAnimation from "../Animations/Axe";
import { haversineDistance, ipfsToPinata, isIpfs } from "../../libs/utils";
import MapIcon from "../Icons/Map";

enum TxState {
  Idle,
  Fetching,
  Mining,
  Complete,
  Error,
}

type Props = {
  open: boolean;
  toggleModal: () => void;
  airCache: {
    contract: ethers.Contract | null;
    signer: ethers.Signer | null;
    getCache: (cacheId: number) => any;
    getNFTMeta: (tokenId: number, tokenAddress: string) => any;
  };
  auth: any;
  data: any;
};
export default function CacheContentModal({
  open,
  toggleModal,
  airCache,
  auth,
  data,
}: Props) {
  const [NFT, setNFT] = useState<any>(null);
  const [txState, setTxState] = useState<TxState>(TxState.Idle);
  const [txHash, setTxHash] = useState("");
  const [message, setMessage] = useState("");
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const fetchCache = async (cacheId: number) => {
    setFetchingMeta(true);
    const cache = await airCache.getCache(data.cache.id);
    console.log(cache);
    const tokenId = cache.tokenId;
    if (!tokenId) {
      setFetchingMeta(false);
      console.log("cache is empty");
    } else {
      console.log(tokenId, cache.tokenAddress);
      const nft = await airCache.getNFTMeta(tokenId, cache.tokenAddress);
      setFetchingMeta(false);
      setNFT(nft);
    }
  };

  useEffect(() => {
    if (!open) {
      setMessage("");
      setTxState(TxState.Idle);
      setNFT(null);
    } else {
      console.log(data.cache);
      fetchCache(data.cache.id);
    }
  }, [open, data]);

  useEffect(() => {
    if (airCache.contract && airCache.signer && auth.user && open) {
      console.log("Listening to NFT Dropped");
      airCache.contract.on("NFTDropped", detectWinner);
    }
    return () => {
      if (airCache.contract) {
        airCache.contract.off("NFTDropped", detectWinner);
      }
    };
  }, [airCache.contract, airCache.signer, auth.user, open]);

  const claim = () => {
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      setFetchingLocation(false);
      const timestamp = position.timestamp;
      const coords = position.coords;
      const o = {
        accuracy: coords.accuracy,
        altitude: coords.altitude,
        altitudeAccuracy: coords.altitudeAccuracy,
        heading: coords.heading,
        latitude: coords.latitude,
        longitude: coords.longitude,
        speed: coords.speed,
      };
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      console.log(haversineDistance(userLocation, data.cache.location));

      const res = await claimCache(
        data.cache.id,
        data.cache.location,
        userLocation,
        {
          timestamp,
          o,
        }
      );
      setTxState(TxState.Mining);
      if (res.tx) {
        setTxHash(res.tx.hash);
      } else {
        setTxState(TxState.Error);
        setMessage(res.message);
      }
    });
  };

  const detectWinner = (
    cacheId: any,
    winner: any,
    tokenAddress: any,
    tokenId: any,
    event: any
  ) => {
    if (winner === auth.user.publicAddress) {
      console.log(event);
      setTxState(TxState.Complete);
    }
    //   console.log(cacheId);
    //   console.log(winner);
    //   console.log(tokenAddress);
    //   console.log(tokenId);
    //   console.log(event);
  };

  // gross because im smashing the data call into toggleModal-- I should probably just clear the data when it is toggled off
  const loading =
    typeof data !== "object" || data === null || data.clientX || fetchingMeta;

  if (loading) {
    return (
      <Container open={open} toggleModal={toggleModal}>
        <div
          className="flex justify-center items-center"
          style={{ height: 200 }}
        >
          <Spinner />
        </div>
      </Container>
    );
  }

  //   const empty = data && data.NFT && Object.keys(data.NFT).length === 0;
  const empty = !NFT;
  if (empty) {
    return (
      <Container open={open} toggleModal={toggleModal}>
        <div className="text-3xl font-bold text-center pb-5">
          Egg is empty! {!loading && data.cache.id}
        </div>
        <div className="w-3/4 m-auto p-10">
          <Sad />
        </div>
        <Button
          onClick={toggleModal}
          className="m-auto w-28 block mt-5 py-3 font-bold text-2xl"
        >
          Ok
        </Button>
      </Container>
    );
  }
  console.log(NFT.image);
  return (
    <Container open={open} toggleModal={toggleModal}>
      {txState === TxState.Idle || txState === TxState.Fetching ? (
        <>
          <div className="text-3xl font-bold text-center pb-5">{NFT.name}</div>
          <div>
            <img
              className="m-auto"
              src={isIpfs(NFT.image) ? ipfsToPinata(NFT.image) : NFT.image}
            />
          </div>
          <Button
            className="m-auto w-28 block mt-5 py-3 font-bold text-2xl"
            onClick={claim}
          >
            <div className="flex justify-center items-center">
              {/* {txState !== TxState.Fetching ? ( */}
              {!fetchingLocation ? (
                "Claim"
              ) : (
                <div className="bg-black rounded-full">
                  <Spinner />
                </div>
              )}
            </div>
          </Button>
        </>
      ) : (
        <></>
      )}
      {txState === TxState.Mining ? (
        <>
          <div className="text-3xl font-bold text-center pb-5">
            The NFT is being sent to you...
          </div>
          <AxeAnimation />
          <div className="text-center">
            <a
              target={"_blank"}
              className="text-polygon"
              href={`https://mumbai.polygonscan.com/tx/${txHash}`}
            >
              Polyscan Tx
            </a>
          </div>
        </>
      ) : (
        <></>
      )}
      {txState === TxState.Complete ? (
        <>
          <div className="text-4xl font-bold text-center pb-5">
            Your new NFT!
          </div>

          <div className="text-3xl font-bold text-center pb-5">{NFT.name}</div>
          <div>
            <img
              className="m-auto"
              src={isIpfs(NFT.image) ? ipfsToPinata(NFT.image) : NFT.image}
            />
          </div>
          <Button
            onClick={toggleModal}
            className="w-20 font-bold m-auto block text-2xl mt-10"
          >
            Ok
          </Button>
        </>
      ) : (
        <></>
      )}
      {txState === TxState.Error ? (
        <>
          <div className="text-4xl font-bold text-center pb-5">
            {message === "TOO_FAR" && "You must get closer to claim!"}
          </div>
          <div className="max-w-xs p-10 m-auto">
            {message === "TOO_FAR" && <MapIcon />}
          </div>
          <Button
            onClick={toggleModal}
            className="w-20 font-bold m-auto block text-2xl"
          >
            Ok
          </Button>
        </>
      ) : (
        <></>
      )}
    </Container>
  );
}
