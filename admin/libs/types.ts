import ethers from "ethers";

export type LatLng = {
  lat: number;
  lng: number;
};

export type MetaMask = {
  available: boolean;
  accounts: string[];
  provider: ethers.providers.Web3Provider | null;
  isConnecting: boolean;
};

export type Web3Wallet = {
  connected: boolean;
  metaMask: MetaMask;
  connectMetaMask: () => Promise<boolean>;
  contract: ethers.Contract | null;
};

export type Cache = {
  address: string;
  cacheId: string;
  groupName: string;
  lat: string;
  lng: string;
  note: string;
  tokenAddress: string;
  tokenId: number;
};
