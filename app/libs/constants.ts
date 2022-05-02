export const AIRCACHE_ADDRESS_MUMBAI =
  "0x578b342d059cc9590008BE763Ed1161C57Fc9b10";
export const AIRCACHE_ADDRESS_MATIC =
  "0x66e0c85270A91F6d6c67c8768029106430C1f04e";

export const SPOTTED_PIGS_ADDRESS_MUMBAI =
  "0x583d20D3582BA762eB32A6d93aA44808c656d911";
export const SPOTTED_PIGS_ADDRESS_MATIC =
  "0x287504423a3Caa81EB391dcb9AeA9e195Ffc7A8b";

export const AIRCACHE_ADDRESS =
  process.env.NODE_ENV === "development"
    ? AIRCACHE_ADDRESS_MUMBAI
    : AIRCACHE_ADDRESS_MATIC;

export const SPOTTED_PIGS_ADDRESS =
  process.env.NODE_ENV === "development"
    ? SPOTTED_PIGS_ADDRESS_MUMBAI
    : SPOTTED_PIGS_ADDRESS_MATIC;

export const abis = {
  tokenURI: "function tokenURI(uint256) public view returns (string memory)",
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
