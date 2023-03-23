const hre = require("hardhat");

const baseURI = "https://cdn.yaytso.art/magicmap/metadata/";
const oracle = "0xa928293bb65eFB978559058e3C39Ef8d730c6f07";
async function main() {
  const MagicMap = await hre.ethers.getContractFactory("MagicMap");
  const magicMap = await MagicMap.deploy(baseURI, oracle);
  await magicMap.deployed();

  console.log("MagicMap deployed to:", magicMap.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//0x19c14e169C00fC2292d394b37ae0e56b2Be5de90
