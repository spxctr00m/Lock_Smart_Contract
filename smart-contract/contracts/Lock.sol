// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

contract Lock {
    struct DepositInfo {
        uint amount;
        uint unlockTime;
    }

    mapping(address => DepositInfo) public deposits; // Store deposits per user

    event Withdrawal(address indexed user, uint amount, uint when);
    event Deposit(address indexed user, uint amount, uint when);

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");

        deposits[msg.sender].amount += msg.value;
        deposits[msg.sender].unlockTime = block.timestamp + 10 minutes; // ⏳ Reset unlock time per user

        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    function withdraw() public {
        DepositInfo storage userDeposit = deposits[msg.sender];

        require(userDeposit.amount > 0, "No funds to withdraw");
        require(
            block.timestamp >= userDeposit.unlockTime,
            "You can't withdraw yet"
        );

        uint amount = userDeposit.amount;
        userDeposit.amount = 0; // Prevent reentrancy
        payable(msg.sender).transfer(amount);

        emit Withdrawal(msg.sender, amount, block.timestamp);
    }
}
