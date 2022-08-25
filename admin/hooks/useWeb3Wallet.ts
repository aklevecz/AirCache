import { ethers } from "ethers";
import { useEffect, useState } from "react";
import AirYaytsoInterface from "../libs/AirYaytso.json";
import { AIRCACHE_ADDRESS } from "../libs/constants";
import { MetaMask, Web3Wallet } from "../libs/types";

declare global {
  interface Window {
    ethereum: any;
  }
}

const defaultMetaMask = {
  available: false,
  accounts: [],
  provider: null,
  isConnecting: false,
};

export default function useWeb3Wallet(): Web3Wallet {
  const [metaMask, setMetaMask] = useState<MetaMask>(defaultMetaMask);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const initAirCache = () => {
    const contract = new ethers.Contract(
      AIRCACHE_ADDRESS,
      AirYaytsoInterface.abi,
      metaMask.provider!
    );

    setContract(contract);
  };

  const getAccountsMetaMask = async (): Promise<string[]> => {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    return accounts;
  };

  const connectMetaMask = async () => {
    try {
      setMetaMask({ ...metaMask, isConnecting: true });
      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .catch(console.log);
      const accounts = await getAccountsMetaMask();
      const provider =
        accounts.length > 0
          ? new ethers.providers.Web3Provider(window.ethereum)
          : null;
      setMetaMask({ ...metaMask, accounts, provider, isConnecting: false });
      return true;
    } catch (e) {}
    setMetaMask({ ...metaMask, isConnecting: false });
    return false;
  };

  useEffect(() => {
    if (metaMask.provider) {
      initAirCache();
    }
  }, [metaMask.provider]);

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      setMetaMask({ ...metaMask, isConnecting: true });
      getAccountsMetaMask().then((accounts: string[]) => {
        const provider =
          accounts.length > 0
            ? new ethers.providers.Web3Provider(window.ethereum)
            : null;
        setMetaMask({
          available: true,
          accounts,
          provider,
          isConnecting: false,
        });
      });
      // For now, 'eth_accounts' will continue to always return an array
      const handleAccountsChanged = (accounts: any) => {
        if (accounts.length === 0) {
          window.location.reload();
        } else if (accounts[0] !== metaMask.accounts[0]) {
          setMetaMask({ ...metaMask, accounts: [accounts[0]] });
          // Do any other work!
        }
      };
      window.ethereum.on("accountsChanged", handleAccountsChanged);

      // window.ethereum.on("disconnect", async (e: any) => {
      //   const accounts = await getAccountsMetaMask();
      //   if (accounts.length === 0) {
      //     window.location.reload();
      //   }
      // });
    }
  }, []);

  const connected = metaMask.accounts.length > 0;
  console.log(metaMask.accounts);
  return { metaMask, connectMetaMask, contract, connected };
}
