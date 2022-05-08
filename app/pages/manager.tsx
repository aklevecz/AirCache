import { ethers } from "ethers";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import Caches from "../components/Manager/Caches";
import Connect from "../components/Manager/Connect";
import Nfts from "../components/Manager/Nfts";
import useWeb3Wallet from "../hooks/useWeb3Wallet";
import { abis, AIRCACHE_ADDRESS_MATIC } from "../libs/constants";
import managerApi from "../libs/managerApi";

enum View {
  Connect,
  Nfts,
  Caches,
  Fill,
}

const Manager: NextPage = () => {
  const [view, setView] = useState(0);

  const web3Wallet = useWeb3Wallet();

  const [fetching, setFetching] = useState(false);

  const [nfts, setNfts] = useState([]);
  const [selectedNft, setSelectedNft] = useState<any>(null);

  const [caches, setCaches] = useState<any[]>([]);
  const [selectedCache, setSelectedCache] = useState(0);

  const onGetNfts = async () => {
    setFetching(true);
    const nfts = await managerApi.getOwnerNfts(web3Wallet.metaMask.accounts[0]);
    setFetching(false);
    setNfts(nfts as any);
  };

  const isConnected = web3Wallet.metaMask.accounts.length > 0;
  useEffect(() => {
    if (isConnected && view === View.Connect) {
      setView(View.Nfts);
    }
  }, [isConnected]);

  const approve = async () => {
    setFetching(true);
    const nftAddress = selectedNft.contract.address;
    const tokenContract = new ethers.Contract(
      nftAddress,
      [abis.approve, abis.setApprovalForAll, abis.isApprovedForAll],
      web3Wallet.metaMask.provider!
    );
    const ds = tokenContract.connect(web3Wallet.metaMask.provider!.getSigner());
    const isApproved = await ds.isApprovedForAll(
      web3Wallet.metaMask.accounts[0],
      AIRCACHE_ADDRESS_MATIC
    );
    if (!isApproved) {
      const signer = tokenContract.connect(
        web3Wallet.metaMask.provider!.getSigner()
      );
      try {
        const tokenContract = new ethers.Contract(
          nftAddress,
          [abis.setApprovalForAll],
          web3Wallet.metaMask.provider!
        );
        const signer = tokenContract.connect(
          web3Wallet.metaMask.provider!.getSigner()
        );
        await signer.approve(AIRCACHE_ADDRESS_MATIC, selectedNft.id.tokenId);
      } catch (e) {
        await signer.setApprovalForAll(AIRCACHE_ADDRESS_MATIC, true);
      }
    }
    setView(View.Caches);
    setFetching(false);
  };

  const getAvailableCaches = async () => {
    setFetching(true);
    const numCaches = await web3Wallet.contract!.cacheId();
    setCaches(new Array(numCaches));
    setFetching(false);
  };

  return (
    <div className="h-full w-full">
      {view === View.Connect && <Connect web3Wallet={web3Wallet} />}
      {view === View.Nfts && (
        <Nfts
          onGetNfts={onGetNfts}
          nfts={nfts}
          selectedNft={selectedNft}
          setSelectedNft={setSelectedNft}
          web3Wallet={web3Wallet}
          fetching={fetching}
          approve={approve}
        />
      )}
      {view === View.Caches && (
        <Caches
          web3Wallet={web3Wallet}
          getAvailableCaches={getAvailableCaches}
          caches={caches}
          setCaches={setCaches}
          selectedCache={selectedCache}
          setSelectedCache={setSelectedCache}
          fetching={fetching}
        />
      )}

      {view === View.Fill && (
        <button
          onClick={async () => {
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
      )}
    </div>
  );
};

export default Manager;
