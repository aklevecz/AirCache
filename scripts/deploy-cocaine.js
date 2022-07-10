const hre = require("hardhat");

async function main() {
  const Cocaine = await hre.ethers.getContractFactory("Cocaine");
  const cocaine = await Cocaine.deploy();
  await cocaine.deployed();

  console.log("Cocaine deployed to:", cocaine.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
