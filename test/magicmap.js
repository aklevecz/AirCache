const { expect } = require("chai");
const { ethers } = require("hardhat");

const BASE_URI = "https://cdn.yaytso.art/magicmap/metadata/";

describe("MagicMap", function () {
  beforeEach(async function () {
    this.MagicMap = await ethers.getContractFactory("MagicMap");

    this.accounts = await ethers.getSigners();
    this.owner = this.accounts[0];
    this.notOwner = this.accounts[1];

    this.magicMap = await this.MagicMap.deploy(BASE_URI, this.owner.address);
    await this.magicMap.deployed();
  });

  it("has a name", async function () {
    const name = await this.magicMap.name();
    expect(name).to.equal("MagicMap");
  });

  it("has the symbol", async function () {
    const symbol = await this.magicMap.symbol();
    expect(symbol).to.equal("MAGMAP");
  });

  it("can change baseuri", async function () {
    const newUri = "newUri";
    await this.magicMap.changeBaseURI(newUri);
    const uri = await this.magicMap.baseURI();
    expect(uri).to.equal(newUri);
  });

  it("can change oracle", async function () {
    const currentOracle = await this.magicMap.oracle();
    await this.magicMap.changeOracle(this.notOwner.address);
    const newOracle = await this.magicMap.oracle();
    expect(newOracle).to.equal(this.notOwner.address);
  });

  it("can lazy mint", async function () {
    const tokenType = 10;
    const nftData = {
      tokenType,
    };

    const signature = await this.owner._signTypedData(
      {
        name: "teh-raptor",
        version: "1.0",
        chainId: await this.owner.getChainId(),
        verifyingContract: this.magicMap.address,
      },
      {
        SignedNFTData: [{ name: "tokenType", type: "uint8" }],
      },
      nftData
    );
    await expect(this.magicMap.discover(nftData, signature))
      .to.emit(this.magicMap, "Transfer")
      .withArgs(ethers.constants.AddressZero, this.owner.address, 1);

    const tokenURI = await this.magicMap.tokenURI(1);
    expect(tokenURI).to.equal(`${BASE_URI}${tokenType}.json`);
  });
});
