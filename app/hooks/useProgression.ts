import { useEffect, useState } from "react";
import { getOwnerNfts } from "../libs/managerApi";
import storage from "../libs/storage";
import useAuth from "./useAuth";
import useHuntMeta from "./useHuntMeta";

export default function useProgression() {
  const auth = useAuth();

  const address = auth.user ? auth.user.publicAddress : "";

  const [groupName, setGroupName] = useState("");
  console.log(groupName);
  const { huntMeta } = useHuntMeta(groupName);

  const [collected, setCollected] = useState([]);

  // This could call the contracts method to grab the token types of the user
  // then you can just use that to make the metadata url
  // e.g. ['dnd'] => cdn.yaytso.art/magicmap/metadata/dnd.json
  // uri is predictable
  const updateCollected = async () => {
    const { contract } = huntMeta;
    console.log(contract);
    getOwnerNfts(address, contract).then(async (nfts) => {
      console.log(nfts);

      const metadatas = [];
      for (const nft of nfts!) {
        const metadata = await fetch(`${nft.tokenUri.gateway}`).then((r) => r.json());
        metadatas.push(metadata);
      }

      // const metadatas = nfts?.map((nft) => {
      //   const metadata = nft.metadata;
      //   console.log(nft.tokenUri.gateway);

      //   return metadata;
      // });
      const deduped = metadatas?.reduce((pv, cv) => {
        const isDupe = pv.find((o: any) => o.image === cv.image);
        // o.name === cv.name && o.tokenAddress === cv.tokenAddress);
        if (!isDupe) {
          pv.push(cv);
        }
        return pv;
      }, []);
      console.log(metadatas);
      console.log(deduped);
      setCollected(deduped);
      //   setMetadatas(metadatas as any);
      //   setFetching(false);
    });
  };

  useEffect(() => {
    console.log(huntMeta);
    if (huntMeta) {
      updateCollected();
    }
  }, [huntMeta]);

  useEffect(() => {
    if (address) {
      const currentGroup = storage.getItem(storage.keys.current_group);
      // @todo CHANGE -- SHOULD PULL FROM HUNT TYPE
      if (currentGroup === "prog" || currentGroup === "magicmap") {
        setGroupName(currentGroup);
      }
    }
  }, [address]);

  return { collected, updateCollected };
}
