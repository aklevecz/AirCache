import { ethers } from "ethers";
import { useEffect, useState } from "react";
import api, { claimCache, claimMint, claimVoucher, endpoints } from "../../libs/api";
import Spinner from "../Loading/Spinner";
import Container from "./Container";
import { useRouter } from "next/router";
import AirYaytsoInterface from "../../hooks/AirCache.json";
import EggventsInterface from "../../hooks/Eggvents.json";
import { provider } from "../../libs/web3Api";
import NothingHere from "../CacheContent/NothingHere";
import { NFT } from "../../libs/types";
import Claim from "../CacheContent/Claim";
import Mining from "../CacheContent/Mining";
import Complete from "../CacheContent/Complete";
import Error from "../CacheContent/Error";
import { getMaticProvider, ipfsToPinata, isIpfs } from "../../libs/utils";
import { getOwnerNfts } from "../../libs/managerApi";
import Button from "../Button";
import BouncyEgg from "../Loading/BouncyEgg";
import useProgression from "../../hooks/useProgression";

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
  updateCollected?: any;
};

let rendered = false;
export default function CacheContentModal({ open, toggleModal, airCache, auth, data, updateCollected }: Props) {
  const router = useRouter();
  const [NFT, setNFT] = useState<NFT | null>(null);
  const [txState, setTxState] = useState<TxState>(TxState.Idle);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState({ error: "", message: "" });
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);

  const { collected } = useProgression();
  const isCollected = Boolean(collected.find((nft: any) => nft.name === data?.nft?.name));

  // @note PROG NFT STUFF
  // this could be a SWR hook
  const [tokenTypes, setTokenTypes] = useState<any[]>([]);
  const [hasAlreadyCollected, setHasAlreadyCollected] = useState(false);
  // @todo make this more flexible, huntTypes?
  const isProgHunt = data && data.huntType === "prog";

  // END PROG NFT STUFF

  // useEffect(() => {
  //   if (!rendered) {
  //     rendered = true;
  //     api.get(endpoints.airCash);
  //   }
  // }, []);

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

  const cacheMapSlot = 1;
  const fetchProgNFT = async () => {
    setFetchingMeta(true);
    const contract = new ethers.Contract(data.progContract, EggventsInterface.abi, provider);
    console.log(data);
    const tokenURI = await contract.tokenURI(data.progContractTokenType || 1);
    // @todo replace
    const metadata = await fetch(tokenURI).then((r) => r.json());
    setFetchingMeta(false);
    setNFT(metadata);
  };

  const reset = () => {
    setError({ error: "", message: "" });
    setTxState(TxState.Idle);
    setNFT(null);
    setFetchingLocation(false);
    setHasAlreadyCollected(false);
  };

  // @fix checks ownership and sets nft metadata if it is on the nft
  // THIS IS PROG ONLY IT CHECKS IT IN THE EFFECT HOOK
  const checkOwnership = async () => {
    setFetchingMeta(true);
    console.log(data.nft);
    setNFT(data.nft);

    if (!auth.user) {
      setError({ error: "NO_AUTH", message: "sign in" });
      setFetchingMeta(false);
      return;
    }

    const nfts = await getOwnerNfts(auth.user.publicAddress, data.progContract);
    // metadata should have token type
    const uris: string[] = [];
    const tokenTypes = nfts?.map((nft) => {
      uris.push(nft.tokenUri.gateway);
      // @todo CHANGE -- this could come from the contract or the new version will have the proper string replacement
      const tokenType = parseInt(nft.tokenUri.gateway.split("metadata/")[1].split(".json")[0]) || 1;
      return tokenType;
    });
    // if they already collected the nft
    console.log(tokenTypes, data.progContractTokenType);
    if (tokenTypes?.includes(parseInt(data.progContractTokenType))) {
      // setFetchingMeta(false);
      setHasAlreadyCollected(true);
      // return;
    }
    // URI to show
    // const uri = uris.find((uri) => uri.includes(`${data.progContractTokenType - 1}`));
    // if (uri) {
    //   const metadata = await fetch(uri).then((r) => r.json());
    //   setNFT(metadata);
    // }
    setTokenTypes(tokenTypes || []);
    setFetchingMeta(false);
  };
  useEffect(() => {
    if (!open) {
      reset();
    } else {
      if (isProgHunt) {
        checkOwnership();
        // fetchProgNFT();
      } else {
        fetchCache(data.cache.id);
      }
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

  // This doesn't support prog
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

  // hook to listen for the mint claim?

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

            // if (data.cache.taskQueue or data.cache.local)

            // This could be different more flexible
            if (!isProgHunt) {
              const res = await claimCache(data.cache.id, data.groupName, NFT!.tokenAddress, data.cache.location, userLocation, {
                timestamp,
                o,
              });
              setFetchingLocation(false);
              setTxState(TxState.Mining);
              if (res.tx) {
                setTxHash(res.tx.hash);
              } else {
                setTxState(TxState.Error);
                setError({ message: res.message, error: res.error });
              }
            } else {
              console.log("HELLO", data.cache.location);
              // is prog hunt
              const res = await claimMint(data.progContract, data.progContractTokenType, data.cache.location, userLocation, { timestamp, o });
              // this is resolving on success right now as well since the changes to minting on the lambda with optismtic feedback

              if (res.success) {
                setTxState(TxState.Complete);
                updateCollected && updateCollected(true, data.nft);
                return;
              }
              if (!res.signature) {
                setTxState(TxState.Error);
                setError({ message: res.message, error: res.error });
                return;
              }
              const { nftData, signature } = res;
              const provider = getMaticProvider();
              const contract = new ethers.Contract(data.progContract, EggventsInterface.abi, provider);
              const signer = await provider.getSigner();
              const magicMap = contract.connect(signer);
              try {
                const tx = await magicMap.discover(nftData, signature).catch(console.log);
                setTxState(TxState.Mining);
                setFetchingLocation(false);
                const receipt = await tx.wait();
                for (const event of receipt.events) {
                  if ((event.event = "Transfer")) {
                    setTxState(TxState.Complete);
                    updateCollected && updateCollected();
                    // I don't think i need to grab the args
                    // auth.user.publicAddress === event.args.to
                    // const tokenId = event.args.tokenId.toNumber()
                  }
                }
              } catch (e) {
                setTxState(TxState.Error);
                setError({
                  message: "Your transaction failed :(",
                  error: "NO_AUTH",
                });
              }
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
            message: "I don't think your browser supports geolocation or you may have turned it off in the settings on your phone.",
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
        <div className="flex w-full justify-center h-[80vh] items-center">
          <BouncyEgg size={100} />
        </div>
      </Container>
    );
  }

  // move this into the Claim component
  // if (hasAlreadyCollected && NFT) {
  //   return (
  //     <Container open={open} toggleModal={toggleModal}>
  //       <div className="text-3xl font-bold text-center pb-5">{NFT.name}</div>
  //       <div className="p-5">
  //         <img className="m-auto h-full" src={isIpfs(NFT.image) ? ipfsToPinata(NFT.image) : NFT.image} />
  //       </div>
  //       <div className="text-3xl font-bold text-center pb-5">You already got this NFT!</div>
  //       <Button className="m-auto w-28 block mt-5 py-3" onClick={toggleModal}>
  //         Ok
  //       </Button>
  //     </Container>
  //   );
  // }

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
        <Claim
          NFT={NFT}
          isCollected={isCollected}
          claim={claim}
          fetching={fetchingLocation}
          huntType={data.huntType}
          groupName={router.query.groupName as string}
        />
      ) : (
        <></>
      )}
      {txState === TxState.Mining ? <Mining /> : <></>}
      {txState === TxState.Complete ? <Complete NFT={NFT} toggleModal={toggleModal} /> : <></>}
      {txState === TxState.Error ? <Error error={error} toggleModal={toggleModal} /> : <></>}
    </Container>
  );
}
