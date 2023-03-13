import { NFT } from "../../libs/types";
import { ipfsToPinata, isIpfs } from "../../libs/utils";
import Button from "../Button";

type Props = {
  NFT: NFT;
  toggleModal: () => void;
};

export default function Complete({ NFT, toggleModal }: Props) {
  return (
    <>
      <div className="text-4xl font-bold text-center pb-5">Your new item!</div>

      <div className="text-3xl font-bold text-center pb-5">{NFT.name}</div>
      <div className="p-5 h-[40vh]">
        <img className="m-auto h-full" src={isIpfs(NFT.image) ? ipfsToPinata(NFT.image) : NFT.image} />
      </div>
      <Button onClick={toggleModal} className="w-20 font-bold m-auto block text-2xl mt-10">
        Ok
      </Button>
    </>
  );
}
