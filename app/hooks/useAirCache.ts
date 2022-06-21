import axios from "axios";
import { ethers } from "ethers";
import { Magic } from "magic-sdk";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { abis, AIRCACHE_ADDRESS, oldContracts } from "../libs/constants";
import { prod } from "../libs/env";
import storage from "../libs/storage";
import {
  ipfsToPinata,
  isIpfs,
  maticMumBaiNodeOptions,
  maticNodeOptions,
} from "../libs/utils";
import { AlchemyProvider, oldCacheContracts } from "../libs/web3Api";

import AirCacheInterface from "./AirYaytso.json";

// const AIRCACHE_ADDRESS = "0xAa9BF9F9AAc188De33c8D3820A4242272507aDe3"; 0x83a3d9bE1F032C1f1eC28F9Fa95B7bf2cC3f36B4
// const FAKE_NFT_ADDRESS = "0xf4822e9fC423c56CB502D8515e356023c06cf643";

const CACHE_VERSION = "2";

export default function useAirCache(cacheId: string | null) {
  const [oldCaches, setOldCaches] = useState<ethers.Contract[]>([]);
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
      network: !prod ? maticMumBaiNodeOptions : maticNodeOptions,
      // network: maticNodeOptions,
    });
    const provider = new ethers.providers.Web3Provider(
      magic.rpcProvider as any
    );
    console.log(provider);
    setProvider(provider);
    const signer = provider.getSigner();
    setSigner(signer);
    const contract = new ethers.Contract(
      AIRCACHE_ADDRESS,
      AirCacheInterface.abi,
      AlchemyProvider
    );

    setOldCaches(oldCacheContracts);

    // Invalidations
    let invalidate = false;
    const activeCacheContract = storage.getItem(
      storage.keys.active_cache_contract_address
    );
    const cacheVersion = storage.getItem(storage.keys.version);
    if (cacheVersion !== CACHE_VERSION) {
      invalidate = true;
    }
    if (activeCacheContract !== AIRCACHE_ADDRESS) {
      invalidate = true;
    }
    if (invalidate) {
      const token = storage.getItem(storage.keys.token);
      localStorage.clear();
      if (token) storage.setItem(storage.keys.token, token);
      storage.setItem(
        storage.keys.active_cache_contract_address,
        AIRCACHE_ADDRESS
      );
      storage.setItem(storage.keys.version, CACHE_VERSION);
    }

    setContract(contract);
  }, []);

  const getCachedCaches = async (numCaches: number, address: string) => {
    const caches: any = { cached: [], new: [] };
    for (let i = 1; i <= numCaches; i++) {
      const cacheKey = `cache_${address}_${i}`;
      const cachedCache = storage.getItem(cacheKey);
      if (!cachedCache) {
        caches.new.push(i);
      } else {
        caches.cached.push({ ...JSON.parse(cachedCache), id: i, NFT: {} });
      }
    }

    return caches;
  };

  const getCache = async (cacheId: number, givenContract?: ethers.Contract) => {
    const cacheContract = givenContract ? givenContract : contract;
    if (cacheContract) {
      const cache = await cacheContract.caches(cacheId);
      const cacheKey = `cache_${cacheContract.address}_${cacheId}`;
      const cachedCache = storage.getItem(cacheKey);
      const lat = ethers.utils.parseBytes32String(cache.lat);
      const lng = ethers.utils.parseBytes32String(cache.lng);
      if (!cachedCache) {
        storage.setItem(
          cacheKey,
          JSON.stringify({
            contractAddress: cacheContract.address,
            lat,
            lng,
          })
        );
      }
      const tokenAddress = cache.tokenAddress;
      const tokenId = cache.tokenId.toNumber();
      return {
        ...cache,
        contractAddress: cacheContract.address,
        id: cache.id.toNumber(),
        lat,
        lng,
        tokenAddress,
        tokenId,
      };
    }
  };

  const getNFTMeta = async (
    tokenId: number,
    tokenAddress: string,
    givenProvider?: ethers.providers.Provider
  ) => {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [abis.tokenURI, abis.uri],
      AlchemyProvider
    );
    console.log("getting nft meta");
    console.log(tokenId);
    const uriKey = `${tokenId}-${tokenAddress}`;
    let uri = await storage.getItem(uriKey);
    console.log(uri);
    if (!uri) {
      try {
        // erc 721
        uri = await tokenContract.tokenURI(tokenId);
        console.log(uri);
      } catch (e) {
        console.log(e);
        uri = await tokenContract.uri(tokenId);
        console.log(uri);
      }
      // this is the metadata url that might have token replacement
      if (uri) uri = uri.replace("{id}", tokenId.toString());
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
    let metadata = await storage.getItem(uri);
    console.log(metadata);
    // if not IPFS
    if (!isIpfs(uri)) {
      // If it has id replacement
      // let url = "";
      // if (uri.includes("{id}")) {
      //   url = uri.replace("{id}", tokenId.toString());
      // }
      let url = uri;
      if (!metadata) {
        console.log(url);
        const response = await axios.get(url);
        metadata = response.data;
        await storage.setItem(uri, JSON.stringify(metadata));
      } else {
        console.log("from storage");
        metadata = JSON.parse(metadata);
      }
      return metadata;
    }
    // const baseUrl = "https://gateway.pinata.cloud/ipfs/";
    // let metaurl = `${uri.replace("ipfs://", baseUrl)}`;

    // let metadata = await storage.getItem(uri);

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
        const cache = await getCache(parseInt(cacheId), contract);
        // console.log(cache);
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
        const allContracts = [...oldCaches, contract];
        const caches = [];
        for (let i = 0; i < allContracts.length; i++) {
          const contract = allContracts[i];
          const numOfCaches = (await contract.cacheId()).toNumber();
          const cachedData = await getCachedCaches(
            numOfCaches,
            contract.address
          );
          caches.push(...cachedData.cached);
          for (let i = 0; i < cachedData.new.length; i++) {
            const cache = await getCache(cachedData.new[i], contract);
            let NFT: object | null = {};
            caches.push({ ...cache, NFT });
          }
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
        console.log(signer);
        const tx = await contractSigner.createCache(latBytes, lngBytes);
        console.log(tx);
        const receipt = await tx.wait();
        for (const event of receipt.events) {
          console.log(event);
        }
        return true;
      } catch (e) {
        alert(e);
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
