const hre = require("hardhat");

const MAGIC_MAP_ADDRESS = "0x19c14e169C00fC2292d394b37ae0e56b2Be5de90";

async function main() {
  const tokenType = 0;
  const nftData = {
    tokenType,
  };
  const [owner] = await ethers.getSigners();
  const signature = await owner._signTypedData(
    {
      name: "teh-raptor",
      version: "1.0",
      chainId: await owner.getChainId(),
      verifyingContract: MAGIC_MAP_ADDRESS,
    },
    {
      SignedNFTData: [{ name: "tokenType", type: "uint8" }],
    },
    nftData
  );
  console.log(nftData, signature);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
