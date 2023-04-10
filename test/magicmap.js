const { expect } = require("chai");
const { ethers } = require("hardhat");

const BASE_URI = "https://cdn.yaytso.art/magicmap/metadata/";

describe("Eggvents", function () {
  beforeEach(async function () {
    this.MagicMap = await ethers.getContractFactory("Eggvents");

    this.accounts = await ethers.getSigners();
    this.owner = this.accounts[0];
    this.notOwner = this.accounts[1];

    this.magicMap = await this.MagicMap.deploy(BASE_URI, this.owner.address);
    await this.magicMap.deployed();
  });

  it("has a name", async function () {
    const name = await this.magicMap.name();
    expect(name).to.equal("Eggvents");
  });

  it("has the symbol", async function () {
    const symbol = await this.magicMap.symbol();
    expect(symbol).to.equal("EGGVNTS");
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

  it("can lazy mint & has expected URI", async function () {
    const tokenType = "dnd";
    const nftData = {
      tokenType,
      receiver: this.owner.address,
    };

    const signature = await this.owner._signTypedData(
      {
        name: "teh-raptor",
        version: "1.0",
        chainId: await this.owner.getChainId(),
        verifyingContract: this.magicMap.address,
      },
      {
        Voucher: [
          { name: "tokenType", type: "string" },
          { name: "receiver", type: "address" },
        ],
      },
      nftData
    );
    await expect(this.magicMap.discover(nftData, signature))
      .to.emit(this.magicMap, "Transfer")
      .withArgs(ethers.constants.AddressZero, this.owner.address, 1);

    const tokenURI = await this.magicMap.tokenURI(1);
    console.log(tokenURI);
    expect(tokenURI).to.equal(`${BASE_URI}${tokenType}.json`);
  });

  it("can track token types of a user", async function () {
    var tokenType = "catalog";
    var nftData = {
      tokenType,
      receiver: this.owner.address,
    };

    var signature = await this.owner._signTypedData(
      {
        name: "teh-raptor",
        version: "1.0",
        chainId: await this.owner.getChainId(),
        verifyingContract: this.magicMap.address,
      },
      {
        Voucher: [
          { name: "tokenType", type: "string" },
          { name: "receiver", type: "address" },
        ],
      },
      nftData
    );
    await expect(this.magicMap.discover(nftData, signature))
      .to.emit(this.magicMap, "Transfer")
      .withArgs(ethers.constants.AddressZero, this.owner.address, 1);

    var tokenType = "dnd";
    var nftData = {
      tokenType,
      receiver: this.owner.address,
    };

    var signature = await this.owner._signTypedData(
      {
        name: "teh-raptor",
        version: "1.0",
        chainId: await this.owner.getChainId(),
        verifyingContract: this.magicMap.address,
      },
      {
        Voucher: [
          { name: "tokenType", type: "string" },
          { name: "receiver", type: "address" },
        ],
      },
      nftData
    );
    await expect(this.magicMap.discover(nftData, signature))
      .to.emit(this.magicMap, "Transfer")
      .withArgs(ethers.constants.AddressZero, this.owner.address, 2);

    const tokenTypes = await this.magicMap.getOwnerEggTypes(this.owner.address);
    console.log(tokenTypes);
    expect(tokenTypes[0]).to.equal("catalog");
    expect(tokenTypes[1]).to.equal("dnd");
  });

  it("can track token ids of a user", async function () {
    const tokenType = "dnd";
    const nftData = {
      tokenType,
      receiver: this.owner.address,
    };

    const signature = await this.owner._signTypedData(
      {
        name: "teh-raptor",
        version: "1.0",
        chainId: await this.owner.getChainId(),
        verifyingContract: this.magicMap.address,
      },
      {
        Voucher: [
          { name: "tokenType", type: "string" },
          { name: "receiver", type: "address" },
        ],
      },
      nftData
    );
    await expect(this.magicMap.discover(nftData, signature))
      .to.emit(this.magicMap, "Transfer")
      .withArgs(ethers.constants.AddressZero, this.owner.address, 1);

    const tokenIds = await this.magicMap.getOwnerEggIds(this.owner.address);
    expect(tokenIds[0]).to.equal(1);
  });
});
