import Lock_ABI from "./Lock_ABI.json";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import { CONTRACT_ADDRESS } from "./constants";

// Module-level variables to store provider, signer, and contract
let provider;
let signer;
let contract;
let balanceUpdateCallback = null;

// Function to initialize the provider, signer, and contract
const initialize = async () => {
  if (typeof window.ethereum !== "undefined") {
    provider = new BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    contract = new Contract(CONTRACT_ADDRESS, Lock_ABI, signer);

     // 🔹 Listen for Deposit & Withdrawal events
     contract.on("Deposit", () => updateBalance());
     contract.on("Withdrawal", () => updateBalance());
 
  } else {
    console.error("Please install MetaMask!");
  }
};

// Initialize once when the module is loaded
initialize();

// Function to request single account
export const requestAccount = async () => {
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      return accounts[0]; // Return the first account
    } catch (error) {
      console.error("Error requesting account:", error.message);
      return null;
    }
  };

  // Function to get contract balance in ETH
export const getContractBalanceInETH = async () => {
    if (!provider) await initialize();
    const balanceWei = await provider.getBalance(CONTRACT_ADDRESS);
    const balanceEth = formatEther(balanceWei); // Convert Wei to ETH string
    return balanceEth; // Convert ETH string to number
  };

  // Function to manually update the balance (used in event listeners)
const updateBalance = async () => {
  if (balanceUpdateCallback) {
    const balance = await getContractBalanceInETH();
    balanceUpdateCallback(balance);
  }
};

// Function to set balance update callback (for React UI)
export const setBalanceUpdateCallback = (callback) => {
  balanceUpdateCallback = callback;
};

  // Function to deposit funds to the contract
export const depositFund = async (depositValue) => {
    if (!contract) await initialize();
    const ethValue = parseEther(depositValue);
    const deposit = await contract.deposit({ value: ethValue });
    await deposit.wait();
    updateBalance();
  };
  
  // Function to withdraw funds from the contract
  export const withdrawFund = async () => {
    if (!contract) await initialize();
    const withdrawTx = await contract.withdraw();
    await withdrawTx.wait();
    console.log("Withdrawal successful!");
    updateBalance();
  };