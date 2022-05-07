import { ethers } from "ethers";
import { useEffect, useState } from "react";
import AirYaytsoInterface from "./AirYaytso.json";
import { AIRCACHE_ADDRESS_MATIC } from "../libs/constants";
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
};

export default function useWeb3Wallet(): Web3Wallet {
  const [metaMask, setMetaMask] = useState<MetaMask>(defaultMetaMask);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const initAirCache = () => {
    const contract = new ethers.Contract(
      AIRCACHE_ADDRESS_MATIC,
      AirYaytsoInterface.abi,
      metaMask.provider!
    );
    console.log(contract);
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
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await getAccountsMetaMask();
      const provider =
        accounts.length > 0
          ? new ethers.providers.Web3Provider(window.ethereum)
          : null;
      setMetaMask({ ...metaMask, accounts, provider });
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    if (metaMask.provider) {
      initAirCache();
    }
  }, [metaMask.provider]);

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      getAccountsMetaMask().then((accounts: string[]) => {
        const provider =
          accounts.length > 0
            ? new ethers.providers.Web3Provider(window.ethereum)
            : null;
        setMetaMask({ available: true, accounts, provider });
      });
    }
  }, []);

  return { metaMask, connectMetaMask, contract };
}
