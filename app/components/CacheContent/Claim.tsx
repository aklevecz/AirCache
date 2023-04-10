import { NFT } from "../../libs/types";
import { getTraitValue, ipfsToPinata, isIpfs, isWordHunt } from "../../libs/utils";
import Button from "../Button";
import NavigateIcon from "../Icons/NavigateIcon";
import TicketIcon from "../Icons/Ticket";
import BouncyEgg from "../Loading/BouncyEgg";

type Props = {
  groupName: string;
  NFT: NFT;
  claim: () => void;
  fetching: boolean;
  huntType: string;
  isCollected: boolean;
};

const gmapUrl = (l: string) => `https://maps.google.com/?q=${l}`;

export default function Claim({ groupName, NFT, claim, fetching, huntType, isCollected }: Props) {
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
      {!isWordHunt(groupName) && (
        <div style={{ lineHeight: "1.2rem" }} className="text-2xl font-bold">
          {NFT.name}
        </div>
      )}
      <div className="flex items-center justify-between my-1">
        <div className="text-md capitalize">{progHuntInfo.company}</div>
        <div className="text-md mt-1">{progHuntInfo.date}</div>
      </div>
      <div className="p-0 flex justify-center">
        <img className="m-auto h-full max-w-[300px] max-h-[250px]" src={isIpfs(NFT.image) ? ipfsToPinata(NFT.image) : NFT.image} />
      </div>
      <div className="flex gap-4 mt-[-30px] mb-4">
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
      <div className="text-lg mb-4">{progHuntInfo.location_name}</div>

      <div className="flex justify-center items-center">
        {/* {txState !== TxState.Fetching ? ( */}
        {!fetching ? (
          <Button
            disabled={true}
            // disabled={isCollected || fetching}
            onClick={claim}
            className="self-end"
          >
            {isCollected ? "You have this egg :)" : "Claim egg"}
          </Button>
        ) : (
          <BouncyEgg />
        )}
      </div>
    </>
  );
}
