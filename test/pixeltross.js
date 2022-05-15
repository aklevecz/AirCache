const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Pixeltross", function () {
  beforeEach(async function () {
    this.AirCache = await ethers.getContractFactory("AirYaytso");
    this.airCache = await this.AirCache.deploy();
    await this.airCache.deployed();

    this.Pixeltross = await ethers.getContractFactory("Pixeltross");
    this.pixeltross = await this.Pixeltross.deploy(
      "https://cdn.yaytso.art/pixeltross/metadata/"
    );
    await this.pixeltross.deployed();

    this.accounts = await ethers.getSigners();
    this.owner = this.accounts[0];
    this.notOwner = this.accounts[1];
  });

  it("Create cache", async function () {
    await this.pixeltross.createTross(this.owner.address, 2);
    console.log(await this.pixeltross.tokenURI(2));
  });
});
