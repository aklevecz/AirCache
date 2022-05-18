const { ethers } = require("ethers");
const fetch = require("node-fetch");
const ContractInterface = require("./AirYaytso.json");

const LIVE = process.env.LIVE === "LIVE";
const PP2 = process.env.PP2;

const ALCHEMY_KEY = LIVE
  ? process.env.ALCHEMY_KEY
  : process.env.ALCHEMY_KEY_MUMBAI;

const AIRYAYTSO_ADDRESS = LIVE
  ? process.env.AIRYAYTSO_ADDRESS_MATIC
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
    let gasLimit = 100000;
    try {
      const estimatedGas = await signer.estimateGas
        .dropNFT(cacheId, winner)
        .then((b) => {
          return b.toNumber();
        });
      if (estimatedGas > 0) {
        gasLimit = estimatedGas;
      }
    } catch (e) {
      console.log(e);
    }
    // console.log("HELLO");
    // res.status(200).end();
    // return;
    const fees = await fetch(
      "https://gasstation-mainnet.matic.network/v2"
    ).then((response) => response.json());
    const fee = ethers.BigNumber.from(
      Math.floor(fees.standard.maxFee * 10 ** 9)
    );
    const tx = await signer.dropNFT(cacheId, winner, {
      gasPrice: fee,
      gasLimit,
    });
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
