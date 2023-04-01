const { ethers } = require("ethers");
const fetch = require("node-fetch");

const LIVE = process.env.LIVE === "LIVE";
const PP2 = process.env.PP2;

const ALCHEMY_KEY = LIVE ? process.env.ALCHEMY_KEY : process.env.ALCHEMY_KEY_MUMBAI;

const network = LIVE ? "matic" : "maticmum";
const defaultProvider = new ethers.providers.AlchemyProvider(network, ALCHEMY_KEY);

exports.handler = async (event) => {
  const messageAttributes = event.Records[0].messageAttributes;
  try {
    const winner = messageAttributes.address.stringValue;
    const masterWallet = new ethers.Wallet(PP2, defaultProvider);
    const value = ethers.utils.parseEther("1");
    const fees = await fetch(`https://polygon-${LIVE ? "mainnet" : "mainnet"}.g.alchemyapi.io/v2/` + process.env.ALCHEMY_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}',
    }).then((response) => response.json());
    const tx = await masterWallet.sendTransaction({ to: winner, value, gasPrice: fees.result });
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
