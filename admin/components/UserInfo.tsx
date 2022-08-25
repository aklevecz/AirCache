import { signOut, useSession } from "next-auth/react";
import { useWallet } from "../contexts/WalletContext";
import Connect from "./Connect";

export default function UserInfo() {
  const { data: session } = useSession();
  const { web3Wallet, setName } = useWallet();

  const onSignout = () => signOut();
  return (
    <div className="p-5 grid grid-flow-col grid-cols-3 justify-center items-center">
      <div>
        <div>{web3Wallet && web3Wallet.metaMask.accounts[0]}</div>

        <div>{session?.user?.email}</div>
        <div>
          <button className="mt-2" onClick={onSignout}>
            Logout
          </button>
        </div>
      </div>
      <div className="ml-0">
        {web3Wallet && !web3Wallet.connected && (
          <Connect web3Wallet={web3Wallet} />
        )}
      </div>
    </div>
  );
}
