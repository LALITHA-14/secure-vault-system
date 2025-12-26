// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AuthorizationManager {
    mapping(bytes32 => bool) public consumed;

    event AuthorizationConsumed(
        bytes32 indexed authHash,
        address indexed vault,
        address indexed recipient,
        uint256 amount
    );

    function verifyAuthorization(
        address vault,
        address recipient,
        uint256 amount,
        bytes32 nonce
    ) external returns (bool) {
        bytes32 authHash = keccak256(
            abi.encode(
                vault,
                block.chainid,
                recipient,
                amount,
                nonce
            )
        );

        require(!consumed[authHash], "Authorization already used");

        consumed[authHash] = true;

        emit AuthorizationConsumed(authHash, vault, recipient, amount);
        return true;
    }
}
