import { NFT } from "../../libs/types";
import { getTraitValue, ipfsToPinata, isIpfs, isWordHunt } from "../../libs/utils";
import Button from "../Button";
import NavigateIcon from "../Icons/NavigateIcon";
import TicketIcon from "../Icons/Ticket";
import Spinner from "../Loading/Spinner";

type Props = {
  groupName: string;
  NFT: NFT;
  claim: () => void;
  fetching: boolean;
  huntType: string;
};

const gmapUrl = (l: string) => `https://maps.google.com/?q=${l}`;

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
      {!isWordHunt(groupName) && <div className="text-xl font-bold">{NFT.name}</div>}
      <div className="flex items-center justify-between my-1">
        <div className="text-md capitalize">{progHuntInfo.company}</div>
        <div className="text-md mt-1">{progHuntInfo.date}</div>
      </div>
      <div className="flex items-center justify-start mb-0 gap-4 py-1"></div>

      <div className="text-lg mt-0">{progHuntInfo.location_name}</div>
      <div className="flex gap-4">
        {isProgHunt && progHuntInfo.event_url && (
          <div className="mt-2 w-10">
            <a className="underline text-red-500 font-bold" href={progHuntInfo.event_url} target="_blank">
              <TicketIcon />
            </a>
          </div>
        )}
        <div className="mt-2 w-10">
          <a className="underline text-red-500 font-bold" href={gmapUrl(progHuntInfo.location_name)} target="_blank">
            <NavigateIcon />
          </a>
        </div>
      </div>
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
