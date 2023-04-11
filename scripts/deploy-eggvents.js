const hre = require("hardhat");

const baseURI = "https://cdn.yaytso.art/magicmap/metadata/";
const oracle = "0xa928293bb65eFB978559058e3C39Ef8d730c6f07";
async function main() {
  const Eggvents = await hre.ethers.getContractFactory("Eggvents");
  const eggvents = await Eggvents.deploy(baseURI, oracle);
  await eggvents.deployed();

  console.log("eggvents deployed to:", eggvents.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// first magic map
//0x19c14e169C00fC2292d394b37ae0e56b2Be5de90

// 4/8
//0x754D19624d32f746d1393AA364ED50FeCcc577EB

// 4/11
// 0x067Cc02D3C49f844009e15Bd0DDeb69dbccbC4Fc

// MUMBAI
//0xd2867FcbA3A26FadE8AD958F07412828DDeC58B7
