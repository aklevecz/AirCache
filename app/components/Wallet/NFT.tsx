import { ipfsToPinata, isIpfs } from "../../libs/utils";
import { useInView } from "react-cool-inview";
import localforage from "localforage";
import { useEffect, useRef } from "react";
import axios from "axios";
import Polygon from "../Icons/Polygon";

export default function NFT({ nft }: any) {
  const { observe, inView } = useInView({
    onEnter: ({ unobserve }) => unobserve(), // only run once
  });
  console.log(nft);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (inView) {
      localforage.getItem(nft.image).then((blob: any) => {
        if (imgRef.current) {
          if (blob) {
            console.log("cached iomg");
            imgRef.current.src = URL.createObjectURL(blob);
          } else {
            const url = isIpfs(nft.image) ? ipfsToPinata(nft.image) : nft.image;
            axios.get(url, { responseType: "arraybuffer" }).then((res) => {
              const blob = new Blob([res.data], {
                type: res.headers["content-type"],
              });
              imgRef.current!.src = URL.createObjectURL(blob);
              localforage.setItem(nft.image, blob);
            });
          }
        }
      });
    }
  }, [inView]);
  return (
    <div
      ref={observe}
      className="bg-black text-white m-10 rounded-lg max-w-sm w-full text-center"
    >
      <div className="text-center font-bold text-2xl mt-4">{nft.name}</div>
      <div className="">
        <img ref={imgRef} className="m-auto p-5 mb-4" />
        <a
          className="bg-polygon px-6 py-2 rounded-full flex items-center justify-around w-40 m-auto"
          target="_blank"
          rel="noreferrer"
          href={`https://opensea.io/assets/matic/${nft.contractAddress}/${nft.tokenId}`}
        >
          OpenSea{" "}
          <div className="w-4">
            <Polygon fill="white" />
          </div>
        </a>
      </div>
    </div>
  );
}
