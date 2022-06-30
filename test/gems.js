const { expect } = require("chai");
const { ethers } = require("hardhat");

const DOUBLOON = 0;
const EMERALD = 1;
const RUBY = 2;
const DIAMOND = 3;
const AMETHYST = 4;
const GOLD_RING = 5;
const GOLD_NECKLACE = 6;

const firstCreatedItemId = 7;

describe("Gems", function () {
  beforeEach(async function () {
    // this.AirCache = await ethers.getContractFactory("AirYaytso");
    // this.airCache = await this.AirCache.deploy();
    // await this.airCache.deployed();

    this.Gems = await ethers.getContractFactory("Gems");
    this.gems = await this.Gems.deploy();
    await this.gems.deployed();

    this.accounts = await ethers.getSigners();
    this.owner = this.accounts[0];
    this.notOwner = this.accounts[1];
  });

  it("token 1 is named emerald", async function () {
    const emerald = await this.gems.itemNames(1);
    expect(emerald).to.equal("emerald");
  });
  it("Can encrust an emerald and a ring", async function () {
    await expect(this.gems.encrustJewelery(EMERALD, GOLD_RING))
      .to.emit(this.gems, "JeweleryEncrusted")
      .withArgs(EMERALD, GOLD_RING, firstCreatedItemId, this.owner.address);
  });
  it("Can't encrust without gems and jewelery", async function () {
    const otherOwnerSigner = this.gems.connect(this.notOwner);
    await expect(
      otherOwnerSigner.encrustJewelery(EMERALD, GOLD_RING, {
        from: this.notOwner.address,
      })
    ).to.be.revertedWith("ERC1155: burn amount exceeds balance");
  });
  it("Can't encrust without jewelery", async function () {
    await this.gems.safeTransferFrom(
      this.owner.address,
      this.notOwner.address,
      EMERALD,
      1,
      0x0
    );
    const otherOwnerSigner = this.gems.connect(this.notOwner);

    await expect(
      otherOwnerSigner.encrustJewelery(EMERALD, GOLD_RING, {
        from: this.notOwner.address,
      })
    ).to.be.revertedWith("ERC1155: burn amount exceeds balance");
  });
  it("Can encrust after receiving a gem and jewelery", async function () {
    await this.gems.safeTransferFrom(
      this.owner.address,
      this.notOwner.address,
      EMERALD,
      1,
      0x0
    );
    await this.gems.safeTransferFrom(
      this.owner.address,
      this.notOwner.address,
      GOLD_RING,
      1,
      0x0
    );
    const otherOwnerSigner = this.gems.connect(this.notOwner);
    await expect(otherOwnerSigner.encrustJewelery(EMERALD, GOLD_RING))
      .to.emit(this.gems, "JeweleryEncrusted")
      .withArgs(EMERALD, GOLD_RING, firstCreatedItemId, this.notOwner.address);
  });
  it("Can create a new gem as the owner", async function () {
    await expect(this.gems.createNewItem("peridot", true))
      .to.emit(this.gems, "NewItemCreated")
      .withArgs("peridot", firstCreatedItemId, true);
  });
  it("Can create a new piece of jewelery as the owner", async function () {
    await expect(this.gems.createNewItem("gold-bracelet", false))
      .to.emit(this.gems, "NewItemCreated")
      .withArgs("gold-bracelet", firstCreatedItemId, false);
  });
});
