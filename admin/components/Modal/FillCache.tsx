import { ethers } from "ethers";
import { ChangeEvent, useState } from "react";
import { endpoints, onUpdateCache } from "../../libs/api";
import { Cache } from "../../libs/types";
import web3Api from "../../libs/web3Api";

type Props = {
  cache: Cache | undefined;
  ownerAddress: string;
  provider: ethers.providers.Web3Provider | null;
  huntName: string;
  mutate: any;
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

// Refactor: Some of these could be in the container to avoid props drilling silliness
export default function FillCache({
  cache,
  ownerAddress,
  provider,
  huntName,
  mutate,
}: Props) {
  const [view, setView] = useState(View.Confirm);
  const [tokenAddress, setTokenAddress] = useState(
    "0x93E9c3dd0Ab468Aae3D9906f8F44808e19DDD44B"
  );
  const [ownersNFTs, setOwnersNFTs] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState("");

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
    const tokenId = parseInt(selectedNFT);
    const eventResponse = await web3Api.fillCache(
      parseInt(cache!.cacheId),
      tokenId,
      tokenAddress,
      provider ? provider : undefined
    );
    if (eventResponse && eventResponse === "NFTHeld") {
      await onUpdateCache(cache!.cacheId, tokenId, tokenAddress, huntName);
      mutate();
    }
  };
  // ENd of lifting

  if (!cache) {
    return <div>Something went wrgon</div>;
  }
  return (
    <>
      {view === View.Confirm && (
        <div>
          <div className="text-2xl">Would you like to fill {cache.cacheId}</div>
          <button onClick={nextView} className="mt-4 m-auto block">
            Yes
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
            Yes
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
                  {nft.title}
                  {nft.id.tokenId}
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
            {selectedNFT ? "Continue" : "..."}
          </button>
        </div>
      )}
      {view === View.FillCache && (
        <div>
          <div className="text-2xl">
            You are about to fill {cache.cacheId} with Token {selectedNFT}
          </div>
          <button onClick={fillCache} className="mt-4 m-auto block">
            Yep
          </button>
        </div>
      )}
    </>
  );
}
