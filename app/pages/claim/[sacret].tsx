import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Big from "../../components/Button/Big";
import Img from "../../components/Img";
import BlackWrappedSpinner from "../../components/Loading/BlackWrappedSpinner";
import useAuth from "../../hooks/useAuth";
import { checkClaim, claimSacret } from "../../libs/api";
import web3Api from "../../libs/web3Api";
import { TxState } from "../../libs/types";
import Spinner from "../../components/Loading/Spinner";
import Axe from "../../components/Icons/Axe";
import AxeAnimation from "../../components/Animations/Axe";
import EgglineIcon from "../../components/Icons/Eggline";
import logo from "../../assets/icons/yaytso.svg";
import Polygon from "../../components/Icons/Polygon";
type NFTMeta = {
  name: string;
  description: string;
  image: string;
};

export default function Claim() {
  const router = useRouter();
  const auth = useAuth();
  const [NFT, setNFT] = useState<NFTMeta | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [txState, setTxState] = useState<TxState>(TxState.Idle);
  const [email, setEmail] = useState("");

  const getCache = async () => {
    const cache = await checkClaim(router.query.sacret as string);
    console.log(cache);
    const cacheContent = await web3Api.getCache(cache.cacheId);
    try {
      const nftMeta = await web3Api.getNFTMeta(
        cacheContent.tokenId.toNumber(),
        cacheContent.tokenAddress
      );
      nftMeta.contractAddress = cacheContent.tokenAddress;
      nftMeta.tokenId = cacheContent.tokenId.toNumber();
      setFetching(false);
      setNFT(nftMeta);
    } catch (e) {
      setIsEmpty(true);
    }
  };

  const onClaim = async () => {
    setFetching(true);
    const res = await claimSacret(router.query.sacret as string);
    setFetching(false);
    setTxState(TxState.Mining);
    console.log(res);
  };

  const goToWallet = () => {
    router.push("/wallet");
  };

  const onLogin = () => {
    auth.login(email, `/claim-${router.query.sacret as string}`);
  };

  useEffect(() => {
    if (router.query.sacret) {
      getCache();
    }
  }, [router.query]);
  const detectWinner = (
    cacheId: any,
    winner: any,
    tokenAddress: any,
    tokenId: any,
    event: any
  ) => {
    if (winner === auth.user.publicAddress) {
      setTxState(TxState.Complete);
    }
  };

  useEffect(() => {
    if (auth.user && auth.user.publicAddress) {
      console.log("Listening to NFT Dropped");
      web3Api.contract.on("NFTDropped", detectWinner);
    }
    return () => {
      if (auth.user && auth.user.publicAddress) {
        web3Api.contract.off("NFTDropped", detectWinner);
      }
    };
  }, [auth.user]);

  if (isEmpty) {
    return (
      <div className="h-full flex flex-col justify-center items-center text-4xl text-center">
        <div className="w-1/2 max-w-xs mb-5">
          <img src={logo.src} />
        </div>
        <div className="w-1/2 mb-10 max-w-xs">
          <EgglineIcon />
        </div>
        <div className="font-bold w-3/4">Someone got here first!</div>
      </div>
    );
  }
  return (
    <div>
      <div className="w-1/2 max-w-xs my-5 mx-auto block">
        <img src={logo.src} />
      </div>
      {!NFT && fetching && (
        <div className="flex justify-center items-center h-screen pb-20">
          <Spinner />
        </div>
      )}
      {NFT && (
        <div>
          <div className="text-3xl text-white font-bold text-center mt-10">
            {NFT.name}
          </div>
          <div className="max-w-xs m-auto">
            <Img uri={NFT.image} className="" />
          </div>

          {auth.user && txState === 0 && (
            <>
              <div className="text-2xl px-5 text-center font-bold">
                This beautiful item can be yours
              </div>
              <div className="mt-8">
                <Big className="m-auto block text-2xl px-10" onClick={onClaim}>
                  {fetching ? <BlackWrappedSpinner /> : "Claim"}
                </Big>
              </div>
              <div className="bg-white w-full h-2 mt-10" />
              <div className="text-center font-bold mt-5 mb-2">
                See it on OpenSea!
              </div>
              <a
                className="bg-polygon px-6 py-2 rounded-full flex items-center justify-center w-40 m-auto"
                target="_blank"
                rel="noreferrer"
                href={`https://opensea.io/assets/matic/${
                  (NFT as any).contractAddress
                }/${(NFT as any).tokenId}`}
              >
                OpenSea{" "}
                <div className="w-4 ml-1">
                  <Polygon fill="white" />
                </div>
              </a>
            </>
          )}
          {txState && txState === TxState.Mining ? (
            <div>
              <AxeAnimation />
              <div className="font-bold text-center text-2xl mt-20 w-3/4 mx-auto">
                Your item is on its way to you!
              </div>
            </div>
          ) : (
            <></>
          )}
          {txState && txState === TxState.Complete ? (
            <div>
              <div className="font-bold text-center text-4xl mt-0 mb-10 w-5/6 mx-auto">
                The item is now yours!
              </div>
              <div className="font-bold text-center text-2xl mt-2 w-3/4 mx-auto">
                View it in your wallet
              </div>
              <Big
                onClick={goToWallet}
                className="m-auto block mt-4 text-2xl px-8"
              >
                Wallet
              </Big>
            </div>
          ) : (
            <></>
          )}
          {auth.user === null && (
            <>
              <div className="text-2xl px-5 text-center font-bold">
                You need to login to claim this beautiful item!
              </div>{" "}
              <input
                placeholder="Email"
                className="h-10 p-2 w-64 m-auto mt-5 block"
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
              <div className="mt-8">
                <Big className="m-auto block text-2xl px-10" onClick={onLogin}>
                  {auth.fetching ? <BlackWrappedSpinner /> : "Login"}
                </Big>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
