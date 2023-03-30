import { NFT } from "../../libs/types";
import { ipfsToPinata, isIpfs, isWordHunt } from "../../libs/utils";
import Button from "../Button";
import Spinner from "../Loading/Spinner";

type Props = {
  groupName: string;
  NFT: NFT;
  claim: () => void;
  fetching: boolean;
  huntType: string;
};

const getTraitValue = (attributes: any[], trait: string) => attributes.find((o) => o.trait_type === trait).value;

export default function Claim({ groupName, NFT, claim, fetching, huntType }: Props) {
  let progHuntInfo = {
    date: "",
    location_name: "",
    event_url: "",
  };
  const isProgHunt = huntType === "prog";
  if (isProgHunt) {
    const progNFT = NFT as any;
    progHuntInfo.date = getTraitValue(progNFT.attributes, "date");
    progHuntInfo.location_name = getTraitValue(progNFT.attributes, "location_name");
    progHuntInfo.event_url = getTraitValue(progNFT.attributes, "event_url");
  }
  return (
    <>
      {!isWordHunt(groupName) && <div className="text-2xl font-bold text- pb-5">{NFT.name}</div>}
      <div className="text-xl font-bold">{progHuntInfo.date}</div>
      <div className="text-lg">{progHuntInfo.location_name}</div>
      {isProgHunt && (
        <div className="mt-2">
          <a className="underline text-red-500 font-bold" href={progHuntInfo.event_url} target="_blank">
            Tickets
          </a>
        </div>
      )}
      <div className="p-0 h-[40vh]">
        <img className="m-auto h-full" src={isIpfs(NFT.image) ? ipfsToPinata(NFT.image) : NFT.image} />
      </div>
      <Button className="m-auto w-28 block mt-0 py-3 font-bold text-2xl" onClick={claim}>
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
