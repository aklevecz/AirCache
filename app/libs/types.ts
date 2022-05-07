import { ethers } from "ethers";

export type Latlng = {
  lat: number;
  lng: number;
};

export enum TxState {
  Idle,
  Mining,
  Complete,
  Error,
}

export type MetaMask = {
  available: boolean;
  accounts: string[];
  provider: ethers.providers.Web3Provider | null;
};

export type Web3Wallet = {
  metaMask: MetaMask;
  connectMetaMask: () => Promise<boolean>;
  contract: ethers.Contract | null;
};
