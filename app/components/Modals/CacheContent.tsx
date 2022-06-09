import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { claimCache } from "../../libs/api";
import Button from "../Button";
import Spinner from "../Loading/Spinner";
import Container from "./Container";
import Sad from "../Icons/Sad";
import AxeAnimation from "../Animations/Axe";
import { haversineDistance, ipfsToPinata, isIpfs } from "../../libs/utils";
import MapIcon from "../Icons/Map";
import { useRouter } from "next/router";
import AirYaytsoInterface from "../../hooks/AirCache.json";
import { provider } from "../../libs/web3Api";

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
export default function CacheContentModal({
  open,
  toggleModal,
  airCache,
  auth,
  data,
}: Props) {
  const router = useRouter();
  const [NFT, setNFT] = useState<any>(null);
  const [txState, setTxState] = useState<TxState>(TxState.Idle);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState({ error: "", message: "" });
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);

  const fetchCache = async (cacheId: number) => {
    setFetchingMeta(true);
    console.log(data.cache);
    // Solana
    // if Solana get token data from incoming data or from db
    const contract = new ethers.Contract(
      data.cache.contractAddress,
      AirYaytsoInterface.abi,
      provider
    );
    const cache = await airCache.getCache(data.cache.id, contract);
    console.log(cache);
    const tokenId = cache.tokenId;
    console.log(tokenId);
    if (!tokenId) {
      setFetchingMeta(false);
      console.log("cache is empty");
    } else {
      console.log(tokenId, cache.tokenAddress);
      const nft = await airCache.getNFTMeta(tokenId, cache.tokenAddress);
      console.log(nft);
      setFetchingMeta(false);
      setNFT(nft);
    }
  };

  useEffect(() => {
    if (!open) {
      setError({ error: "", message: "" });
      setTxState(TxState.Idle);
      setNFT(null);
    } else {
      fetchCache(data.cache.id);
    }
  }, [open, data]);

  useEffect(() => {
    // Solana
    // I'm not sure what this listener will be, maybe it will be optimisic
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
              message:
                "Something weird happened while checking your location, maybe try logging in again?",
              error: "NO_AUTH",
            });
          }
        },
        (e) => {
          setTxState(TxState.Error);
          setError({
            message:
              "I don't think your browser supports geolocation or you may have turned it off in the settings on your phone.",
            error: "NO_GEOLOCATION",
          });
        }
      );
    } else {
      alert(
        "This browser does not support location services, or you have turned them off"
      );
    }
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
          Egg is empty!{" "}
          {process.env.NODE_ENV === "development" ? data.cache.id : ""}
        </div>
        <div className="w-3/4 m-auto p-10">
          <Sad />
        </div>
        <Button
          onClick={() => {
            toggleModal();
          }}
          className="m-auto w-28 block mt-5 py-3 font-bold text-2xl"
        >
          Ok
        </Button>
      </Container>
    );
  }
  return (
    <Container open={open} toggleModal={toggleModal}>
      {txState === TxState.Idle || txState === TxState.Fetching ? (
        <>
          <div className="text-3xl font-bold text-center pb-5">{NFT.name}</div>
          <div className="p-5">
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
            The item is being sent to you...
          </div>
          <AxeAnimation />
          {/* <div className="text-center">
            <a
              target={"_blank"}
              className="text-polygon"
              href={`https://mumbai.polygonscan.com/tx/${txHash}`}
            >
              Polyscan Tx
            </a>
          </div> */}
        </>
      ) : (
        <></>
      )}
      {txState === TxState.Complete ? (
        <>
          <div className="text-4xl font-bold text-center pb-5">
            Your new item!
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
          <div className="text-3xl font-bold text-center pb-5">
            {error.message}
          </div>
          <div className="max-w-xs px-14 m-auto">
            {error.error === "TOO_FAR" && <MapIcon />}
            {error.error === "TOO_FAR" && (
              <Button
                onClick={toggleModal}
                className="w-20 font-bold m-auto block text-2xl mt-10"
              >
                Ok
              </Button>
            )}
            {error.error === "NO_AUTH" && (
              <Button
                className="m-auto w-28 block mt-0 py-3 font-bold text-2xl"
                onClick={() => {
                  // router.push("/login");
                  router.push(`/login?cache=${data.cache.id}`);
                }}
              >
                Login
              </Button>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </Container>
  );
}
