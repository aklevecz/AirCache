const hre = require("hardhat");

async function main() {
  const AirCache = await hre.ethers.getContractFactory("AirYaytso");
  const airCache = await AirCache.deploy();
  await airCache.deployed();

  console.log("AirCache deployed to:", airCache.address);

  const SpottedPigs = await hre.ethers.getContractFactory("SpottedPigs");
  const spottedPigs = await SpottedPigs.deploy(airCache.address);
  await spottedPigs.deployed();

  console.log("SpottedPigs deployed to:", spottedPigs.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
