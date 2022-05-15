import Big from "../Button/Big";
import BlackWrappedSpinner from "../Loading/BlackWrappedSpinner";
import { ipfstoIO, isIpfs } from "../../libs/utils";
import { FRONTEND_HOST } from "../../libs/constants";
import Copy from "../Icons/Copy";

type Props = {
  nft: any;
  cache: any;
};
export default function Success({ nft, cache }: Props) {
  const link = `${FRONTEND_HOST()}/cache/${cache}`;
  const copy = () => {
    navigator.clipboard.writeText(link);
    alert(`copied ${link} to your clipboard!`);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="text-3xl font-bold mb-5">Success!!</div>
      <div>
        <div className="text-2xl bg-white text-black p-2 px-4 font-bold">
          {nft.metadata.name} is in egg #{cache}
        </div>
        <img
          className="max-w-xs p-4"
          src={
            isIpfs(nft.metadata.image)
              ? ipfstoIO(nft.metadata.image)
              : nft.metadata.image
          }
        />
      </div>
      <div className="w-full max-w-xs">
        <div className="mt-2 text-2xl flex justify-between items-center">
          Direct link:{" "}
          <a
            className="text-blue-500 underline"
            target={"__blank"}
            rel="noreferrer"
            href={link}
          >
            Egg #{cache}
          </a>
          <div className="cursor-pointer" onClick={copy}>
            <Copy />
          </div>
        </div>
      </div>
      {/* <Big onClick={fillCache} className="mt-5 text-3xl px-10 text-blue-500">
        {fetching ? <BlackWrappedSpinner /> : "Fill"}
      </Big> */}
    </div>
  );
}
