import { Web3Wallet } from "../../libs/types";

type Props = {
  web3Wallet: Web3Wallet;
  caches: any[];
  setCaches: any;
  selectedCache: any;
  setSelectedCache: any;
};

export default function Caches({
  web3Wallet,
  caches,
  setCaches,
  selectedCache,
  setSelectedCache,
}: Props) {
  return (
    <div>
      <button
        onClick={async () => {
          const numCaches = web3Wallet.contract!.cacheId();
          setCaches(new Array(numCaches));
        }}
      >
        Caches
      </button>
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
