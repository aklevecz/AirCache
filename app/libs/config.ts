// base
import emptyEgg from "../assets/icons/egg.png";
import filledEgg from "../assets/icons/egg2.png";
// austin
import hornEgg from "../assets/icons/horn-egg.png";
// blackbeard
import emptyChest from "../assets/icons/chest-empty.png";
import filledChest from "../assets/icons/chest-filled.png";
// narcos
import emptyCocaine from "../assets/icons/cocaine-empty.png";
import filledCocaine from "../assets/icons/cocaine.png";

const cityCenters = {
  palmBeach: { lat: 26.70605988106027, lng: -80.04643388959501 },
  austin: { lat: 30.27317532798779, lng: -97.74452745161928 },
  alphabet_city: { lat: 40.72563642453208, lng: -73.97979855792384 },
  hudson_river: { lat: 40.70851962382408, lng: -74.01021772654222 },
  prospect_park: { lat: 40.66103384799173, lng: -73.9698999374802 },
  la: { lat: 34.08326394070492, lng: -118.21794546931355 },
  la_colombe: { lat: 34.1021603594777, lng: -118.24306380878141 },
  venice_beach: { lat: 33.9946586623243, lng: -118.48187211490418 },
  atlantic_city: { lat: 39.363759445000795, lng: -74.43874098662849 },
  helsinki: { lat: 60.167748266850595, lng: 24.947493587462798 },
  barcelona: { lat: 41.4042128, lng: 2.1750039 },
  toronto: { lat: 43.657195, lng: -79.38517 },
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
  ["narcos-park"]: {
    title: "Collecting cocaine in the park",
    description: "Just another day in beautiful Prospect Park!",
    image: `${host}/cocaine.png`,
    map_center: cityCenters.prospect_park,
    icon: {
      useNFT: false,
      image: { empty: emptyCocaine, filled: filledCocaine },
    },
  },
  ["admin-test"]: {
    title: "admin-test",
    description: "",
    image: "",
    map_center: "",
    icon: {},
  },
  ["la"]: {
    title: "LA Pizza",
    description: "Pizza for LA",
    image: "",
    map_center: cityCenters.la_colombe,
    icons: { useNFT: false, image: { empty: emptyEgg, filled: filledEgg } },
  },
  ["venice"]: {
    title: "Venice Pizza",
    description: "Pizza for Venice",
    image: "",
    map_center: cityCenters.venice_beach,
    icons: { useNFT: true, image: { emptyEgg, filled: filledEgg } },
  },
  ["only-gems"]: {
    title: "Only Gems pass scavenger hunt",
    description: "A hunt for Only Gems passes",
    image: `${host}/only-gems.png`,
    map_center: cityCenters.atlantic_city,
    icon: { useNFT: false, image: { empty: emptyChest, filled: filledChest } },
  },
  helsinki: {
    title: "Helsinki",
    description: "Helsinki",
    image: `${host}/blackbeard-ogimage.png`,
    map_center: cityCenters.helsinki,
    icon: { useNFT: false, image: { empty: emptyChest, filled: filledChest } },
  },
  barcelona: {
    title: "Barcelona",
    description: "Hunting for treasure in Barcelona",
    image: `${host}/blackbeard-ogimage.png`,
    map_center: cityCenters.barcelona,
    icon: { useNFT: true, image: { empty: emptyChest, filled: filledChest } },
  },
  toronto: {
    title: "Toronto",
    description: "Hunting for treasure in Toronto",
    image: `${host}/blackbeard-ogimage.png`,
    map_center: cityCenters.toronto,
    icon: { useNFT: true, image: { empty: emptyChest, filled: filledChest } },
  },
};

export const appKeys: { [key: string]: { secret: string; pub: string } } = {
  ["eggs"]: {
    secret: process.env.MAGIC_SECRET_KEY as string,
    pub: process.env.NEXT_PUBLIC_MAGIC_PUB_KEY as string,
  },
  ["coindesk-austin"]: {
    secret: process.env.HORN_MAGIC_SECRET_KEY as string,
    pub: process.env.NEXT_PUBLIC_HORN_MAGIC_PUB_KEY as string,
  },
  ["nft-nyc"]: {
    secret: process.env.ALPHABET_CITY_MAGIC_SECRET_KEY as string,
    pub: process.env.NEXT_PUBLIC_ALPHABET_CITY_PUB_KEY as string,
  },
  ["myosin-yacht"]: {
    secret: process.env.YACHT_MAGIC_SECRET_KEY as string,
    pub: process.env.NEXT_PUBLIC_YACHT_MAGIC_PUB_KEY as string,
  },
  ["only-gems"]: {
    secret: process.env.ONLY_GEMS_SECRET_KEY as string,
    pub: process.env.NEXT_PUBLIC_ONLY_GEMS_PUB_KEY as string,
  },
  helsinki: {
    secret: process.env.HELSINKI_SECRET_KEY as string,
    pub: process.env.NEXT_PUBLIC_HELSINKI_PUB_KEY as string,
  },
};
