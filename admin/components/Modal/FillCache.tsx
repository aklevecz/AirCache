import { ethers } from "ethers";
import { ChangeEvent, useEffect, useState } from "react";
import { endpoints, onUpdateCache } from "../../libs/api";
import { PIZZA_CITY_MATIC } from "../../libs/constants";
import { Cache, FillTxState, TxState } from "../../libs/types";
import web3Api from "../../libs/web3Api";

type Props = {
  cache: Cache | undefined;
  ownerAddress: string;
  provider: ethers.providers.Web3Provider | null;
  huntName: string;
  mutate: any;
  closeModal: () => {};
};

type AlchemyApiNFT = {
  title: string;
  id: { tokenId: string; tokenMetadata: { tokenType: string } };
  media: { raw: string; gateway: string }[];
  metadata: { name: string; description: string; image: string };
};

enum View {
  Confirm,
  FetchNFTs,
  PickNFT,
  FillCache,
}

const thumbDims = 25;

const txMessages = {
  [FillTxState.Idle]: "",
  [FillTxState.Signing]: "Waiting for Signature",
  [FillTxState.Minting]: "Your Transaction is Being Mined",
  [FillTxState.Completed]: "Your Transaction was Completed!",
  [FillTxState.Error]: "Sorry, something went wrong :( Please try again...",
};

// Refactor: Some of these could be in the container to avoid props drilling silliness
export default function FillCache({
  cache,
  ownerAddress,
  provider,
  huntName,
  mutate,
  closeModal,
}: Props) {
  const [view, setView] = useState(View.Confirm);
  const [tokenAddress, setTokenAddress] = useState(PIZZA_CITY_MATIC);
  const [ownersNFTs, setOwnersNFTs] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState("");

  const [txState, setTxState] = useState<FillTxState>(FillTxState.Idle);

  const nextView = () => setView(view + 1);

  const onTokenAddressChange = (e: ChangeEvent<HTMLInputElement>) =>
    setTokenAddress(e.currentTarget.value);

  // This could be lifted up
  const fetchNFTs = async () => {
    const nfts = await fetch(
      endpoints.getOwnerNFTs +
        `?owner=${ownerAddress}&tokenAddress=${tokenAddress}`
    )
      .then((r) => r.json())
      .catch((e) => alert(e));

    if (nfts) {
      setOwnersNFTs(nfts);
      setView(view + 1);
    }
  };

  const fillCache = async () => {
    setTxState(FillTxState.Signing);
    const tokenId = parseInt(selectedNFT);
    const eventResponse = await web3Api.fillCache(
      parseInt(cache!.cacheId),
      tokenId,
      tokenAddress,
      provider ? provider : undefined,
      setTxState
    );
    if (eventResponse && eventResponse === "NFTHeld") {
      await onUpdateCache(cache!.cacheId, tokenId, tokenAddress, huntName);
      mutate();
    }
  };
  // ENd of lifting

  useEffect(() => {
    if (txState >= FillTxState.Completed) {
      setTimeout(() => {
        closeModal();
        setTxState(FillTxState.Idle);
      }, 1000);
    }
  }, [txState]);

  if (!cache) {
    return <div>Something went wrgon</div>;
  }

  const buttonText = {
    [View.Confirm]: "Yes",
    [View.FetchNFTs]: "Fetch My NFTs",
    [View.PickNFT]: "Ok",
    [View.FillCache]: "Confirm",
  };
  console.log(txState);
  return (
    <>
      {view === View.Confirm && (
        <div>
          <div className="text-2xl">Would you like to fill {cache.cacheId}</div>
          <button onClick={nextView} className="mt-4 m-auto block">
            {buttonText[view]}
          </button>
        </div>
      )}
      {view === View.FetchNFTs && (
        <div>
          <div className="text-2xl">
            Please input a token address for one of your NFTs
          </div>
          <input
            onChange={onTokenAddressChange}
            value={tokenAddress}
            className="m-auto mt-4 block"
          />
          <button onClick={fetchNFTs} className="mt-4 m-auto block">
            {buttonText[view]}
          </button>
        </div>
      )}
      {view === View.PickNFT && (
        <div>
          <div className="text-2xl">Pick one of your NFTs</div>
          <div>
            {ownersNFTs.map((nft: AlchemyApiNFT) => (
              <div
                onClick={() => setSelectedNFT(nft.id.tokenId)}
                className="flex mb-2 bg-black p-2"
                style={{
                  background: selectedNFT === nft.id.tokenId ? "red" : "black",
                }}
              >
                <div>
                  {nft.title} -
                  <span className="font-bold">{parseInt(nft.id.tokenId)}</span>
                </div>
                <img
                  className="ml-2"
                  style={{ width: thumbDims, height: "auto" }}
                  src={nft.metadata.image}
                />
              </div>
            ))}
          </div>
          <button onClick={nextView} className="mt-4 m-auto block">
            {selectedNFT ? `${buttonText[view]}` : "..."}
          </button>
        </div>
      )}
      {view === View.FillCache && (
        <div>
          <div className="text-2xl">
            You are about to fill {cache.cacheId} with Token{" "}
            {parseInt(selectedNFT)}
          </div>
          <img
            className="m-auto block"
            style={{ width: 100, height: "auto" }}
            src={
              (ownersNFTs as any).find(
                (nft: AlchemyApiNFT) => nft.id.tokenId === selectedNFT
              ).metadata.image
            }
          />
          <button onClick={fillCache} className="mt-0 m-auto block">
            {txState ? txMessages[txState] : buttonText[view]}
          </button>
        </div>
      )}
    </>
  );
}
