import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { POLYAYTSO_ADDRESS_MATIC } from "../../libs/constants";
import { Web3Wallet } from "../../libs/types";
import { ipfstoIO, isIpfs } from "../../libs/utils";
import Big from "../Button/Big";
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
};

export default function Nfts({
  onGetNfts,
  clearNfts,
  nfts,
  selectedNft,
  setSelectedNft,
  fetching,
  approve,
}: Props) {
  const [tokenAddress, setTokenAddress] = useState(POLYAYTSO_ADDRESS_MATIC);
  const [toggleTokenAddress, setToggleTokenAddress] = useState(false);

  const tryAgain = () => {
    clearNfts();
    setSelectedNft(null);
  };

  const onChangeTokenAddress = (e: FormEvent<HTMLInputElement>) => {
    setTokenAddress(e.currentTarget.value);
  };

  const noNfts = nfts.length === 0;
  return (
    <>
      <div
        className="flex flex-col items-center m-auto h-full overflow-scroll"
        style={{ maxHeight: "90vh" }}
      >
        {noNfts && (
          <>
            <div className="text-2xl text-center w-5/6 mb-5">
              Get your available NFTs or input a token address
            </div>
            <Big
              className="mb-2"
              onClick={() => setToggleTokenAddress(!toggleTokenAddress)}
            >
              {!toggleTokenAddress
                ? "Use a token address"
                : "Nevermind, try fetching all"}
            </Big>
            {toggleTokenAddress && (
              <motion.input
                layout
                className="w-full max-w-xs m-5 p-2"
                onChange={onChangeTokenAddress}
                value={tokenAddress}
                placeholder="token address"
              ></motion.input>
            )}
            <Big
              onClick={() => onGetNfts(toggleTokenAddress ? tokenAddress : "")}
            >
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
              className="mb-0 p-5 transition-colors duration-500"
              style={{
                display: !nft.metadata.name ? "none" : "block",
                backgroundColor:
                  selectedNft &&
                  selectedNft.contract.address + selectedNft.id.tokenId ===
                    nft.contract.address + nft.id.tokenId
                    ? "red"
                    : "black",
              }}
            >
              <div className="text-center font-bold text-2xl">
                {nft.metadata.name}
              </div>
              {nft.metadata.image && (
                <img
                  className="w-52"
                  src={
                    isIpfs(nft.metadata.image)
                      ? ipfstoIO(nft.metadata.image)
                      : nft.metadata.image
                  }
                />
              )}
            </div>
          ))}
      </div>
      <div className="flex justify-around p-5">
        {nfts.length > 0 && (
          <Big onClick={tryAgain} className=" bottom-24">
            Try again
          </Big>
        )}
        {selectedNft && (
          <Big className=" bottom-10" onClick={approve} disabled={fetching}>
            {fetching ? <BlackWrappedSpinner /> : "APPROVE"}
          </Big>
        )}
      </div>
    </>
  );
}
