import axios from "axios";
import { ethers } from "ethers";
import { Magic } from "magic-sdk";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { abis, AIRCACHE_ADDRESS } from "../libs/constants";
import storage from "../libs/storage";
import { ipfsToPinata, isIpfs } from "../libs/utils";

import AirCacheInterface from "./AirCache.json";

// const AIRCACHE_ADDRESS = "0xAa9BF9F9AAc188De33c8D3820A4242272507aDe3"; 0x83a3d9bE1F032C1f1eC28F9Fa95B7bf2cC3f36B4
// const FAKE_NFT_ADDRESS = "0xf4822e9fC423c56CB502D8515e356023c06cf643";

export const maticMumBaiNodeOptions = {
  rpcUrl: "https://rpc-mumbai.maticvigil.com/", // Polygon RPC URL
  chainId: 80001, // Polygon chain id
};

export default function useAirCache(cacheId: string | null) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Provider | null>(
    null
  );
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [caches, setCaches] = useState<any[] | null>([]);
  const [emptyCache, setEmptyCache] = useState(false);

  const [web3Ready, setWeb3Ready] = useState(false);
  useEffect(() => {
    console.log("air cache init");
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY!, {
      network: maticMumBaiNodeOptions,
    });
    const provider = new ethers.providers.Web3Provider(
      magic.rpcProvider as any
    );
    setProvider(provider);
    const signer = provider.getSigner();
    setSigner(signer);
    const contract = new ethers.Contract(
      AIRCACHE_ADDRESS,
      AirCacheInterface.abi,
      provider
    );
    setContract(contract);
  }, []);

  const getCachedCaches = async (numCaches: number) => {
    // const cache = await contract.caches(cacheId);
    const caches: any = { cached: [], new: [] };
    for (let i = 1; i <= numCaches; i++) {
      const cacheKey = `cache_${i}`;
      const cachedCache = storage.getItem(cacheKey);
      if (!cachedCache) {
        // const cache = await contract.caches(cacheId);
        caches.new.push(i);
        // storage.setItem(
        //   cacheKey,
        //   JSON.stringify({
        //     lat: ethers.utils.parseBytes32String(cache.lat),
        //     lng: ethers.utils.parseBytes32String(cache.lng),
        //   })
        // );
      } else {
        caches.cached.push({ ...JSON.parse(cachedCache), id: i, NFT: {} });
      }
    }

    return caches;
  };

  const getCache = async (cacheId: number, givenContract?: ethers.Contract) => {
    console.log(contract, cacheId);
    if (contract) {
      console.log("getting a cache");
      const cache = await contract.caches(cacheId);
      const cacheKey = `cache_${cacheId}`;
      const cachedCache = storage.getItem(cacheKey);
      if (!cachedCache) {
        storage.setItem(
          cacheKey,
          JSON.stringify({
            lat: ethers.utils.parseBytes32String(cache.lat),
            lng: ethers.utils.parseBytes32String(cache.lng),
          })
        );
      }
      const tokenAddress = cache.tokenAddress;
      const tokenId = cache.tokenId.toNumber();
      return { ...cache, tokenAddress, tokenId };
    }
  };

  const getNFTMeta = async (
    tokenId: number,
    tokenAddress: string,
    givenProvider?: ethers.providers.Provider
  ) => {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [abis.tokenURI],
      provider!
    );
    console.log("getting nft meta");
    const uriKey = `${tokenId}-${tokenAddress}`;
    let uri = await storage.getItem(uriKey);
    console.log(uri);
    if (!uri) {
      uri = await tokenContract.tokenURI(tokenId);
      await storage.setItem(uriKey, uri ? uri : "null");
    }
    if (!uri) {
      console.error("something wrong");
      return {};
    }
    // const baseURI = uri.split(`/${tokenId}`)[0];
    // const tid = tokenId % 9;
    // let metaurl = `${baseURI}/metadata/${tid
    //   .toString(16)
    //   .padStart(64, "0")}.json`;
    if (!isIpfs(uri)) {
      // This should just return the uri
      return uri;
    }
    // const baseUrl = "https://gateway.pinata.cloud/ipfs/";
    // let metaurl = `${uri.replace("ipfs://", baseUrl)}`;

    let metadata = await storage.getItem(uri);

    if (!metadata) {
      const metaurl = ipfsToPinata(uri);
      const response = await axios.get(metaurl);
      metadata = response.data;
      await storage.setItem(uri, JSON.stringify(metadata));
    } else {
      console.log("from storage");
      metadata = JSON.parse(metadata);
    }

    return metadata;
  };

  const collectCacheMeta = async () => {
    if (contract && signer) {
      console.log("collecting meta");

      const contractSigner = contract.connect(signer);

      // IF SINGLE CACHEE
      if (contract && signer && cacheId) {
        const cache = await getCache(parseInt(cacheId), contractSigner);
        const { tokenId, tokenAddress } = cache;
        let NFT: object | null = {};
        if (tokenId === 0) {
          setEmptyCache(true);
          console.error("cache is empty");
        } else {
          NFT = await getNFTMeta(tokenId, tokenAddress, signer.provider!);
        }
        setCaches([{ ...cache, NFT }]);

        // IF ALL CACHE
      } else if (cacheId === null) {
        console.log("collecting all");
        const numOfCaches = (await contract.cacheId()).toNumber();
        const cachedData = await getCachedCaches(numOfCaches);
        console.log(cachedData);
        const caches = [...cachedData.cached];
        console.log(caches);
        for (let i = 0; i < cachedData.new.length; i++) {
          const n = i + 1;
          console.log("get cache from blockchain");
          const cache = await getCache(cachedData.new[i], contractSigner);
          let NFT: object | null = {};
          // if (cache.tokenId) {
          //   NFT = await getNFTMeta(
          //     cache.tokenId,
          //     cache.tokenAddress,
          //     signer.provider!
          //   );
          // }
          caches.push({ ...cache, NFT });
        }
        setCaches(caches);
      }
    }
  };
  useEffect(() => {
    if (contract && signer && cacheId !== undefined) {
      setWeb3Ready(true);
    }
  }, [contract, signer, cacheId]);

  const createCache = async (lat: number, lng: number) => {
    if (contract && signer) {
      const contractSigner = contract.connect(signer);
      const latBytes = ethers.utils.formatBytes32String(lat.toString());
      const lngBytes = ethers.utils.formatBytes32String(lng.toString());
      try {
        const tx = await contractSigner.createCache(latBytes, lngBytes);
        const receipt = await tx.wait();
        for (const event of receipt.events) {
          console.log(event);
        }
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
  };

  const fillCache = async (
    cacheId: number,
    tokenId: number,
    tokenAddress: string
  ) => {
    if (contract && signer) {
      const contractSigner = contract.connect(signer);
      try {
        const tx = await contractSigner.holdNFT(tokenAddress, tokenId, cacheId);
        const receipt = await tx.wait();
        for (const event of receipt.events) {
          console.log(event);
        }
        return true;
      } catch (e) {
        console.error(e);
      }
    }
    return false;
  };
  const loading = !caches && !emptyCache;

  return {
    contract,
    signer,
    caches,
    createCache,
    collectCacheMeta,
    fillCache,
    getCache,
    getNFTMeta,
    loading,
    web3Ready,
  };
}
