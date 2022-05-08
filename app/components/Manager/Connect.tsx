import { Web3Wallet } from "../../libs/types";
import Big from "../Button/Big";
import BlackWrappedSpinner from "../Loading/BlackWrappedSpinner";

import metaMaskWhite from "../../assets/icons/metamask_white.svg";

type Props = {
  web3Wallet: Web3Wallet;
};
export default function Connect({ web3Wallet }: Props) {
  const connected = web3Wallet.metaMask.accounts.length > 0;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {web3Wallet.metaMask.available && (
        <MetaMask connect={connected} web3Wallet={web3Wallet} />
      )}
    </div>
  );
}

const MetaMask = (props: any) => (
  <>
    <div className="w-1/2 max-w-xs mb-5" style={{ marginTop: "-10vh" }}>
      <img src={metaMaskWhite.src} />
    </div>
    {!props.connected && (
      <Big onClick={props.web3Wallet.connectMetaMask}>
        {!props.web3Wallet.metaMask.isConnecting ? (
          "Connect MetaMask"
        ) : (
          <BlackWrappedSpinner />
        )}
      </Big>
    )}
  </>
);
