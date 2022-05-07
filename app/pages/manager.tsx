import { ethers } from "ethers";
import { NextPage } from "next";
import { useState } from "react";
import Caches from "../components/Manager/Caches";
import Connect from "../components/Manager/Connect";
import Nfts from "../components/Manager/Nfts";
import useWeb3Wallet from "../hooks/useWeb3Wallet";
import managerApi from "../libs/managerApi";

const Manager: NextPage = () => {
  const web3Wallet = useWeb3Wallet();
  const [nfts, setNfts] = useState([]);
  const [selectedNft, setSelectedNft] = useState<any>(null);

  const [caches, setCaches] = useState([]);
  const [selectedCache, setSelectedCache] = useState(0);

  const onGetNfts = async () => {
    const nfts = await managerApi.getOwnerNfts(web3Wallet.metaMask.accounts[0]);
    setNfts(nfts as any);
  };
  return (
    <div>
      <Connect web3Wallet={web3Wallet} />
      <Nfts
        onGetNfts={onGetNfts}
        nfts={nfts}
        selectedNft={selectedNft}
        setSelectedNft={setSelectedNft}
        web3Wallet={web3Wallet}
      />
      <Caches
        web3Wallet={web3Wallet}
        caches={caches}
        setCaches={setCaches}
        selectedCache={selectedCache}
        setSelectedCache={setSelectedCache}
      />

      <button
        onClick={async () => {
          console.log(selectedCache);
          console.log(selectedNft);
          const signer = web3Wallet.contract!.connect(
            web3Wallet.metaMask.provider!.getSigner()
          );
          const tokenAddress = selectedNft.contract.address;
          const tokenId = selectedNft.id.tokenId;
          const cacheId = selectedCache;
          await signer.holdNFT(tokenAddress, tokenId, cacheId);
        }}
      >
        hold NFT
      </button>
    </div>
  );
};

export default Manager;
