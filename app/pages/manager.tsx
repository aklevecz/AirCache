import { ethers } from "ethers";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import Big from "../components/Button/Big";
import Caches from "../components/Manager/Caches";
import Connect from "../components/Manager/Connect";
import Nfts from "../components/Manager/Nfts";
import useWeb3Wallet from "../hooks/useWeb3Wallet";
import {
  abis,
  AIRCACHE_ADDRESS,
  AIRCACHE_ADDRESS_MATIC,
} from "../libs/constants";
import managerApi from "../libs/managerApi";
import Fill from "../components/Manager/Fill";
import Success from "../components/Manager/Success";
import web3Api from "../libs/web3Api";
import { getCachedCaches } from "../libs/storage";

enum View {
  Connect,
  Nfts,
  Caches,
  Fill,
  Success,
}

const Manager: NextPage = () => {
  const [view, setView] = useState(0);

  const web3Wallet = useWeb3Wallet();

  const [fetching, setFetching] = useState(false);

  const [nfts, setNfts] = useState([]);
  const [selectedNft, setSelectedNft] = useState<any>(null);

  const [caches, setCaches] = useState<any[]>([]);
  const [selectedCache, setSelectedCache] = useState(0);

  const onGetNfts = async (tokenAddress?: string) => {
    setFetching(true);
    const nfts = await managerApi.getOwnerNfts(
      web3Wallet.metaMask.accounts[0],
      tokenAddress
    );
    setFetching(false);
    setNfts(nfts as any);
  };

  const clearNfts = () => {
    setNfts([]);
  };

  const isConnected = web3Wallet.metaMask.accounts.length > 0;
  useEffect(() => {
    if (isConnected && view === View.Connect) {
      setView(View.Nfts);
    }
  }, [isConnected, view]);

  const approve = async () => {
    setFetching(true);
    const nftAddress = selectedNft.contract.address;
    const tokenContract = new ethers.Contract(
      nftAddress,
      [
        abis.approve,
        abis.setApprovalForAll,
        abis.isApprovedForAll,
        abis.getApproved,
      ],
      web3Wallet.metaMask.provider!
    );
    const ds = tokenContract.connect(web3Wallet.metaMask.provider!.getSigner());
    const isApprovedForAll = await ds.isApprovedForAll(
      web3Wallet.metaMask.accounts[0],
      AIRCACHE_ADDRESS
    );
    const approvedAddress = await ds.getApproved(selectedNft.id.tokenId);

    const isApproved = isApprovedForAll || approvedAddress === AIRCACHE_ADDRESS;

    if (!isApproved) {
      const signer = tokenContract.connect(
        web3Wallet.metaMask.provider!.getSigner()
      );
      // REFACTOR
      try {
        // const tokenContract = new ethers.Contract(
        //   nftAddress,
        //   [abis.setApprovalForAll],
        //   web3Wallet.metaMask.provider!
        // );
        const signer = tokenContract.connect(
          web3Wallet.metaMask.provider!.getSigner()
        );
        const success = await signer
          .approve(AIRCACHE_ADDRESS, selectedNft.id.tokenId)
          // THIS CATCH DOES NOTHING BECAUSe ITS ALREADY IN A TRY BLOCK -- right?
          .catch((e: any) => {
            setFetching(false);
            return false;
          });
        if (success) {
          setView(View.Caches);
          setFetching(false);
        }
      } catch (e) {
        console.log(e);
        const success = await signer
          .setApprovalForAll(AIRCACHE_ADDRESS, true)
          .catch(() => {
            setFetching(false);
            return false;
          });
        if (success) {
          setView(View.Caches);
          setFetching(false);
        }
      }
    } else {
      setFetching(false);
      setView(View.Caches);
    }
  };

  const fillCache = async () => {
    setFetching(true);
    console.log(web3Wallet.contract);
    console.log(web3Wallet.metaMask.provider);
    const signer = web3Wallet.contract!.connect(
      web3Wallet.metaMask.provider!.getSigner()
    );
    console.log(signer);
    const tokenAddress = selectedNft.contract.address;
    const tokenId = selectedNft.id.tokenId;
    const cacheId = selectedCache;
    console.log("A", tokenAddress, "ID", tokenId, "C", cacheId);

    const tx = await signer
      .holdNFT(tokenAddress, tokenId, cacheId)
      .catch((e: any) => {
        alert(e);
        setFetching(false);
      });
    const receipt = await tx.wait();
    for (const event of receipt.events) {
      if (event.event === "NFTHeld") {
        setView(View.Success);
        setFetching(false);
      }
    }
  };

  const getAvailableCaches = async () => {
    setFetching(true);
    // const numCaches = await web3Wallet.contract!.cacheId();
    // const cachedCaches = await getCachedCaches
    const caches = await web3Api.getAllCaches();
    const emptyCaches = [];
    for (let i = 0; i < caches.length; i++) {
      const id = i + 1;
      const cache = await web3Wallet.contract!.caches(id);
      if (cache.tokenId.toNumber() === 0) {
        emptyCaches.push(cache);
      }
    }
    setCaches(emptyCaches);
    setFetching(false);
  };

  const showBack = (view === 1 && !isConnected) || view > 1;
  console.log(view);
  return (
    <div className="h-full w-full">
      {view === View.Connect && <Connect web3Wallet={web3Wallet} />}
      {view === View.Nfts && (
        <Nfts
          onGetNfts={onGetNfts}
          clearNfts={clearNfts}
          nfts={nfts}
          selectedNft={selectedNft}
          setSelectedNft={setSelectedNft}
          web3Wallet={web3Wallet}
          fetching={fetching}
          approve={approve}
        />
      )}
      {view === View.Caches && (
        // Show a map with the caches, so the user can pick one
        // Categorize caches so user can pick particular ones
        // e.g. City or Series or something
        <Caches
          web3Wallet={web3Wallet}
          getAvailableCaches={getAvailableCaches}
          caches={caches}
          setCaches={setCaches}
          selectedCache={selectedCache}
          setSelectedCache={setSelectedCache}
          goToFillCache={() => setView(View.Fill)}
          fetching={fetching}
        />
      )}

      {view === View.Fill && (
        <Fill
          fillCache={fillCache}
          nft={selectedNft}
          cache={selectedCache}
          fetching={fetching}
        />
      )}
      {view === View.Success && (
        <Success nft={selectedNft} cache={selectedCache} />
      )}
      {showBack && (
        <Big onClick={() => setView(view - 1)} className="fixed top-5 left-5">
          Go back
        </Big>
      )}
    </div>
  );
};

export default Manager;
