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
  isConnecting: boolean;
};

export type Web3Wallet = {
  metaMask: MetaMask;
  connectMetaMask: () => Promise<boolean>;
  contract: ethers.Contract | null;
};

export type HuntMeta = {
  name: string;
  location: string;
  title: string;
  description: string;
  image: string;
};

export type NFT = {
  name: string;
  description: string;
  image: string;
  tokenAddress: string;
  tokenId: string;
};
