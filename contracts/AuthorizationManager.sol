// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract AuthorizationManager {

    using ECDSA for bytes32;

    address public immutable authorizedSigner;

    mapping(bytes32 => bool) public consumed;

    event AuthorizationConsumed(
        bytes32 indexed authId,
        address indexed recipient,
        uint256 amount
    );

    constructor(address _authorizedSigner) {

        require(
            _authorizedSigner != address(0),
            "Invalid signer"
        );

        authorizedSigner = _authorizedSigner;
    }

    function verifyAuthorization(
        address vault,
        address recipient,
        uint256 amount,
        bytes32 authId,
        bytes calldata signature
    ) external returns (bool) {

        require(
            !consumed[authId],
            "Authorization already used"
        );

        bytes32 messageHash = keccak256(
            abi.encode(
                vault,
                block.chainid,
                recipient,
                amount,
                authId
            )
        );

        bytes32 ethSignedMessageHash =
            messageHash.toEthSignedMessageHash();

        address recoveredSigner =
            ECDSA.recover(
                ethSignedMessageHash,
                signature
            );

        require(
            recoveredSigner == authorizedSigner,
            "Invalid signature"
        );

        consumed[authId] = true;

        emit AuthorizationConsumed(
            authId,
            recipient,
            amount
        );

        return true;
    }
}