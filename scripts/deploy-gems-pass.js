const hre = require("hardhat");

async function main() {
  const GemsPass = await hre.ethers.getContractFactory("GemsPass");
  const gemsPass = await GemsPass.deploy();
  await gemsPass.deployed();

  console.log("gemsPass deployed to:", gemsPass.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
