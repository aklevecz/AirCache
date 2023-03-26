const hre = require("hardhat");

async function main() {
  const HiFiHoodies = await hre.ethers.getContractFactory("HiFiHoodies");
  const hifiHoodies = await HiFiHoodies.deploy("https://cdn.yaytso.art/hifihoodies/metadata/");
  await hifiHoodies.deployed();

  console.log("hifiHoodies deployed to:", hifiHoodies.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0x113Cc0a8c257C4717CE8b9f5B70B71B1e52c7F8d - old
// 0x7225D74a001583E5879B08434b0Af431040785bb
