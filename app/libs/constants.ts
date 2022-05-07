import { prod } from "./env";

export const oldContracts = {
  matic: ["0x66e0c85270A91F6d6c67c8768029106430C1f04e"],
  matic_mum: [],
};

export const AIRCACHE_ADDRESS_MUMBAI =
  "0xe6510B59d6AA01b6198B84B2f8276F163Fb77cC4";
export const AIRCACHE_ADDRESS_MATIC =
  "0x7800f1db3e103cB534f77B9d66A4E2061a79F9df";

export const SPOTTED_PIGS_ADDRESS_MUMBAI =
  "0x583d20D3582BA762eB32A6d93aA44808c656d911";
export const SPOTTED_PIGS_ADDRESS_MATIC =
  "0x287504423a3Caa81EB391dcb9AeA9e195Ffc7A8b";

export const POLYAYTSO_ADDRESS_MUMBAI =
  "0xC7716e31fdD818BDD39DEfC64D5951D22f121b20";
export const POLYAYTSO_ADDRESS_MATIC =
  "0xf6E71735A2db00b7C515B3465cE533Bfc37C90Ae";

export const AIRCACHE_ADDRESS = !prod
  ? AIRCACHE_ADDRESS_MUMBAI
  : AIRCACHE_ADDRESS_MATIC;

export const SPOTTED_PIGS_ADDRESS = !prod
  ? SPOTTED_PIGS_ADDRESS_MUMBAI
  : SPOTTED_PIGS_ADDRESS_MATIC;

export const abis = {
  tokenURI: "function tokenURI(uint256) public view returns (string memory)",
  uri: "function uri(uint256) public view returns (string memory)",
  approve: "function approve(address to, uint256 tokenId) public",
};

export const BAHAMA_COORDS = {
  lat: 25.07010571575544,
  lng: -77.39747572524674,
};

export const LA_COORDS = {
  lat: 34.096411938369044,
  lng: -118.24104672954115,
};

export const SF_COORDS = {
  lat: 37.7664967,
  lng: -122.4293212,
};
