# Secure Vault System

A secure Ethereum smart contract system that separates fund custody and authorization validation across two independent contracts.

The system demonstrates secure off-chain authorization handling, replay protection, deterministic state transitions, and safe cross-contract interactions.

---

# System Architecture

The project contains two core smart contracts:

## 1. SecureVault

Responsible for:

- Holding ETH deposits
- Executing withdrawals
- Delegating authorization checks
- Emitting deposit and withdrawal events

The vault never performs signature verification directly.

---

## 2. AuthorizationManager

Responsible for:

- Verifying withdrawal authorizations
- Recovering and validating ECDSA signatures
- Enforcing replay protection
- Tracking consumed authorizations

Each authorization can only be consumed once.

---

# Authorization Flow

1. An authorized signer generates an off-chain authorization

2. The authorization includes:

- Vault address
- Chain ID
- Recipient address
- Withdrawal amount
- Unique authorization ID (nonce)

3. The authorization is signed using ECDSA

4. A user submits:

- Recipient
- Amount
- Authorization ID
- Signature

5. `AuthorizationManager` verifies:

- Signature validity
- Authorized signer identity
- Replay protection

6. If valid:
- Authorization is consumed
- Funds are transferred
- Events are emitted

---

# Security Design

## Replay Protection

Replay attacks are prevented using:

```solidity
mapping(bytes32 => bool) public consumed;