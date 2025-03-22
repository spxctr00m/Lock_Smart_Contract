# 🏦 Lock Smart Contract  

This repository contains a **smart contract for a time-locked deposit system** built on Ethereum. The contract allows users to **deposit funds**, which can only be **withdrawn after a fixed lock period**. The unlock time updates to **10 minutes after every new deposit**.  

## 📜 **Contract Features**
- ✅ **Deposit Funds**: Users can send ETH to the contract.
- 🔒 **Time-Locked Withdrawals**: The contract owner can only withdraw after 10 minutes.
- 📅 **Auto-Reset Unlock Time**: Each new deposit extends the lock period by 10 minutes.
- 🛠 **Event Emission**: `Deposit` and `Withdrawal` events notify the frontend of changes.

## 🚀 **Technologies Used**
- **Solidity `^0.8.23`**
- **Hardhat** (Development & Testing)
- **Hardhat Ignition** (Deployment)
- **Ethers.js** (Frontend Integration)
- **React.js** (UI)

---