const hre = require("hardhat");

async function main() {
  const Pixeltross = await hre.ethers.getContractFactory("Pixeltross");
  const pixeltross = await Pixeltross.deploy(
    "https://cdn.yaytso.art/pixeltross/metadata/"
  );
  await pixeltross.deployed();

  console.log("Pixeltross deployed to:", pixeltross.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
