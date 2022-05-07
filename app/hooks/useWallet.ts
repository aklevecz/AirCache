import axios from "axios";
import { ethers } from "ethers";
import { Magic } from "magic-sdk";
import { useEffect, useState } from "react";
import { provider as AlchemyProvider } from "../libs/web3Api";
import { AIRCACHE_ADDRESS, AIRCACHE_ADDRESS_MATIC } from "../libs/constants";
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
import api from "../libs/api";

const fetcher = async (address: string) => {
  const res = await api.get("/api/get-nft-txs");
  console.log(res.data);
  const data = res.data.result.transfers.map((tx: any) => {
    const meta = { tokenId: 0, contractAddress: "" };
    if (tx.category === "erc1155") {
      meta.tokenId = parseInt(tx.erc1155Metadata[0].tokenId);
      meta.contractAddress = tx.rawContract.address;
    } else {
      meta.tokenId = parseInt(tx.tokenId);
      meta.contractAddress = tx.rawContract.address;
    }
    return meta;
  });
  console.log(data);
  return data;
  return res.data.result.transfers;
  // .filter(
  //   (tx: any) =>
  //     ethers.utils.getAddress(tx.from) ===
  //     ethers.utils.getAddress(AIRCACHE_ADDRESS)
  // );
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
      // fetcher(address).then(console.log);
      // web3Api.getPolyaytsoBalance(address).then((data) => {
      fetcher(address).then((data) => {
        console.log(data);
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
    if (nfts && nfts.length > 0) {
      console.log("what");
      const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY!, {
        network:
          process.env.NODE_ENV === "development"
            ? maticMumBaiNodeOptions
            : maticNodeOptions,
      });
      // const provider = new ethers.providers.Web3Provider(
      //   magic.rpcProvider as any
      // );
      (async () => {
        const uris: string[] = [];
        console.log("nft loop");
        for (let i = 0; i < nfts.length; i++) {
          const nft = nfts[i];
          const storageKey = `${nft.tokenId}-${nft.contractAddress}`;
          let uri = await storage.getItem(storageKey);
          console.log(uri, nft);
          if (!uri) {
            uri = await getTokenURI(
              parseInt(nft.tokenId),
              nft.contractAddress,
              AlchemyProvider
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
              try {
                const res = await axios.get(uri);
                storage.setItem(uri, JSON.stringify(res.data));
                metadatas.push(res.data);
              } catch (e) {
                console.log("broken meta");
              }
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
