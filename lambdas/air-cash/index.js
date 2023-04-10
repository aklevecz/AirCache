const { ethers } = require("ethers");
const fetch = require("node-fetch");
const ContractInterface = require("./Eggvents.json");

// 4/8
const maticAddress = "0x754D19624d32f746d1393AA364ED50FeCcc577EB";

// MUMBAI
const mumbaiAddress = "0x044f3e29ECB231169a1cdfaD1bAaA847A69482D0";

const LIVE = process.env.LIVE === "LIVE";
const PP2 = process.env.PP2;

const ALCHEMY_KEY = LIVE ? process.env.ALCHEMY_KEY : process.env.ALCHEMY_KEY_MUMBAI;

const network = LIVE ? "matic" : "maticmum";
const chainId = LIVE ? 137 : 80001;
const contractAddress = LIVE ? maticAddress : mumbaiAddress;
const defaultProvider = new ethers.providers.AlchemyProvider(network, ALCHEMY_KEY);

exports.handler = async (event) => {
  const messageAttributes = event.Records[0].messageAttributes;
  try {
    const winner = messageAttributes.address?.stringValue;
    var tokenType = messageAttributes.tokenType?.stringValue;

    const masterWallet = new ethers.Wallet(PP2, defaultProvider);
    const value = ethers.utils.parseEther("1");
    const fees = await fetch(`https://polygon-${LIVE ? "mainnet" : "mumbai"}.g.alchemyapi.io/v2/` + ALCHEMY_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}',
    }).then((response) => response.json());

    // SEND CASH
    // var tx = await masterWallet.sendTransaction({ to: winner, value, gasPrice: fees.result });
    // END SEND CASH

    // MINT TOKEN
    const contract = new ethers.Contract(contractAddress, ContractInterface.abi, masterWallet.provider);
    const signer = contract.connect(masterWallet);

    const nftData = {
      tokenType,
      receiver: winner,
    };

    const signature = await masterWallet._signTypedData(
      {
        name: "teh-raptor",
        version: "1.0",
        chainId: await masterWallet.getChainId(),
        verifyingContract: contractAddress,
      },
      {
        Voucher: [
          { name: "tokenType", type: "string" },
          { name: "receiver", type: "address" },
        ],
      },
      nftData
    );
    console.log(signature, nftData);
    var tx = await signer.discover(nftData, signature, {
      gasPrice: fees.result,
      gasLimit: 900000,
    });
    // END MINT TOKEN

    var receipt = await tx.wait();
    for (var event of receipt.events) {
      console.log(event);
    }
  } catch (e) {
    console.log(e);
    return { statusCode: 404 };
  }
};
