const hre = require("hardhat");

async function main() {

    const [deployer] = await hre.ethers.getSigners();

    console.log("====================================");
    console.log("Deploying Secure Vault System");
    console.log("====================================");

    console.log("Deployer Address:", deployer.address);

    const network = await hre.ethers.provider.getNetwork();

    console.log("Chain ID:", network.chainId.toString());

    // Deploy AuthorizationManager
    const AuthorizationManager =
        await hre.ethers.getContractFactory(
            "AuthorizationManager"
        );

    const authManager =
        await AuthorizationManager.deploy(
            deployer.address
        );

    await authManager.waitForDeployment();

    const authManagerAddress =
        await authManager.getAddress();

    console.log(
        "AuthorizationManager deployed to:",
        authManagerAddress
    );

    // Deploy SecureVault
    const SecureVault =
        await hre.ethers.getContractFactory(
            "SecureVault"
        );

    const vault =
        await SecureVault.deploy(
            authManagerAddress
        );

    await vault.waitForDeployment();

    const vaultAddress =
        await vault.getAddress();

    console.log(
        "SecureVault deployed to:",
        vaultAddress
    );

    console.log("====================================");
    console.log("Deployment Complete");
    console.log("====================================");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});