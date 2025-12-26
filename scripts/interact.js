const hre = require("hardhat");

async function main() {
  // Get the deployed contract
  const MyContractDeployment = await hre.deployments.get("MyContract");
  const MyContract = await hre.ethers.getContractAt(
    "MyContract",
    MyContractDeployment.address
  );

  console.log("Contract deployed at:", MyContract.address);

  // Read current message
  let message = await MyContract.message();
  console.log("Current message:", message);

  // Update message
  const tx = await MyContract.setMessage("Hello, blockchain!");
  await tx.wait();

  message = await MyContract.message();
  console.log("Updated message:", message);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
