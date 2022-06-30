const hre = require("hardhat");

async function main() {
  const Gems = await hre.ethers.getContractFactory("Gems");
  const gems = await Gems.deploy();
  await gems.deployed();

  console.log("Gems deployed to:", gems.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
