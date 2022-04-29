const { ethers } = require("ethers");
const ContractInterface = require("./AirYaytso.json");

const LIVE = process.env.LIVE === "LIVE";
const PP2 = process.env.PP2;

const ALCHEMY_KEY = LIVE
  ? process.env.ALCHEMY_KEY
  : process.env.ALCHEMY_KEY_MUMBAI;

const AIRYAYTSO_ADDRESS = LIVE
  ? process.AIRYAYTSO_ADDRESS_MATIC
  : process.env.AIRYAYTSO_ADDRESS_MUMBAI;

const network = LIVE ? "matic" : "maticmum";
const defaultProvider = new ethers.providers.AlchemyProvider(
  network,
  ALCHEMY_KEY
);
exports.handler = async (event) => {
  const messageAttributes = event.Records[0].messageAttributes;
  try {
    const winner = messageAttributes.address.stringValue;
    const cacheId = parseInt(messageAttributes.cacheId.stringValue);
    console.log(winner, cacheId);
    const masterWallet = new ethers.Wallet(PP2, defaultProvider);
    const contract = new ethers.Contract(
      AIRYAYTSO_ADDRESS,
      ContractInterface.abi,
      masterWallet.provider
    );
    const signer = contract.connect(masterWallet);
    // signer.estimateGas
    //   .dropNFT(cacheId, user.publicAddresss)
    //   .then((b) => console.log(b.toString()));
    // console.log("HELLO");
    // res.status(200).end();
    // return;
    const tx = await signer.dropNFT(cacheId, winner);
    console.log(tx);
    const receipt = await tx.wait();
    for (const event of receipt.events) {
      console.log(event.event);
    }
  } catch (e) {
    console.log(e);
    return { statusCode: 404 };
  }
};
