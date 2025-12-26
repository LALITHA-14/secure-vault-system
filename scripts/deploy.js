const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with:", deployer.address);
  console.log("Chain ID:", (await hre.ethers.provider.getNetwork()).chainId);

  // Deploy AuthorizationManager
  const Auth = await hre.ethers.getContractFactory("AuthorizationManager");
  const authManager = await Auth.deploy();
  await authManager.waitForDeployment();

  console.log("AuthorizationManager deployed at:", await authManager.getAddress());

  // Deploy SecureVault
  const Vault = await hre.ethers.getContractFactory("SecureVault");
  const vault = await Vault.deploy(await authManager.getAddress());
  await vault.waitForDeployment();

  console.log("SecureVault deployed at:", await vault.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
