const hre = require("hardhat");
const pizza = [16, 9, 26, 26, 1];
const a = [1];
const lemon = [12, 5, 13, 15, 14];
const joker = [10, 15, 11, 5, 18];
async function main() {
  const AlphabetCity = await hre.ethers.getContractFactory("AlphabetCity");
  const alphabetCity = await AlphabetCity.deploy(
    "https://cdn.yaytso.art/alphabet-city/metadata/"
  );
  await alphabetCity.deployed();
  const owner = await alphabetCity.signer.getAddress();
  await alphabetCity.mintWord(owner, pizza);

  for (let i = 0; i < 11; i++) {
    await alphabetCity.mintLetter(owner, 16);
  }
  for (let i = 0; i < 13; i++) {
    await alphabetCity.mintLetter(owner, 9);
    await alphabetCity.mintLetter(owner, 26);
    await alphabetCity.mintLetter(owner, 1);
  }
  // alphabetCity.mintWord(owner, joker);
  // alphabetCity.mintWord(owner, lemon);
  alphabetCity.setApprovalForAll(
    "0x7800f1db3e103cB534f77B9d66A4E2061a79F9df",
    true
  );

  console.log("Alphabet City deployed to:", alphabetCity.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat verify 0x15F7bC9A3a8C63A55B95bF092d80D7f16b5dcAB5 "https://cdn.yaytso.art/alphabet-city/metadata/" --network matic_mum
