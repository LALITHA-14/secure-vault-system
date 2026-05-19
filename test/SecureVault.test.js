const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SecureVault", function () {

    let vault;
    let authManager;

    let owner;
    let user;
    let attacker;

    beforeEach(async function () {

        [owner, user, attacker] =
            await ethers.getSigners();

        // Deploy AuthorizationManager
        const AuthorizationManager =
            await ethers.getContractFactory(
                "AuthorizationManager"
            );

        authManager =
            await AuthorizationManager.deploy(
                owner.address
            );

        await authManager.waitForDeployment();

        // Deploy Vault
        const SecureVault =
            await ethers.getContractFactory(
                "SecureVault"
            );

        vault =
            await SecureVault.deploy(
                await authManager.getAddress()
            );

        await vault.waitForDeployment();

        // Deposit ETH into vault
        await owner.sendTransaction({
            to: await vault.getAddress(),
            value: ethers.parseEther("5")
        });
    });

    async function createSignature(
        recipient,
        amount,
        authId
    ) {

        const network =
            await ethers.provider.getNetwork();

        const chainId = network.chainId;

        const hash =
            ethers.solidityPackedKeccak256(
                [
                    "address",
                    "uint256",
                    "address",
                    "uint256",
                    "bytes32"
                ],
                [
                    await vault.getAddress(),
                    chainId,
                    recipient,
                    amount,
                    authId
                ]
            );

        return await owner.signMessage(
            ethers.getBytes(hash)
        );
    }

    it("Should accept deposits", async function () {

        await user.sendTransaction({
            to: await vault.getAddress(),
            value: ethers.parseEther("1")
        });

        const balance =
            await ethers.provider.getBalance(
                await vault.getAddress()
            );

        expect(balance).to.equal(
            ethers.parseEther("6")
        );
    });

    it("Should allow valid withdrawals", async function () {

        const amount =
            ethers.parseEther("1");

        const authId =
            ethers.keccak256(
                ethers.toUtf8Bytes("AUTH-1")
            );

        const signature =
            await createSignature(
                user.address,
                amount,
                authId
            );

        await vault.withdraw(
            user.address,
            amount,
            authId,
            signature
        );

        const balance =
            await ethers.provider.getBalance(
                await vault.getAddress()
            );

        expect(balance).to.equal(
            ethers.parseEther("4")
        );
    });

    it("Should reject reused authorization", async function () {

        const amount =
            ethers.parseEther("1");

        const authId =
            ethers.keccak256(
                ethers.toUtf8Bytes("AUTH-2")
            );

        const signature =
            await createSignature(
                user.address,
                amount,
                authId
            );

        await vault.withdraw(
            user.address,
            amount,
            authId,
            signature
        );

        await expect(
            vault.withdraw(
                user.address,
                amount,
                authId,
                signature
            )
        ).to.be.revertedWith(
            "Authorization already used"
        );
    });

    it("Should reject invalid signature", async function () {

        const amount =
            ethers.parseEther("1");

        const authId =
            ethers.keccak256(
                ethers.toUtf8Bytes("AUTH-3")
            );

        const fakeHash =
            ethers.solidityPackedKeccak256(
                ["string"],
                ["FAKE"]
            );

        const fakeSignature =
            await attacker.signMessage(
                ethers.getBytes(fakeHash)
            );

        await expect(
            vault.withdraw(
                user.address,
                amount,
                authId,
                fakeSignature
            )
        ).to.be.revertedWith(
            "Invalid signature"
        );
    });

    it("Should reject insufficient balance", async function () {

        const amount =
            ethers.parseEther("100");

        const authId =
            ethers.keccak256(
                ethers.toUtf8Bytes("AUTH-4")
            );

        const signature =
            await createSignature(
                user.address,
                amount,
                authId
            );

        await expect(
            vault.withdraw(
                user.address,
                amount,
                authId,
                signature
            )
        ).to.be.revertedWith(
            "Insufficient vault balance"
        );
    });
});