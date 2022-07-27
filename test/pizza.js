const { expect } = require("chai");
const { ethers } = require("hardhat");

const pizza = [16, 9, 26, 26, 1];

describe("Pizza City", function () {
  beforeEach(async function () {
    this.AirCache = await ethers.getContractFactory("AirYaytso");
    this.airCache = await this.AirCache.deploy();
    await this.airCache.deployed();

    this.PizzaCity = await ethers.getContractFactory("PizzaCity");
    this.pizzaCity = await this.PizzaCity.deploy(
      "https://cdn.yaytso.art/alphabet-city/metadata/",
      this.airCache.address
    );
    await this.pizzaCity.deployed();

    this.accounts = await ethers.getSigners();
    this.owner = this.accounts[0];
    this.notOwner = this.accounts[1];
    this.anotherAccount = this.accounts[2];

    this.pizzaCity.mintLetter(this.owner.address, 1);
  });
  it("Starts with the first pizza index", async function () {
    const nextPizza = await this.pizzaCity.pizzaIndex();
    expect(nextPizza).to.equal(0);
  });
  it("Can win", async function () {
    // Almost wins
    var tokenIds = [];
    await this.pizzaCity.mintLetter(this.owner.address, 16);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.pizzaCity.mintLetter(this.owner.address, 9);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.pizzaCity.mintLetter(this.owner.address, 26);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.pizzaCity.mintLetter(this.owner.address, 26);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    for (let i = 0; i < tokenIds.length; i++) {
      this.pizzaCity.transferFrom(
        this.owner.address,
        this.notOwner.address,
        tokenIds[i]
      );
    }

    // Someone else wins
    var tokenIds = [];
    await this.pizzaCity.mintLetter(this.owner.address, 16);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.pizzaCity.mintLetter(this.owner.address, 9);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.pizzaCity.mintLetter(this.owner.address, 26);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.pizzaCity.mintLetter(this.owner.address, 26);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.pizzaCity.mintLetter(this.owner.address, 1);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    for (let i = 0; i < tokenIds.length; i++) {
      this.pizzaCity.transferFrom(
        this.owner.address,
        this.anotherAccount.address,
        tokenIds[i]
      );
    }

    // Almost winner wins
    var tokenIds = [];
    await this.pizzaCity.mintLetter(this.owner.address, 16);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.pizzaCity.mintLetter(this.owner.address, 9);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.pizzaCity.mintLetter(this.owner.address, 26);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.pizzaCity.mintLetter(this.owner.address, 26);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.pizzaCity.mintLetter(this.owner.address, 1);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    for (let i = 0; i < tokenIds.length; i++) {
      this.pizzaCity.transferFrom(
        this.owner.address,
        this.notOwner.address,
        tokenIds[i]
      );
    }

    // Expect to be on the third pizza
    const nextPizza = await this.pizzaCity.pizzaIndex();
    expect(nextPizza.toNumber()).to.equal(2);
  });
  it("Can't win twice", async function () {
    expect(await this.pizzaCity.pizzaIndex()).to.equal(0);

    var tokenIds = [];
    await this.pizzaCity.mintLetter(this.owner.address, 16);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.pizzaCity.mintLetter(this.owner.address, 9);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.pizzaCity.mintLetter(this.owner.address, 26);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.pizzaCity.mintLetter(this.owner.address, 26);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.pizzaCity.mintLetter(this.owner.address, 1);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    for (let i = 0; i < tokenIds.length; i++) {
      await this.pizzaCity.transferFrom(
        this.owner.address,
        this.notOwner.address,
        tokenIds[i]
      );
    }
    expect(await this.pizzaCity.pizzaIndex()).to.equal(1);

    await this.pizzaCity.mintLetter(this.owner.address, 16);
    tokenId = (await this.pizzaCity.tokenId()).toNumber();
    await expect(
      this.pizzaCity.transferFrom(
        this.owner.address,
        this.notOwner.address,
        tokenId
      )
    ).to.be.revertedWith("You may only play once!");
  });
});
