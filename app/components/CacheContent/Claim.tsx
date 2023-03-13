import { NFT } from "../../libs/types";
import { ipfsToPinata, isIpfs, isWordHunt } from "../../libs/utils";
import Button from "../Button";
import Spinner from "../Loading/Spinner";

type Props = {
  groupName: string;
  NFT: NFT;
  claim: () => void;
  fetching: boolean;
};

export default function Claim({ groupName, NFT, claim, fetching }: Props) {
  return (
    <>
      {!isWordHunt(groupName) && <div className="text-3xl font-bold text-center pb-5">{NFT.name}</div>}
      <div className="p-5 h-[40vh]">
        <img className="m-auto h-full" src={isIpfs(NFT.image) ? ipfsToPinata(NFT.image) : NFT.image} />
      </div>
      <Button className="m-auto w-28 block mt-5 py-3 font-bold text-2xl" onClick={claim}>
        <div className="flex justify-center items-center">
          {/* {txState !== TxState.Fetching ? ( */}
          {!fetching ? (
            "Claim"
          ) : (
            <div className="bg-black rounded-full">
              <Spinner />
            </div>
          )}
        </div>
      </Button>
    </>
  );
}
