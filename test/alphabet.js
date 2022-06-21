const { expect } = require("chai");
const { ethers } = require("hardhat");

const pizza = [16, 9, 26, 26, 1];
const a = [1];
const lemon = [12, 5, 13, 15, 14];
const joker = [10, 15, 11, 5, 18];

describe("Alphabet City", function () {
  beforeEach(async function () {
    this.AirCache = await ethers.getContractFactory("AirYaytso");
    this.airCache = await this.AirCache.deploy();
    await this.airCache.deployed();

    this.AlphabetCity = await ethers.getContractFactory("AlphabetCity");
    this.alphabetCity = await this.AlphabetCity.deploy(
      "https://cdn.yaytso.art/alphabet-city/metadata/"
    );
    await this.alphabetCity.deployed();

    this.accounts = await ethers.getSigners();
    this.owner = this.accounts[0];
    this.notOwner = this.accounts[1];
    this.anotherAccount = this.accounts[2];

    this.alphabetCity.mintLetter(this.owner.address, 1);
    this.alphabetCity.mintWord(this.owner.address, a);
    this.alphabetCity.mintWord(this.owner.address, joker);
    this.alphabetCity.mintWord(this.owner.address, lemon);

    this.alphabetCity.tokenURI(1).then(console.log);
  });

  it("Create the first word with one account, and the second word with another account", async function () {
    const nextWorda = await this.alphabetCity.wordIndex();
    let owner = await this.alphabetCity.ownerOf(1);
    console.log(owner);
    expect(nextWorda.toNumber()).to.equal(1);
    await this.alphabetCity.mintLetter(this.owner.address, 1);
    let tokenId = (await this.alphabetCity.tokenId()).toNumber();
    await this.alphabetCity.transferFrom(
      this.owner.address,
      this.notOwner.address,
      tokenId
    );
    const nextWord = await this.alphabetCity.wordIndex();
    expect(nextWord.toNumber()).to.equal(2);

    const tokenIds = [];
    await this.alphabetCity.mintLetter(this.owner.address, 10);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 15);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 11);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 5);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 18);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    for (let i = 0; i < tokenIds.length; i++) {
      await this.alphabetCity.transferFrom(
        this.owner.address,
        this.anotherAccount.address,
        tokenIds[i]
      );
    }
    const nextWord1 = await this.alphabetCity.wordIndex();
    expect(nextWord1.toNumber()).to.equal(3);
    owner = await this.alphabetCity.ownerOf(1);
    console.log(owner);
  });
  it("can't play after winning once", async function () {
    const nextWorda = await this.alphabetCity.wordIndex();
    expect(nextWorda.toNumber()).to.equal(1);
    await this.alphabetCity.mintLetter(this.owner.address, 1);
    let tokenId = (await this.alphabetCity.tokenId()).toNumber();
    await this.alphabetCity.transferFrom(
      this.owner.address,
      this.notOwner.address,
      tokenId
    );
    const nextWord = await this.alphabetCity.wordIndex();
    expect(nextWord.toNumber()).to.equal(2);

    const tokenIds = [];
    await this.alphabetCity.mintLetter(this.owner.address, 10);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 15);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 11);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 5);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 18);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    for (let i = 0; i < tokenIds.length; i++) {
      await expect(
        this.alphabetCity.transferFrom(
          this.owner.address,
          this.notOwner.address,
          tokenIds[i]
        )
      ).to.be.revertedWith("You may only play once!");
    }
    const nextWord1 = await this.alphabetCity.wordIndex();
    expect(nextWord1.toNumber()).to.equal(2);
  });
  it("gets the current word", async function () {
    const word = await this.alphabetCity.getWord();
    console.log(word);
  });
  it("can win another word after not winning the first one", async function () {
    await this.alphabetCity.mintLetter(this.owner.address, 1);
    aid = (await this.alphabetCity.tokenId()).toNumber();
    await this.alphabetCity.transferFrom(
      this.owner.address,
      this.accounts[3].address,
      aid
    );
    // someone almost finishing
    let tokenIds = [];
    await this.alphabetCity.mintLetter(this.owner.address, 10);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 15);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 11);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 5);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 18);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    for (let i = 0; i < tokenIds.length - 1; i++) {
      await this.alphabetCity.transferFrom(
        this.owner.address,
        this.anotherAccount.address,
        tokenIds[i]
      );
    }

    tokenIds = [];
    await this.alphabetCity.mintLetter(this.owner.address, 10);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 15);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 11);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 5);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 18);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    for (let i = 0; i < tokenIds.length; i++) {
      await this.alphabetCity.transferFrom(
        this.owner.address,
        this.notOwner.address,
        tokenIds[i]
      );
    }

    tokenIds = [];
    await this.alphabetCity.mintLetter(this.owner.address, 12);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 5);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 13);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 15);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);
    await this.alphabetCity.mintLetter(this.owner.address, 14);
    tokenId = (await this.alphabetCity.tokenId()).toNumber();
    tokenIds.push(tokenId);

    for (let i = 0; i < tokenIds.length; i++) {
      await this.alphabetCity.transferFrom(
        this.owner.address,
        this.anotherAccount.address,
        tokenIds[i]
      );
      const w = await this.alphabetCity.getUsersGuesses(
        this.anotherAccount.address
      );
      console.log(w);
    }
  });
});
