import FullScreenSpinner from "../components/Loading/FullScreenSpinner";
import Spinner from "../components/Loading/Spinner";
import NFT from "../components/Wallet/NFT";
import useAuth from "../hooks/useAuth";
import useWallet from "../hooks/useWallet";

export default function Wallet() {
  const auth = useAuth();
  const wallet = useWallet(auth.user && auth.user.publicAddress);

  if (!wallet.nfts) {
    return (
      <div>
        <FullScreenSpinner />
      </div>
    );
  }
  return (
    <div className="pb-10">
      <div className="text-3xl text-center m-4 font-bold font-fatfrank tracking-wider">
        Your NFTs
      </div>
      <div className="flex flex-wrap items-center justify-center pb-20">
        {wallet.metadatas.map((nft: any, i) => (
          <NFT nft={nft} key={nft.name + i} />
        ))}
        {wallet.metadatas.length === 0 && <Spinner />}
        {!wallet.nfts && wallet.metadatas.length === 0 && (
          <div className="text-3xl font-bold w-3/4 text-center">
            You haven't found any NFTs!
          </div>
        )}
      </div>
    </div>
  );
}
