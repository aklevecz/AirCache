import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import {
  colors,
  PIXELTROSS_ADDRESS_MUMBAI,
  POLYAYTSO_ADDRESS_MATIC,
} from "../../libs/constants";
import { Web3Wallet } from "../../libs/types";
import { ipfstoIO, isIpfs } from "../../libs/utils";
import Big from "../Button/Big";
import Img from "../Img";
import BlackWrappedSpinner from "../Loading/BlackWrappedSpinner";

type Props = {
  onGetNfts: (tokenAddress?: string) => void;
  clearNfts: () => void;
  nfts: any;
  selectedNft: any;
  setSelectedNft: any;
  web3Wallet: Web3Wallet;
  fetching: boolean;
  approve: () => void;
  message: string;
};

export default function Nfts({
  onGetNfts,
  clearNfts,
  nfts,
  selectedNft,
  setSelectedNft,
  fetching,
  approve,
  message,
}: Props) {
  const [tokenAddress, setTokenAddress] = useState(PIXELTROSS_ADDRESS_MUMBAI);
  const [toggleTokenAddress, setToggleTokenAddress] = useState(false);

  const tryAgain = () => {
    clearNfts();
    setSelectedNft(null);
  };

  const onChangeTokenAddress = (e: FormEvent<HTMLInputElement>) => {
    setTokenAddress(e.currentTarget.value);
  };

  const noNfts = nfts.length === 0;
  const queryText = toggleTokenAddress ? "Query NFTs" : "Query all NFTs";
  return (
    <>
      <div
        className="flex flex-col items-center m-auto h-full overflow-scroll"
        style={{ maxHeight: "90vh" }}
      >
        {noNfts && (
          <div className="flex flex-col h-full items-center justify-center">
            <div className="text-4xl text-center w-5/6 mb-5 font-bold">
              Time to pick one of your NFTs to stash!
            </div>
            <div className="text-2xl text-center w-3/4 mb-10 font-bold">
              We recommend using a specific token address, but you can also try
              querying all of your NFTs
            </div>
            <Big
              className="text-2xl px-12 mb-6"
              onClick={() => setToggleTokenAddress(!toggleTokenAddress)}
            >
              {!toggleTokenAddress
                ? "Use a token address"
                : "Nevermind, try fetching all"}
            </Big>
            {toggleTokenAddress && (
              <motion.input
                layout
                className="w-full max-w-xs mt-0 mb-6 p-2"
                onChange={onChangeTokenAddress}
                value={tokenAddress}
                placeholder="token address"
              ></motion.input>
            )}
            <Big
              className="text-2xl px-12"
              onClick={() => onGetNfts(toggleTokenAddress ? tokenAddress : "")}
            >
              {fetching ? <BlackWrappedSpinner /> : queryText}
            </Big>
            <div className="mt-5 text-2xl" style={{ color: colors.red }}>
              {message}
            </div>
          </div>
        )}
        {!noNfts && (
          <div className="text-2xl font-bold m-5">
            Click on a NFT and approve it for transfer
          </div>
        )}
        {nfts &&
          nfts.map((nft: any) => {
            const isSelected =
              selectedNft &&
              selectedNft.contract.address + selectedNft.id.tokenId ===
                nft.contract.address + nft.id.tokenId;
            return (
              <div
                key={nft.contract.address + nft.id.tokenId}
                onClick={() => {
                  setSelectedNft(nft);
                }}
                className="flex mb-0 p-5 transition-colors duration-500 items-center w-3/4 min-w-md cursor-pointer flex-wrap"
                style={{
                  display: !nft.metadata.name ? "none" : "flex",
                  backgroundColor: isSelected ? colors.lavender : "black",
                  justifyContent: isSelected ? "space-around" : "inherit",
                }}
              >
                <div>
                  <div className="font-bold text-2xl">{nft.metadata.name}</div>
                  <div className="font-bold text-1xl">
                    {nft.metadata.description}
                  </div>
                </div>

                {nft.metadata.image && isSelected && (
                  <Img uri={nft.metadata.image} className="w-52 p-4" />
                  // <img
                  //   className="w-52"
                  //   src={
                  //     isIpfs(nft.metadata.image)
                  //       ? ipfstoIO(nft.metadata.image)
                  //       : nft.metadata.image
                  //   }
                  // />
                )}
                {isSelected && (
                  <Big
                    className=" bottom-10"
                    onClick={approve}
                    disabled={fetching}
                  >
                    {fetching ? <BlackWrappedSpinner /> : "APPROVE"}
                  </Big>
                )}
              </div>
            );
          })}
      </div>
      <div className="flex justify-around p-5">
        {nfts.length > 0 && (
          <Big onClick={tryAgain} className=" bottom-24">
            Try again
          </Big>
        )}
        {/* {selectedNft && (
          <Big className=" bottom-10" onClick={approve} disabled={fetching}>
            {fetching ? <BlackWrappedSpinner /> : "APPROVE"}
          </Big>
        )} */}
      </div>
    </>
  );
}
