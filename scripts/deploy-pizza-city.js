const hre = require("hardhat");

const AIR_CACHE_ADDRESS = "0xe6510B59d6AA01b6198B84B2f8276F163Fb77cC4";
const PIZZA_CITY_CDN = "https://cdn.yaytso.art/pizza-city/metadata/";

async function main() {
  const PizzaCity = await hre.ethers.getContractFactory("PizzaCity");
  const pizzaCity = await PizzaCity.deploy(PIZZA_CITY_CDN, AIR_CACHE_ADDRESS);
  await pizzaCity.deployed();

  console.log("PizzaCity deployed to:", pizzaCity.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
