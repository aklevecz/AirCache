import axios from "axios";
import { ethers } from "ethers";
import { Magic } from "magic-sdk";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { AIRCACHE_ADDRESS } from "../libs/constants";
import storage from "../libs/storage";
import { delay, getTokenURI, ipfsToPinata, isIpfs } from "../libs/utils";
import { maticMumBaiNodeOptions } from "../libs/utils";

const fetcher = async (address: string) => {
  const res = await axios.get(
    `https://api-testnet.polygonscan.com/api?module=account&action=tokennfttx&address=${address}&page=1&startblock=0&sort=asc&apikey=SZT746XM864NP7Y7WQ5HXQ6T4YJV7ZWHR4`
  );

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

  const [nfts, setNfts] = useState<any[] | null>([]);
  const [uris, setUris] = useState<string[]>([]);
  const [metadatas, setMetadatas] = useState<any[]>([]);

  useEffect(() => {
    if (address) {
      fetcher(address).then((data) => {
        console.log(data);
        setNfts(data);
      });
    }
  }, [address]);

  useEffect(() => {
    if (nfts) {
      const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY!, {
        network: maticMumBaiNodeOptions,
      });
      const provider = new ethers.providers.Web3Provider(
        magic.rpcProvider as any
      );
      (async () => {
        const uris: string[] = [];
        for (let i = 0; i < nfts.length; i++) {
          const nft = nfts[i];
          const storageKey = `${nft.tokenID}-${nft.contractAddress}`;
          let uri = await storage.getItem(storageKey);
          if (!uri) {
            uri = await getTokenURI(
              parseInt(nft.tokenID),
              nft.contractAddress,
              provider
            );
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
        setUris(uris);
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
              // shim -- probably take this out
              const split = uri.split(`https://cdn.yaytso.art/`);
              const baseURI = `https://cdn.yaytso.art`;
              const tokenId = parseInt(split[1]);
              if (!isNaN(tokenId)) {
                let metaurl = `${baseURI}/metadata/${tokenId
                  .toString(16)
                  .padStart(64, "0")}.json`;
                try {
                  const res = await axios.get(metaurl);
                  storage.setItem(uri, JSON.stringify(res.data));
                  metadatas.push(res.data);
                } catch (e) {}
              }
            }
          }
        }
        setMetadatas(metadatas);
      })();
    }
  }, [uris]);

  return { nfts, uris, metadatas };
}
