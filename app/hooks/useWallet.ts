import axios from "axios";
import { ethers } from "ethers";
import { Magic } from "magic-sdk";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { AIRCACHE_ADDRESS } from "../libs/constants";
import storage from "../libs/storage";
import {
  delay,
  getTokenURI,
  ipfsToPinata,
  isIpfs,
  maticNodeOptions,
} from "../libs/utils";
import { maticMumBaiNodeOptions } from "../libs/utils";
import web3Api from "../libs/web3Api";

const fetcher = async (address: string) => {
  const url = `https://api${
    process.env.NODE_ENV === "development" ? "-testnet" : ""
  }.polygonscan.com/api?module=account&action=tokennfttx&address=${address}&page=1&startblock=0&sort=asc&apikey=SZT746XM864NP7Y7WQ5HXQ6T4YJV7ZWHR4`;
  console.log(url);
  const res = await axios.get(url);

  return res.data.result.filter(
    (tx: any) =>
      ethers.utils.getAddress(tx.from) ===
      ethers.utils.getAddress(AIRCACHE_ADDRESS)
  );
};

export default function useWallet(address: string) {
  //   const {
  //     data: nfts,
  //     error,
  //     mutate,
  //   } = useSWR(address && "/nfts", () => fetcher(address));

  const [fetching, setFetching] = useState(true);
  const [nfts, setNfts] = useState<any[] | null>([]);
  const [uris, setUris] = useState<string[]>([]);
  const [metadatas, setMetadatas] = useState<any[]>([]);

  useEffect(() => {
    if (address) {
      web3Api.getPolyaytsoBalance(address).then((data) => {
        // fetcher(address).then((data) => {
        if (data.length === 0) {
          console.log("no txs");
          setFetching(false);
        } else {
          setNfts(data);
        }
      });
    }
  }, [address]);

  useEffect(() => {
    if (nfts) {
      const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY!, {
        network:
          process.env.NODE_ENV === "development"
            ? maticMumBaiNodeOptions
            : maticNodeOptions,
      });
      const provider = new ethers.providers.Web3Provider(
        magic.rpcProvider as any
      );
      (async () => {
        const uris: string[] = [];
        for (let i = 0; i < nfts.length; i++) {
          const nft = nfts[i];
          const storageKey = `${nft.tokenID}-${nft.contractAddress}`;
          console.log(nft);
          let uri = await storage.getItem(storageKey);
          if (!uri) {
            uri = await getTokenURI(
              parseInt(nft.tokenID),
              nft.contractAddress,
              provider
            );
            console.log(uri);
            if (uri) {
              await storage.setItem(storageKey, uri);
            } else {
              await storage.setItem(storageKey, "null");
            }
          }
          if (uri && uri !== "null") {
            uris.push(uri);
          }
        }
        if (uris.length > 0) {
          setUris(uris);
        } else {
          nfts.length > 0 && setFetching(false);
        }
      })();
    }
  }, [nfts]);

  useEffect(() => {
    if (uris.length > 0) {
      console.log("fetching metadata");
      (async () => {
        const metadatas = [];
        for (let i = 0; i < uris.length; i++) {
          const uri = uris[i];
          const metadata = await storage.getItem(uri);
          if (metadata) {
            metadatas.push(JSON.parse(metadata));
          } else {
            if (isIpfs(uri)) {
              const url = ipfsToPinata(uri);
              try {
                await delay();
                const res = await axios.get(url);
                storage.setItem(uri, JSON.stringify(res.data));
                metadatas.push(res.data);
              } catch (e) {
                console.log(e);
              }
            } else {
              const res = await axios.get(uri);
              storage.setItem(uri, JSON.stringify(res.data));
              metadatas.push(res.data);
            }
          }
        }
        if (metadatas.length > 0) {
          setMetadatas(metadatas);
        } else {
        }
        setFetching(false);
      })();
    }
  }, [uris]);

  return { fetching, nfts, uris, metadatas };
}
