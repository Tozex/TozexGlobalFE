import { ethers, upgrades } from "hardhat";
import { Wallet, utils, VoidSigner } from "ethers";
import {
  BridgeAssist, MockToken, MockERC721, MockERC1155
} from "../typechain";

interface Fixture {
  bridgeAssist: BridgeAssist;
  mockToken: MockToken;
  mockERC721: MockERC721;
  mockERC1155: MockERC1155;
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
  
  const mockERC721Factory = await ethers.getContractFactory("MockERC721");
  const mockERC721Instance = await mockERC721Factory.deploy();

  const mockERC1155Factory = await ethers.getContractFactory("MockERC1155");
  const mockERC1155Instance = await mockERC1155Factory.deploy();

  return {
    bridgeAssist: bridgeAssistInstance as BridgeAssist,
    mockToken: mockTokenInstance as MockToken,
    mockERC721: mockERC721Instance as MockERC721,
    mockERC1155: mockERC1155Instance as MockERC1155
  };
}
