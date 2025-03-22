import Lock_ABI from "./Lock_ABI.json";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import { CONTRACT_ADDRESS } from "./constants";

// Module-level variables to store provider, signer, and contract
let provider;
let signer;
let contract;
let balanceUpdateCallback = null;
let userDepositUpdateCallback = null;

// Function to initialize the provider, signer, and contract
const initialize = async () => {
  if (typeof window.ethereum !== "undefined") {
    provider = new BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    contract = new Contract(CONTRACT_ADDRESS, Lock_ABI, signer);

     // 🔹 Listen for Deposit & Withdrawal events
     contract.on("Deposit", async (user, amount, when) => {
      console.log(`Deposit event detected: ${user} deposited ${formatEther(amount)} ETH at ${new Date(when * 1000)}`); 
      updateBalance(); 
      updateUserDeposit()
      // const currentUser = await signer.getAddress()
      // if (user.toLowerCase() === currentUser.toLowerCase()) {
      //   updateUserDeposit();
      // }
     });

     contract.on("Withdrawal", async (user, amount, when) => {
      console.log(`Withdrawal event: ${user} withdrew ${formatEther(amount)} ETH at ${new Date(when * 1000)}`);

      updateBalance(); // Update contract balance
      const currentUser = await signer.getAddress();
      if (user.toLowerCase() === currentUser.toLowerCase()) {
        updateUserDeposit(); // Update UI if it's the current user
      }
    });
 
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

  // Function to get user deposit info
export const getUserDeposit = async (account) => {
  if (!contract) await initialize();
  try {
    const depositInfo = await contract.deposits(account);
    return {
        amount: formatEther(depositInfo.amount),
        unlockTime: new Date(Number(depositInfo.unlockTime) * 1000).toLocaleString()
    };
} catch (error) {
    console.error("Error fetching deposit info:", error);
    return { amount: "0", unlockTime: "N/A" }; // Return default values on error
}
};


const updateUserDeposit = async () => {
  if (userDepositUpdateCallback && signer) {
    const currentUser = await signer.getAddress(); // ✅ Ensure the correct user address is fetched
    const depositInfo = await getUserDeposit(currentUser);
    userDepositUpdateCallback(depositInfo);
  }
};

// Function to set user deposit update callback (for React UI)
export const setUserDepositUpdateCallback = (callback) => {
  userDepositUpdateCallback = callback;
};


  // Function to deposit funds to the contract
export const depositFund = async (depositValue) => {
    if (!contract) await initialize();
    await requestAccount();
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
