import { useRouter } from "next/router";
import Button from "../components/Button";
import BouncyEgg from "../components/Loading/BouncyEgg";
import LoginModal from "../components/Modals/Login";
import NFT from "../components/Wallet/NFT";

import useAuth from "../hooks/useAuth";
import useModal from "../hooks/useModal";
import useWallet from "../hooks/useWallet";

import { motion } from "framer-motion";
import { fadeInOut } from "../motion/variants";
// Solana
// Another version for Solana?
// or state switching that fetches other ones?
// or they are combined?
export default function Wallet() {
  const router = useRouter();
  const auth = useAuth();
  const wallet = useWallet(auth.user && auth.user.publicAddress);
  const modal = useModal();
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
      <motion.div
        key="wallet-loading"
        variants={fadeInOut}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <BouncyEgg />
      </motion.div>
    );
  }
  return (
    <motion.div
      key="wallet"
      variants={fadeInOut}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-12 pb-20"
    >
      <div className="text-3xl text-center p-2 mb-2 font-bold font-fatfrank tracking-wider text-white">
        Collection
      </div>
      {auth.user && (
        <>
          <div className="font-bold text-center mb-5 break-all px-14">
            {auth.user.publicAddress}
          </div>
          <Button className="w-32 m-auto block" onClick={onLogout}>
            Logout
          </Button>
          <div className="flex flex-wrap items-center justify-center pb-10">
            {wallet.metadatas.map((nft: any, i) => (
              <NFT nft={nft} key={nft.name + i} />
            ))}
            {wallet.fetching && <BouncyEgg />}
            {!wallet.fetching &&
              wallet.nfts.length === 0 &&
              wallet.metadatas.length === 0 && (
                <div className="text-3xl font-bold w-3/4 text-center">
                  You haven't found any items!
                </div>
              )}
          </div>
        </>
      )}
      {!auth.user && (
        <>
          <div className="text-3xl font-bold w-3/4 my-10 m-auto text-center max-w-xl">
            Sign in to view your collection
          </div>
          <Button
            className="w-60 m-auto block mt-8"
            // onClick={() => router.push("/login")}
            onClick={() => modal.toggleModal()}
          >
            Go to Signin
          </Button>
          <LoginModal open={modal.open} toggleModal={modal.toggleModal} />
        </>
      )}
    </motion.div>
  );
}
