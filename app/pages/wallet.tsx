import { useRouter } from "next/router";
import Button from "../components/Button";
import FullScreenSpinner from "../components/Loading/FullScreenSpinner";
import Spinner from "../components/Loading/Spinner";
import NFT from "../components/Wallet/NFT";
import useAuth from "../hooks/useAuth";
import useWallet from "../hooks/useWallet";

export default function Wallet() {
  const router = useRouter();
  const auth = useAuth();
  const wallet = useWallet(auth.user && auth.user.publicAddress);

  const onLogout = () => {
    auth.logout();
    // router.push("/");
    // if (typeof window !== "undefined") {
    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 2000);
    // }
  };

  if (!wallet.nfts) {
    return (
      <div>
        <FullScreenSpinner />
      </div>
    );
  }
  return (
    <div className="pb-20">
      <div className="text-3xl text-center m-4 font-bold font-fatfrank tracking-wider bg-white text-black">
        Your Items
      </div>
      {auth.user && (
        <>
          <div className="font-bold text-center mb-5 break-all px-14">
            {auth.user.publicAddress}
          </div>
          <div className="flex flex-wrap items-center justify-center pb-10">
            {wallet.metadatas.map((nft: any, i) => (
              <NFT nft={nft} key={nft.name + i} />
            ))}
            {wallet.fetching && <Spinner />}
            {!wallet.fetching &&
              wallet.nfts.length === 0 &&
              wallet.metadatas.length === 0 && (
                <div className="text-3xl font-bold w-3/4 text-center">
                  You haven't found any items!
                </div>
              )}
          </div>
          <Button className="w-32 m-auto font-bold block" onClick={onLogout}>
            Logout
          </Button>
        </>
      )}
      {!auth.user && (
        <>
          <div className="text-3xl font-bold w-3/4 my-10 m-auto text-center">
            You must sign in to view your items
          </div>
          <Button
            className="w-32 m-auto font-bold text-2xl block mt-8"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        </>
      )}
    </div>
  );
}
