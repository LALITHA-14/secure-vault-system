// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AuthorizationManager.sol";

contract SecureVault {
    AuthorizationManager public authManager;

    event Deposit(address indexed sender, uint256 amount);
    event Withdrawal(address indexed recipient, uint256 amount);

    constructor(address _authManager) {
        authManager = AuthorizationManager(_authManager);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(
        address payable recipient,
        uint256 amount,
        bytes32 authId
    ) external {
        // Validate authorization
        require(authManager.verifyAuthorization(address(this), recipient, amount, authId), "Invalid authorization");

        // Ensure vault has enough balance
        require(address(this).balance >= amount, "Insufficient funds");

        // Transfer funds
        recipient.transfer(amount);

        emit Withdrawal(recipient, amount);
    }
}
