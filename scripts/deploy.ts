import * as dotenv from "dotenv";
import { ethers, upgrades } from "hardhat";

dotenv.config();

async function main() {
  const BridgeAssist = await ethers.getContractFactory("BridgeAssist");
  const bridgeAssist = await upgrades.deployProxy(BridgeAssist, [
    process.env.DEV_WALLET,
    process.env.RELAYER_WALLET
  ]);

  await bridgeAssist.deployed();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
