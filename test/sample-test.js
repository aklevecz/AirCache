const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AirCache", function () {
  beforeEach(async function () {
    this.AirCache = await ethers.getContractFactory("AirYaytso");
    this.airCache = await this.AirCache.deploy();
    await this.airCache.deployed();

    this.FakeNFT = await ethers.getContractFactory("FakeNFT");
    this.fakeNFT = await this.FakeNFT.deploy();
    await this.fakeNFT.deployed();

    this.accounts = await ethers.getSigners();
    this.owner = this.accounts[0];
    this.notOwner = this.accounts[1];
  });

  it("Create cache", async function () {
    const lat = ethers.utils.formatBytes32String("100");
    const lng = ethers.utils.formatBytes32String("100");
    await this.airCache.createCache(lat, lng);
  });

  it("AirCache owns a NFT", async function () {
    const lat = ethers.utils.formatBytes32String("100");
    const lng = ethers.utils.formatBytes32String("100");
    await this.airCache.createCache(lat, lng);
    await this.fakeNFT.approve(this.airCache.address, 1);
    await this.airCache.holdNFT(this.fakeNFT.address, 1, 1);
    const owner = await this.fakeNFT.ownerOf(1);
    expect(owner).to.equal(this.airCache.address);
  });

  it("AirCache drops a NFT", async function () {
    const lat = ethers.utils.formatBytes32String("100");
    const lng = ethers.utils.formatBytes32String("100");
    await this.airCache.createCache(lat, lng);
    await this.fakeNFT.approve(this.airCache.address, 1);
    await this.airCache.holdNFT(this.fakeNFT.address, 1, 1);
    const owner = await this.fakeNFT.ownerOf(1);
    expect(owner).to.equal(this.airCache.address);

    await this.airCache.dropNFT(1, this.notOwner.address);
    const newOwner = await this.fakeNFT.ownerOf(1);
    expect(newOwner).to.equal(this.notOwner.address);
  });

  it("Can't fill a non-existent cache", async function () {
    await expect(
      this.airCache.holdNFT(this.fakeNFT.address, 1, 1)
    ).to.be.revertedWith("Cache does not exist");
  });

  it("Can't fill a full cache", async function () {
    var lat = ethers.utils.formatBytes32String("100");
    var lng = ethers.utils.formatBytes32String("100");
    await this.fakeNFT.approve(this.airCache.address, 1);
    await this.fakeNFT.approve(this.airCache.address, 2);

    await this.airCache.createCache(lat, lng);
    await this.airCache.holdNFT(this.fakeNFT.address, 1, 1);
    await expect(
      this.airCache.holdNFT(this.fakeNFT.address, 2, 1)
    ).to.be.revertedWith("Cache is being used");
  });

  it("Can't fill cache without token approval", async function () {
    var lat = ethers.utils.formatBytes32String("100");
    var lng = ethers.utils.formatBytes32String("100");

    await this.airCache.createCache(lat, lng);
    await expect(
      this.airCache.holdNFT(this.fakeNFT.address, 1, 1)
    ).to.be.revertedWith("Token transfer failed");
  });

  it("Fake has URI", async function () {
    const uri = await this.fakeNFT.tokenURI(1);
    expect(uri.length).to.be.greaterThan(0);
  });
});
