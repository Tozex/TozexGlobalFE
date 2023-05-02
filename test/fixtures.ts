import { ethers, upgrades } from "hardhat";
import { Wallet, utils, VoidSigner } from "ethers";
import {
  BridgeAssist, MockToken
} from "../typechain";

interface Fixture {
  bridgeAssist: BridgeAssist;
  mockToken: MockToken;
}

export async function contractFixture([
  dev,
  relayer,
]: Wallet[]): Promise<Fixture> {
  const bridgeAssistFactory = await ethers.getContractFactory("BridgeAssist");
  const bridgeAssistInstance = await upgrades.deployProxy(bridgeAssistFactory, [
      dev.address,
      relayer.address,
    ]);
  await bridgeAssistInstance.deployed();
  
  const mockTokenFactory = await ethers.getContractFactory("MockToken");
  const mockTokenInstance = await mockTokenFactory.deploy("Token 1", "TKN1");
  
  return {
    bridgeAssist: bridgeAssistInstance as BridgeAssist,
    mockToken: mockTokenInstance as MockToken
  };
}
