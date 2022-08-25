import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { claimCache } from "../../libs/api";
import Button from "../Button";
import Spinner from "../Loading/Spinner";
import Container from "./Container";
import Sad from "../Icons/Sad";
import AxeAnimation from "../Animations/Axe";
import {
  haversineDistance,
  ipfsToPinata,
  isIpfs,
  isWordHunt,
} from "../../libs/utils";
import MapIcon from "../Icons/Map";
import { useRouter } from "next/router";
import AirYaytsoInterface from "../../hooks/AirCache.json";
import { provider } from "../../libs/web3Api";
import storage from "../../libs/storage";
import BlackWrappedSpinner from "../Loading/BlackWrappedSpinner";
import { cache } from "swr/dist/utils/config";

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

  const [email, setEmail] = useState("");
  console.log(NFT);
  const onChangeEmail = (e: React.FormEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const fetchCache = async (cacheId: number) => {
    setFetchingMeta(true);
    // Solana
    // if Solana get token data from incoming data or from db
    const contract = new ethers.Contract(
      data.cache.contractAddress,
      AirYaytsoInterface.abi,
      provider
    );
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

  useEffect(() => {
    if (!open) {
      setError({ error: "", message: "" });
      setTxState(TxState.Idle);
      setNFT(null);
      setFetchingLocation(false);
    } else {
      fetchCache(data.cache.id);
    }
  }, [open, data]);

  const detectWinner = (
    cacheId: any,
    winner: any,
    tokenAddress: any,
    tokenId: any,
    event: any
  ) => {
    if (
      winner === auth.user.publicAddress &&
      tokenAddress == NFT.tokenAddress &&
      tokenId == NFT.tokenId
    ) {
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
    // Solana
    // I'm not sure what this listener will be, maybe it will be optimisic
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
      setError({ error: "NO_AUTH", message: "Import Wallet" });
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
            const res = await claimCache(
              data.cache.id,
              data.groupName,
              NFT.tokenAddress,
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
      alert(
        "This browser does not support location services, or you have turned them off"
      );
    }
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
          The NFT is gone... Someone got here first!{" "}
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
          {!isWordHunt(router.query.groupName as string) && (
            <div className="text-3xl font-bold text-center pb-5">
              {NFT.name}
            </div>
          )}
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
            The NFT is being sent to you...
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
          <div className="text-3xl font-bold text-center pb-5">
            {error.message}
          </div>
          <div className="max-w-xs px-2 m-auto">
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
              <div>
                <div className="text-xl text-center pb-7">
                  Your email is linked to a unique wallet. Type it in below and
                  we will send you a confimation.
                </div>
                <input
                  autoComplete="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="h-10 p-2 w-full mb-6 text-center black-beard"
                  style={{ fontSize: 18 }}
                  onChange={onChangeEmail}
                />
                <Button
                  className="m-auto w-32 block mt-0 py-2 px-4 font-bold text-lg"
                  disabled={auth.fetching}
                  onClick={async () => {
                    // router.push("/login");

                    // router.push(`/login?cache=${data.cache.id}`);
                    let destination = "/";
                    if (typeof localStorage !== "undefined") {
                      const currentGroup = storage.getItem(
                        storage.keys.current_group
                      );
                      if (currentGroup) {
                        destination = "/" + currentGroup;
                      }
                    }
                    await auth.logout();
                    await auth.login(email, destination);
                    toggleModal();
                  }}
                >
                  {auth.fetching ? <BlackWrappedSpinner /> : "Import"}
                </Button>
              </div>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </Container>
  );
}
