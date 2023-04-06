import { NFT } from "../../libs/types";
import { ipfsToPinata, isIpfs, isWordHunt } from "../../libs/utils";
import Button from "../Button";
import TicketIcon from "../Icons/Ticket";
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
    company: "",
  };
  const isProgHunt = huntType === "prog";
  if (isProgHunt) {
    const progNFT = NFT as any;
    progHuntInfo.date = getTraitValue(progNFT.attributes, "date");
    progHuntInfo.location_name = getTraitValue(progNFT.attributes, "location_name");
    progHuntInfo.event_url = getTraitValue(progNFT.attributes, "event_url");
    progHuntInfo.company = getTraitValue(progNFT.attributes, "company");
  }

  return (
    <>
      {!isWordHunt(groupName) && <div className="text-2xl font-bold mb-4">{NFT.name}</div>}
      <div className="flex items-center justify-between">
        <div className="text-md mt-1">{progHuntInfo.company}</div>

        <div className="text-sm mt-1 text-center">{progHuntInfo.date}</div>
      </div>
      <div className="text-md mt-1">{progHuntInfo.location_name}</div>
      {isProgHunt && progHuntInfo.event_url && (
        <div className="mt-2 w-10">
          <a className="underline text-red-500 font-bold" href={progHuntInfo.event_url} target="_blank">
            <TicketIcon />
          </a>
        </div>
      )}
      <div className="p-0 flex justify-center">
        <img className="m-auto h-full max-w-[300px]" src={isIpfs(NFT.image) ? ipfsToPinata(NFT.image) : NFT.image} />
      </div>
      <Button className="m-auto w-28 block mt-0 py-3 font-bold text-2xl bg-slate-500" onClick={claim}>
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
