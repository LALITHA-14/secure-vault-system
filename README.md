\# Secure Vault System



A minimal Ethereum smart contract system that enables secure ETH storage and controlled withdrawals using one-time authorizations with replay protection.



---



\## Overview



The Secure Vault System consists of two smart contracts:



\- \*\*SecureVault\*\* — Holds ETH deposits and processes withdrawals.

\- \*\*AuthorizationManager\*\* — Validates and enforces one-time use of withdrawal authorizations.



Withdrawals are only allowed if a valid, unused authorization is provided.



---



\## Architecture



User (off-chain)

│

│ generates authorization hash

▼

AuthorizationManager ── verifies \& consumes authorization

│

▼

SecureVault ── transfers ETH to recipient





---



\## Contracts



\### AuthorizationManager.sol



\- Stores consumed authorization IDs

\- Prevents replay attacks by enforcing one-time usage

\- Emits events when an authorization is consumed



\*\*Key property:\*\*  

Each authorization can be used \*\*exactly once\*\*.



---



\### SecureVault.sol



\- Accepts ETH deposits via `receive()`

\- Requests authorization validation from `AuthorizationManager`

\- Ensures sufficient balance before transferring funds

\- Emits deposit and withdrawal events



---



\## Authorization Design



Authorizations are generated off-chain as deterministic hashes including:



\- Vault address  

\- Chain ID  

\- Recipient address  

\- Withdrawal amount  

\- Unique nonce  



The `AuthorizationManager` enforces one-time usage of each authorization to prevent replay attacks.



---



\## Manual Testing



\### 1. Start Local Blockchain



```bash

npx hardhat node

```

\### 2. Deploy Contracts



In a new terminal:



npx hardhat run scripts/deploy.js --network localhost



Example output:



AuthorizationManager deployed at: 0xAuthorizationManagerAddress

SecureVault deployed at: 0xSecureVaultAddress



\### 3. Test Deposit

npx hardhat console --network localhost



const \[sender] = await ethers.getSigners();



await sender.sendTransaction({

&nbsp; to: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",

&nbsp; value: ethers.parseEther("1")

});



\### 4. Test Withdrawal



Generate an authorization hash off-chain



Call:



withdraw(recipient, amount, authId)





ETH is transferred successfully to the recipient



\### 5. Replay Protection Check



Reusing the same authorization will revert:



Authorization already used





This confirms replay protection is working correctly.



\## Security Considerations



One-time authorization enforcement



Replay attack prevention



Balance checks before transfers



State updates occur before value transfers



Minimal trusted surface area between contracts



\## Build \& Compile

npx hardhat compile



\## Tech Stack



Solidity ^0.8.20



Hardhat



Ethers.js



Docker



Node.js



