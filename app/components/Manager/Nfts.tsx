import { ethers } from "ethers";
import { Web3Wallet } from "../../libs/types";
import Big from "../Button/Big";
import BlackWrappedSpinner from "../Loading/BlackWrappedSpinner";

type Props = {
  onGetNfts: () => void;
  nfts: any;
  selectedNft: any;
  setSelectedNft: any;
  web3Wallet: Web3Wallet;
  fetching: boolean;
  approve: () => void;
};

export default function Nfts({
  onGetNfts,
  nfts,
  selectedNft,
  setSelectedNft,
  fetching,
  approve,
}: Props) {
  const noNfts = nfts.length === 0;
  console.log(nfts);
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {noNfts && (
        <>
          <div className="text-2xl text-center w-5/6 mb-5">
            Get your available NFTs or input a token address
          </div>
          <Big onClick={onGetNfts}>
            {fetching ? <BlackWrappedSpinner /> : "get NFTs"}
          </Big>
        </>
      )}
      {nfts &&
        nfts.map((nft: any) => (
          <div
            key={nft.contract.address + nft.id.tokenId}
            onClick={() => {
              setSelectedNft(nft);
            }}
            className="mb-10 py-5"
            style={{
              backgroundColor:
                selectedNft &&
                selectedNft.contract.address + selectedNft.id.tokenId ===
                  nft.contract.address + nft.id.tokenId
                  ? "red"
                  : "grey",
            }}
          >
            <div className="text-center font-bold text-2xl">
              {nft.metadata.name}
            </div>
            <img className="w-52" src={nft.metadata.image} />
          </div>
        ))}
      {selectedNft && <Big onClick={approve}>APPROVE</Big>}
    </div>
  );
}
