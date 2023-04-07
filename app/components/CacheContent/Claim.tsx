import { NFT } from "../../libs/types";
import { ipfsToPinata, isIpfs, isWordHunt } from "../../libs/utils";
import Button from "../Button";
import TicketIcon from "../Icons/Ticket";
import BouncyEgg from "../Loading/BouncyEgg";

type Props = {
  groupName: string;
  NFT: NFT;
  claim: () => void;
  fetching: boolean;
  huntType: string;
};

const getTraitValue = (attributes: any[], trait: string) =>
  attributes.find((o) => o.trait_type === trait).value;

export default function Claim({
  groupName,
  NFT,
  claim,
  fetching,
  huntType,
}: Props) {
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
    progHuntInfo.location_name = getTraitValue(
      progNFT.attributes,
      "location_name"
    );
    progHuntInfo.event_url = getTraitValue(progNFT.attributes, "event_url");
    progHuntInfo.company = getTraitValue(progNFT.attributes, "company");
  }

  return (
    <>
      <div className="-m-10 relative overflow-hidden flex-1 flex flex-col justify-center item-center rounded-3xl">
        <figure className="relative w-full h-[40%] shrink">
          <img
            src={isIpfs(NFT.image) ? ipfsToPinata(NFT.image) : NFT.image}
            alt={NFT.name}
            className="h-full aspect-square	object-cover m-auto max-h-[250px] relative z-[1]"
          />
          <img
            src="/gradient-1.jpg"
            className="aspect-square object-cover z-[0] absolute pos top-0 left-0 w-full h-full"
          />
          <figcaption className="absolute left-2 bottom-2 rounded-full bg-white py-1 px-2 text-sm uppercase">
            <time>{progHuntInfo.date}</time>
          </figcaption>
        </figure>
        <article className="flex flex-col relative px-3 py-4 grow-1">
          <div>
            {!isWordHunt(groupName) && (
              <h1 className="text-base font-bold">{NFT.name}</h1>
            )}
            <p className="m-0">{progHuntInfo.company}</p>
            <address>{progHuntInfo.location_name}</address>
            {/* <SignInWithLens onSignIn={onSignIn} /> */}
            {isProgHunt && progHuntInfo.event_url && (
              <a
                className="flex items-center gap-1 text-blue-600 my-2 hover:underline"
                href={progHuntInfo.event_url}
                target="_blank"
              >
                <TicketIcon dim={"18px"} className="fill-blue-600" /> buy ticket
              </a>
            )}
          </div>

          {/* {txState !== TxState.Fetching ? ( */}
          {!fetching ? (
            <Button onClick={claim} className="self-end">
              Claim egg
            </Button>
          ) : (
            <BouncyEgg />
          )}
        </article>
      </div>
    </>
  );
}
