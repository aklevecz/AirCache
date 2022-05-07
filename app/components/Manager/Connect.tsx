import { Web3Wallet } from "../../libs/types";

type Props = {
  web3Wallet: Web3Wallet;
};
export default function Connect({ web3Wallet }: Props) {
  const connected = web3Wallet.metaMask.accounts.length > 0;
  return (
    <div>
      {!connected && (
        <button onClick={web3Wallet.connectMetaMask}>Connect MetaMask</button>
      )}
      {web3Wallet.metaMask?.accounts?.map((account: string) => (
        <div>{account}</div>
      ))}
    </div>
  );
}
