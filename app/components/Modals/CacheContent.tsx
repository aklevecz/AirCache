import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { claimCache } from "../../libs/api";
import Spinner from "../Loading/Spinner";
import Container from "./Container";
import { useRouter } from "next/router";
import AirYaytsoInterface from "../../hooks/AirCache.json";
import { provider } from "../../libs/web3Api";
import NothingHere from "../CacheContent/NothingHere";
import { NFT } from "../../libs/types";
import Claim from "../CacheContent/Claim";
import Mining from "../CacheContent/Mining";
import Complete from "../CacheContent/Complete";
import Error from "../CacheContent/Error";

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
    getCache: any;
    getNFTMeta: (tokenId: number, tokenAddress: string) => any;
  };
  auth: any;
  data: any;
};
export default function CacheContentModal({ open, toggleModal, airCache, auth, data }: Props) {
  const router = useRouter();
  const [NFT, setNFT] = useState<NFT | null>(null);
  const [txState, setTxState] = useState<TxState>(TxState.Idle);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState({ error: "", message: "" });
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);

  // Could be in a different hook oriented around the cache fetch and claim
  const fetchCache = async (cacheId: number) => {
    setFetchingMeta(true);
    const contract = new ethers.Contract(data.cache.contractAddress, AirYaytsoInterface.abi, provider);
    const cache = await airCache.getCache(data.cache.id, contract);
    const tokenId = cache.tokenId;
    if (!tokenId) {
      setFetchingMeta(false);
    } else {
      const nft = await airCache.getNFTMeta(tokenId, cache.tokenAddress);
      setFetchingMeta(false);
      setNFT({
        ...nft,
        tokenAddress: cache.tokenAddress,
        tokenId: cache.tokenId,
      });
    }
  };

  const reset = () => {
    setError({ error: "", message: "" });
    setTxState(TxState.Idle);
    setNFT(null);
    setFetchingLocation(false);
  };

  useEffect(() => {
    if (!open) {
      reset();
    } else {
      fetchCache(data.cache.id);
    }
  }, [open, data]);

  const detectWinner = (cacheId: any, winner: any, tokenAddress: any, tokenId: any, event: any) => {
    if (winner === auth.user.publicAddress && tokenAddress == NFT?.tokenAddress && tokenId == NFT?.tokenId) {
      console.log(event);
      // could update cache db here
      setTxState(TxState.Complete);
    }
    //   console.log(cacheId);
    //   console.log(winner);
    //   console.log(tokenAddress);
    //   console.log(tokenId);
    //   console.log(event);
  };

  useEffect(() => {
    if (airCache.contract && airCache.signer && auth.user && open && NFT) {
      console.log("Listening to NFT Dropped");
      airCache.contract.on("NFTDropped", detectWinner);
    }
    return () => {
      if (airCache.contract) {
        airCache.contract.off("NFTDropped", detectWinner);
      }
    };
  }, [airCache.contract, airCache.signer, auth.user, open && NFT]);

  const claim = () => {
    setFetchingLocation(true);
    if (!auth.user) {
      setTxState(TxState.Error);
      setFetchingLocation(false);
      setError({ error: "NO_AUTH", message: "Sign in" });
      return;
    }
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
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
            console.log("claiming");
            // if (data.cache.taskQueue or data.cache.local)
            const res = await claimCache(
              data.cache.id,
              data.groupName,
              NFT!.tokenAddress,
              data.cache.location,
              userLocation,
              {
                timestamp,
                o,
              }
            );
            setFetchingLocation(false);
            setTxState(TxState.Mining);
            if (res.tx) {
              setTxHash(res.tx.hash);
            } else {
              setTxState(TxState.Error);
              setError({ message: res.message, error: res.error });
            }
          } catch (e) {
            setTxState(TxState.Error);
            setError({
              message: "Something weird happened while checking your location, maybe try logging in again?",
              error: "NO_AUTH",
            });
          }
        },
        (e) => {
          console.log("error");
          setTxState(TxState.Error);
          setError({
            message:
              "I don't think your browser supports geolocation or you may have turned it off in the settings on your phone.",
            error: "NO_GEOLOCATION",
          });
        }
      );
    } else {
      alert("This browser does not support location services, or you have turned them off");
    }
  };

  // gross because im smashing the data call into toggleModal-- I should probably just clear the data when it is toggled off
  const loading = typeof data !== "object" || data === null || data.clientX || fetchingMeta;
  if (loading) {
    return (
      <Container open={open} toggleModal={toggleModal}>
        <div className="flex justify-center items-center" style={{ height: 200 }}>
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
        <NothingHere toggleModal={toggleModal} data={data} />
      </Container>
    );
  }
  return (
    <Container open={open} toggleModal={toggleModal}>
      {txState === TxState.Idle || txState === TxState.Fetching ? (
        <Claim NFT={NFT} claim={claim} fetching={fetchingLocation} groupName={router.query.groupName as string} />
      ) : (
        <></>
      )}
      {txState === TxState.Mining ? <Mining /> : <></>}
      {txState === TxState.Complete ? <Complete NFT={NFT} toggleModal={toggleModal} /> : <></>}
      {txState === TxState.Error ? <Error error={error} toggleModal={toggleModal} /> : <></>}
    </Container>
  );
}
