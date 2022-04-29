const hre = require("hardhat");

async function main() {
  const SpottedPigs = await hre.ethers.getContractFactory("SpottedPigs");
  const spottedPigs = await SpottedPigs.deploy(
    "0xa928293bb65eFB978559058e3C39Ef8d730c6f07"
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
