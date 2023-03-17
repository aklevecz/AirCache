const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HifiHoodies", function () {
  beforeEach(async function () {
    this.HiFiHoodies = await ethers.getContractFactory("HiFiHoodie");
    this.hifiHoodies = await this.HiFiHoodies.deploy("https://cdn.yaytso.art/hifihoodies/metadata/");
    await this.hifiHoodies.deployed();

    this.accounts = await ethers.getSigners();
    this.owner = this.accounts[0];
    this.notOwner = this.accounts[1];
  });

  it("uri works", async function () {
    await this.hifiHoodies.stitch(2);
    console.log(await this.hifiHoodies.name());
    // console.log(await this.HiFiHoodies.symbol());
    console.log(await this.hifiHoodies.tokenURI(2));
  });
});
