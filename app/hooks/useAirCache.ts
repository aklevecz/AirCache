import axios from "axios";
import { ethers } from "ethers";
import { Magic } from "magic-sdk";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import AirCacheInterface from "./AirCache.json";

// const AIRCACHE_ADDRESS = "0xAa9BF9F9AAc188De33c8D3820A4242272507aDe3";
// const FAKE_NFT_ADDRESS = "0xf4822e9fC423c56CB502D8515e356023c06cf643";

const AIRCACHE_ADDRESS = "0x83a3d9bE1F032C1f1eC28F9Fa95B7bf2cC3f36B4";
const FAKE_NFT_ADDRESS = "0xC8dbE0b942e336d52B93075bf024d57CfF6B02D9";

export const maticMumBaiNodeOptions = {
  rpcUrl: "https://rpc-mumbai.maticvigil.com/", // Polygon RPC URL
  chainId: 80001, // Polygon chain id
};

export default function useAirCache(cache: string) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [caches, setCaches] = useState<any[]>([]);
  const router = useRouter();
  useEffect(() => {
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY!, {
      network: maticMumBaiNodeOptions,
    });
    const provider = new ethers.providers.Web3Provider(
      magic.rpcProvider as any
    );
    const signer = provider.getSigner();
    setSigner(signer);

    const contract = new ethers.Contract(
      AIRCACHE_ADDRESS,
      AirCacheInterface.abi,
      provider
    );
    setContract(contract);
  }, []);

  // To do better cache finding mechanism-- just go off of URL?
  useEffect(() => {
    if (contract && signer && cache) {
      (async () => {
        console.log(cache);
        const contractSigner = contract.connect(signer);
        //currently is single cache
        const caches = await contractSigner.caches(parseInt(cache));
        const tokenAddress = caches.tokenAddress;
        const tokenId = caches.tokenId.toNumber();
        console.log(tokenAddress, tokenId);
        const abi = [
          "function tokenURI(uint256) public view returns (string memory)",
        ];
        const tokenContract = new ethers.Contract(
          tokenAddress,
          abi,
          signer.provider
        );
        const uri = await tokenContract.tokenURI(tokenId);
        const baseURI = uri.split(`/${tokenId}`)[0];
        let metaurl = `${baseURI}/metadata/${tokenId
          .toString(16)
          .padStart(64, 0)}.json`;

        const response = await axios.get(metaurl + "?hello");
        console.log(response);
        setCaches([caches]);
      })();
    }
  }, [contract, signer, cache]);

  const createCache = async (lat: number, lng: number) => {
    if (contract && signer) {
      const contractSigner = contract.connect(signer);
      const latBytes = ethers.utils.formatBytes32String(lat.toString());
      const lngBytes = ethers.utils.formatBytes32String(lng.toString());
      const tx = await contractSigner.createCache(latBytes, lngBytes);
      const receipt = await tx.wait();
      for (const event of receipt.events) {
        console.log(event);
      }
    }
  };

  return { caches, createCache };
}
