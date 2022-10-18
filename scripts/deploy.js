const hre = require("hardhat");
const fs = require('fs');

require('dotenv').config({path:__dirname+'/.env'})

async function main() {

  const [deployer] = await ethers.getSigners()

  const platformFee = 1000; //(10000 = 10%)
  const platform_wallet = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  /* deploy the bloxblockfactory */
  const BoxBlockNFTFactory = await hre.ethers.getContractFactory("BoxBlockNFTFactory");
  const boxBlockNFTFactory = await BoxBlockNFTFactory.deploy();
  await boxBlockNFTFactory.deployed();

  /* deploy the marketplace */
  const BoxBlockNFTMarketplace = await hre.ethers.getContractFactory("BoxBlockNFTMarketplace");
  const boxblockMarketplace = await BoxBlockNFTMarketplace.deploy(platformFee, platform_wallet, boxBlockNFTFactory.address);
  await boxblockMarketplace.deployed();

  /* deploy the payment token */
  const BoxBlockPaymentEth = await hre.ethers.getContractFactory("BoxBlockPaymentEth");
  const boxBlockPaymentEth = await BoxBlockPaymentEth.deploy();
  await boxBlockPaymentEth.deployed();

  await boxblockMarketplace.addPayableToken(boxBlockPaymentEth.address);

  let text_to_wirte = `export const marketplaceAddress = "${boxblockMarketplace.address}";\n`;
  text_to_wirte += `export const factoryAddress = "${boxBlockNFTFactory.address}";\n`;
  text_to_wirte += `export const paymentAddress = "${boxBlockPaymentEth.address}";\n`;
  text_to_wirte += `export const paymentTokens = [{token: "${boxBlockPaymentEth.address}", name: "Eth"}];\n`;

  fs.writeFileSync('./config.js', text_to_wirte);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
