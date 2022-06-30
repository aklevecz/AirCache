// base
import emptyEgg from "../assets/icons/egg.png";
import filledEgg from "../assets/icons/egg2.png";
// austin
import hornEgg from "../assets/icons/horn-egg.png";
// blackbeard
import emptyChest from "../assets/icons/chest-empty.png";
import filledChest from "../assets/icons/chest-filled.png";

const cityCenters = {
  palmBeach: { lat: 26.70605988106027, lng: -80.04643388959501 },
  austin: { lat: 30.27317532798779, lng: -97.74452745161928 },
  alphabet_city: { lat: 40.72563642453208, lng: -73.97979855792384 },
  hudson_river: { lat: 40.70851962382408, lng: -74.01021772654222 },
};

const host =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://air.yaytso.art";

export const seoConfig: { [key: string]: any } = {
  ["coindesk-austin"]: {
    title: "Coindesk Egg Hunt",
    description: "Find eggs filled with NFT Longhorns scattered around Austin!",
    image: `${host}/coindesk-austin-banner.png`,
    map_center: cityCenters.austin,
    icon: { useNFT: false, image: { empty: hornEgg, filled: hornEgg } },
  },
  ["nft-nyc"]: {
    title: "NFT NYC Word Hunt",
    description: "Find letters in Alphabet City and win Word NFTs!",
    image: `${host}/ac-bg.png`,
    map_center: cityCenters.alphabet_city,
    icon: { useNFT: true, image: { empty: emptyEgg, filled: filledEgg } },
  },
  ["myosin-yacht"]: {
    title: "Hunting for Treasure in the Hudson",
    description:
      "Gems and Jewelry hidden in treasure troves strewn about the Hudson!",
    image: `${host}/blackbeard-ogimage.png`,
    map_center: cityCenters.hudson_river,
    icon: { useNFT: false, image: { empty: emptyChest, filled: filledChest } },
  },
};
