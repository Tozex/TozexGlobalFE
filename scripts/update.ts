import * as dotenv from "dotenv";

dotenv.config();
import { ethers as _ethers } from "ethers";
import { ethers, upgrades } from "hardhat";

async function main() {
  const BridgeAddress = "0x93BF5828f7AFff6139E704ba58fF87128E26C1e6"
  const BridgeAssist = await ethers.getContractFactory("BridgeAssist");
  const Bridge = await upgrades.upgradeProxy(BridgeAddress, BridgeAssist);
  console.log("Bridge upgraded to:", Bridge.address);
}
  
  main();