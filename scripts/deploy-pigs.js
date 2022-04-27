const hre = require("hardhat");

async function main() {
  const SpottedPigs = await hre.ethers.getContractFactory("SpottedPigs");
  const spottedPigs = await SpottedPigs.deploy(
    "0x04f6595ca4D8AC68A9D6A1eD2Cd52280BdcD7B17"
  );
  await spottedPigs.deployed();

  console.log("SpottedPigs deployed to:", spottedPigs.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
