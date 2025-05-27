const hre = require("hardhat");

async function main() {
  // Deploy the ERC20 Token
  const Token = await hre.ethers.getContractFactory("CardToken");
  const token = await Token.deploy();
  console.log("CardToken deployed to:", token.target);

  // Deploy the Marketplace with the token address
  const Marketplace = await hre.ethers.getContractFactory("CardMarketplace");
  const marketplace = await Marketplace.deploy(token.target);
  console.log("CardMarketplace deployed to:", marketplace.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
