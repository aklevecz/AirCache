const hre = require("hardhat");

async function main() {
  const FakeNFT = await hre.ethers.getContractFactory("FakeNFT");
  const fakeNFT = await FakeNFT.deploy();
  await fakeNFT.deployed();

  console.log("FakeNFT deployed to:", fakeNFT.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
