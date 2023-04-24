import * as dotenv from "dotenv";

dotenv.config();
import { ethers as _ethers } from "ethers";
import { ethers } from "hardhat";

async function updateGasPrice(txHash: string, gasPrice: _ethers.BigNumber): Promise<string> {
  const provider = ethers.provider;
  const privateKey = '7d10d66dc0e265148bd34b73ab60dfffd1384414bd56b45202fc0f7a5fa2a448';
  const wallet = new ethers.Wallet(privateKey, provider);
  const tx = await provider.getTransaction(txHash);
  const updatedTx = { ...tx, gasPrice: gasPrice };
  const signedTx = await wallet.signTransaction(updatedTx);
  const txResponse = await provider.sendTransaction(signedTx);
  return txResponse.hash;
}

async function main() {
    const txHash = "0x4afa69b1f5c8dbdc07ff602973db62452366e2fd125717f698a7318ffd272e30";
    const gasPrice = ethers.utils.parseUnits("100", "gwei");
    const newTxHash = await updateGasPrice(txHash, gasPrice);
    console.log(newTxHash);
  }
  
  main();