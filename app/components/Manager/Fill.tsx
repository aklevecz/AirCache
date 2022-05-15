import { Web3Wallet } from "../../libs/types";
import Big from "../Button/Big";
import BlackWrappedSpinner from "../Loading/BlackWrappedSpinner";

import metaMaskWhite from "../../assets/icons/metamask_white.svg";
import { ipfstoIO, isIpfs } from "../../libs/utils";

type Props = {
  nft: any;
  cache: any;
  fetching: boolean;
  fillCache: () => void;
};
export default function Fill({ nft, cache, fetching, fillCache }: Props) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="text-3xl font-bold mb-5">Ready to fill?</div>
      <div>
        <div className="text-center text-2xl">{nft.metadata.name}</div>
        <img
          className="max-w-xs p-4"
          src={
            isIpfs(nft.metadata.image)
              ? ipfstoIO(nft.metadata.image)
              : nft.metadata.image
          }
        />
      </div>
      <div>
        <div className="text-2xl bg-white text-black p-2 px-4 font-bold">
          Cache: {cache}
        </div>
      </div>
      <Big onClick={fillCache} className="mt-5 text-3xl px-10 text-blue-500">
        {fetching ? <BlackWrappedSpinner /> : "Fill"}
      </Big>
    </div>
  );
}
