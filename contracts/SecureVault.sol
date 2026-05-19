// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAuthorizationManager {
    function verifyAuthorization(
        address vault,
        address recipient,
        uint256 amount,
        bytes32 authId,
        bytes calldata signature
    ) external returns (bool);
}

contract SecureVault {

    IAuthorizationManager public immutable authManager;

    uint256 public totalDeposits;
    uint256 public totalWithdrawals;

    event Deposited(
        address indexed sender,
        uint256 amount
    );

    event Withdrawn(
        address indexed recipient,
        uint256 amount,
        bytes32 indexed authId
    );

    constructor(address _authManager) {
        require(
            _authManager != address(0),
            "Invalid auth manager"
        );

        authManager =
            IAuthorizationManager(_authManager);
    }

    receive() external payable {
        require(msg.value > 0, "Zero deposit");

        totalDeposits += msg.value;

        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(
        address payable recipient,
        uint256 amount,
        bytes32 authId,
        bytes calldata signature
    ) external {

        require(
            recipient != address(0),
            "Invalid recipient"
        );

        require(
            amount > 0,
            "Invalid amount"
        );

        require(
            address(this).balance >= amount,
            "Insufficient vault balance"
        );

        // EFFECT BEFORE INTERACTION
        bool valid = authManager.verifyAuthorization(
            address(this),
            recipient,
            amount,
            authId,
            signature
        );

        require(valid, "Authorization failed");

        totalWithdrawals += amount;

        // INTERACTION
        (bool success, ) =
            recipient.call{value: amount}("");

        require(success, "Transfer failed");

        emit Withdrawn(
            recipient,
            amount,
            authId
        );
    }
}