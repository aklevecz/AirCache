import { Web3Wallet } from "../../libs/types";
import Big from "../Button/Big";
import Spinner from "../Loading/Spinner";

type Props = {
  web3Wallet: Web3Wallet;
  getAvailableCaches: () => void;
  caches: any[];
  setCaches: any;
  selectedCache: any;
  setSelectedCache: any;
  fetching: boolean;
};

export default function Caches({
  web3Wallet,
  getAvailableCaches,
  caches,
  selectedCache,
  setSelectedCache,
  fetching,
}: Props) {
  return (
    <div className="h-full w-full items-center justify-center flex flex-col">
      <Big onClick={getAvailableCaches}>
        {fetching ? <Spinner /> : "Get Caches"}
      </Big>
      {caches.map((cache, i) => {
        return (
          <div
            key={cache + i}
            style={{
              backgroundColor: selectedCache === i + 1 ? "red" : "black",
            }}
            onClick={() => {
              setSelectedCache(i + 1);
            }}
          >
            {i + 1}
          </div>
        );
      })}
    </div>
  );
}
