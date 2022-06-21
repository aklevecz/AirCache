const hre = require("hardhat");

async function main() {
  const LuckyLonghorns = await hre.ethers.getContractFactory("LuckyLonghorns");
  const luckyLonghorns = await LuckyLonghorns.deploy(
    "https://cdn.yaytso.art/luckylonghorns/metadata/"
  );
  await luckyLonghorns.deployed();

  console.log("Lucky Longhorns deployed to:", luckyLonghorns.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
