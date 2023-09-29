import * as dotenv from "dotenv";

dotenv.config();
import { ethers as _ethers } from "ethers";
import { ethers, upgrades } from "hardhat";

async function main() {
  const BridgeAddress = "0xCd4Cc4bA42D352Acf6F0519D4e6D8351579d4669"
  const BridgeAssist = await ethers.getContractFactory("BridgeAssist");
  const Bridge = await upgrades.upgradeProxy(BridgeAddress, BridgeAssist);
  console.log("Bridge upgraded to:", Bridge.address);
}
  
  main();