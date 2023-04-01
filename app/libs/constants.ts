import { prod } from "./env";

export const oldContracts = {
  matic: ["0x66e0c85270A91F6d6c67c8768029106430C1f04e"],
  matic_mum: [],
};

export const AIRCACHE_ADDRESS_MUMBAI = "0xe6510B59d6AA01b6198B84B2f8276F163Fb77cC4";
export const AIRCACHE_ADDRESS_MATIC = "0x7800f1db3e103cB534f77B9d66A4E2061a79F9df";

export const SPOTTED_PIGS_ADDRESS_MUMBAI = "0x583d20D3582BA762eB32A6d93aA44808c656d911";
export const SPOTTED_PIGS_ADDRESS_MATIC = "0x287504423a3Caa81EB391dcb9AeA9e195Ffc7A8b";

export const PIXELTROSS_ADDRESS_MUMBAI = "0x9795a9d390634ACA9f7330827224013334Fd5C26";
export const PIXELTROSS_ADDRESS_MATIC = "0xb5822963961DB63767D14be2EfB5060f6c154119";

export const POLYAYTSO_ADDRESS_MUMBAI = "0xC7716e31fdD818BDD39DEfC64D5951D22f121b20";
export const POLYAYTSO_ADDRESS_MATIC = "0xf6E71735A2db00b7C515B3465cE533Bfc37C90Ae";

const LUCKYLONGHORNS_ADDRESS_MATIC = "0x52a92cFC8DB49c4E3d03B5c4bFCec3b08a12DfB5";

export const ALPHABET_CITY_MUMBAI = "0x15F7bC9A3a8C63A55B95bF092d80D7f16b5dcAB5";

export const GEMS_MUMBAI = "0x90d901BDF15Fe07c46E4FaB572F8084deC8AaF8D";
export const GEMS_MATIC = "0x93E9c3dd0Ab468Aae3D9906f8F44808e19DDD44B";

export const ALPHABET_CITY_MATIC = "0x796A5BB70D8b0135218d1Db1004bBcb731BfFA9B";
export const VENICE_PIZZA_MATIC = "0xe8556074aB73eDfae69D8E3e67A25Ff796b01d0D";

export const COCAINE_MATIC = "0xc28e8501D0e4ba89014AAffee5A6215b93949b24";

export const PIZZA_CITY_MATIC = "0xE3404a9253EA9CbF741a7fcD24d48Bb10ADED1AA";

export const GEMS_PASS_MATIC = "0xf4de09333fBDCF637b1Ba4e7c067B5e5502850Ec";

export const RAPTOR_TIX_MATIC = "0xb617dA40Cb7368f34A3AD54Bd53EA4Da44F00EE3";

export const ALPHABET_CITY = !prod ? ALPHABET_CITY_MUMBAI : ALPHABET_CITY_MATIC;
export const AIRCACHE_ADDRESS = !prod ? AIRCACHE_ADDRESS_MUMBAI : AIRCACHE_ADDRESS_MATIC;

export const SPOTTED_PIGS_ADDRESS = !prod ? SPOTTED_PIGS_ADDRESS_MUMBAI : SPOTTED_PIGS_ADDRESS_MATIC;

export const GEMS_ADDRESS = prod ? GEMS_MATIC : GEMS_MUMBAI;

export const abis = {
  tokenURI: "function tokenURI(uint256) public view returns (string memory)",
  uri: "function uri(uint256) public view returns (string memory)",
  approve: "function approve(address to, uint256 tokenId) public",
  setApprovalForAll: "function setApprovalForAll(address operator, bool approved) public",
  isApprovedForAll: "function isApprovedForAll(address account, address operator) public view returns (bool)",
  getApproved: "function getApproved(uint256 tokenId) public view returns (address)",
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

export const NY_COORDS = {
  lat: 40.74470953212919,
  lng: -73.98283236817514,
};

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const FRONTEND_HOST = () => `${window.location.protocol}//${window.location.host}`;

export const colors = {
  lavender: "#f97dff",
  red: "#ff4444",
  polygon: "#8247E5",
};

export const cacheByGroupTableName = prod ? "cache-by-group" : "cache-by-group-test";

export const CDN_HOST = "https://cdn.yaytso.art";

const nycDeleteList = [64, 71, 90, 102, 103, 97, 92, 80, 66, 60, 68, 82, 87, 99, 75, 58, 72, 79, 63, 109];
