import { prod } from "./env";

export const CDN_HOST = "https://cdn.yaytso.art";
export const HUNT_CONFIG_S3 = `${CDN_HOST}/hunt_configs`;

export const AIRCACHE_ADDRESS_MUMBAI =
  "0xe6510B59d6AA01b6198B84B2f8276F163Fb77cC4";
export const AIRCACHE_ADDRESS_MATIC =
  "0x7800f1db3e103cB534f77B9d66A4E2061a79F9df";
export const AIRCACHE_ADDRESS = !prod
  ? AIRCACHE_ADDRESS_MUMBAI
  : AIRCACHE_ADDRESS_MATIC;

export const PIZZA_CITY_MATIC = "0xE3404a9253EA9CbF741a7fcD24d48Bb10ADED1AA";

export const GEMS_MATIC = "0x93E9c3dd0Ab468Aae3D9906f8F44808e19DDD44B";
export const RAPTOR_TIX_MATIC = "0xb617dA40Cb7368f34A3AD54Bd53EA4Da44F00EE3"

export const abis = {
  tokenURI: "function tokenURI(uint256) public view returns (string memory)",
  uri: "function uri(uint256) public view returns (string memory)",
  approve: "function approve(address to, uint256 tokenId) public",
  setApprovalForAll:
    "function setApprovalForAll(address operator, bool approved) public",
  isApprovedForAll:
    "function isApprovedForAll(address account, address operator) public view returns (bool)",
  getApproved:
    "function getApproved(uint256 tokenId) public view returns (address)",
};

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const cacheByGroupTableName = prod
  ? "cache-by-group"
  : "cache-by-group-test";

export const colors = {
  blue: "#90bcff",
  red: "rgb(255, 112, 112)",
};
