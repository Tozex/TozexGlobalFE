import { expect } from "chai";
import { ethers, waffle, upgrades } from "hardhat";
import { Wallet } from "ethers";
import { createFixtureLoader } from "ethereum-waffle";
import { contractFixture } from "./fixtures";
import { BridgeAssist } from "../typechain/BridgeAssist";
import { MockToken } from '../typechain/MockToken';

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

describe("BridgeAssist", function () {
  let bridgeAssist: ThenArg<ReturnType<typeof contractFixture>>["bridgeAssist"];
  let mockToken: ThenArg<ReturnType<typeof contractFixture>>["mockToken"];
  let dev: Wallet;
  let relayer: Wallet;
  let owner: Wallet;
  let user1: Wallet;
  let user2: Wallet;
  
  let loadFixture: ReturnType<typeof createFixtureLoader>;

  beforeEach(async function () {
    [owner, dev, relayer, user1, user2] = await (ethers as any).getSigners();
    loadFixture = createFixtureLoader([
      dev,
      relayer
    ]);
    ({ bridgeAssist, mockToken } = await loadFixture(contractFixture));
    await bridgeAssist.addToken(mockToken.address);
  });

  describe("addToken", function () {
    it("should add a new token", async function () {
      const tx = await bridgeAssist.addToken(mockToken.address);
      expect(tx)
        .to.emit(bridgeAssist, "AddToken")
        .withArgs(owner.address, mockToken.address);
      expect(await bridgeAssist.tokens(0)).to.equal(mockToken.address);
    });
  });

  describe("setDev", function () {
    it("should set the dev address", async function () {
      const tx = await bridgeAssist.connect(owner).setDev(user1.address);
      expect(tx)
        .to.emit(bridgeAssist, "SetDev")
        .withArgs(owner.address, user1.address);
      expect(await bridgeAssist.dev()).to.equal(user1.address);
    });
  });

  describe("setRelayer", function () {
    it("should set the relayer address", async function () {
      const tx = await bridgeAssist.connect(owner).setRelayer(user1.address);
      expect(tx)
        .to.emit(bridgeAssist, "SetRelayer")
        .withArgs(owner.address, user1.address);
      expect(await bridgeAssist.relayer()).to.equal(user1.address);
    });
  });

  describe("submitTransaction", function () {
    it("should submit a new transaction", async function () {
      const value = 100;
      await mockToken.connect(user1).mint(user1.address, value);
      await mockToken.connect(user1).approve(bridgeAssist.address, value);
      const tx = await bridgeAssist
        .connect(relayer)
        .submitTransaction(user1.address, 0, value, 1);
      const transactionId = 0;
      expect(tx)
        .to.emit(bridgeAssist, "Submission")
        .withArgs(transactionId);
      expect(await bridgeAssist.isConfirmed(transactionId)).to.be.true;
      expect(await mockToken.balanceOf(bridgeAssist.address)).to.equal(value);
    });
  });

  describe("confirmTransaction", function () {
    this.beforeEach("Add transactions", async function () {
      const value = 100;
      await mockToken.connect(user1).mint(user1.address, value);
      await mockToken.connect(user1).approve(bridgeAssist.address, value);
      await bridgeAssist
        .connect(relayer)
        .submitTransaction(user1.address, 0, value, 1);
      await bridgeAssist
        .connect(relayer)
        .submitTransaction(user2.address, 0, value, 2);

      expect(await bridgeAssist.isConfirmed(0)).to.be.true;
      expect(await bridgeAssist.isConfirmed(1)).to.be.false;
      expect(await mockToken.balanceOf(bridgeAssist.address)).to.equal(value);
    });
    it("should revert for a already confirmed transaction", async function () {
      await expect(bridgeAssist.connect(user1).confirmTransaction(0)).be.reverted;
    });
    it("should confirm a transaction", async function () {
      const value = 100;
      const tx = await bridgeAssist.connect(user2).confirmTransaction(1);
      // Check that the transaction was confirmed successfully
      expect(tx).to.emit(bridgeAssist, "Confirmation").withArgs(user2.address, 1)
      .emit(bridgeAssist, "Dispense").withArgs(user2.address, value)
      expect(await bridgeAssist.confirmations(1, user2.address)).to.be.true;
    });
  });
});