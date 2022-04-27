import { ipfsToPinata, isIpfs } from "../../libs/utils";
import { useInView } from "react-cool-inview";
import localforage from "localforage";
import { useEffect, useRef } from "react";
import axios from "axios";

export default function NFT({ nft }: any) {
  const { observe, inView } = useInView({
    onEnter: ({ unobserve }) => unobserve(), // only run once
  });

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
    <div ref={observe} className="bg-white text-black m-2 rounded-lg max-w-sm">
      <div className="text-center font-bold text-2xl mt-4">{nft.name}</div>
      <div>
        <img ref={imgRef} className="m-auto p-5" />
      </div>
    </div>
  );
}
