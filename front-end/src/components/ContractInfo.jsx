import React, { useEffect, useState } from "react";
import { setBalanceUpdateCallback, getContractBalanceInETH, setUserDepositUpdateCallback, getUserDeposit} from "../utils/contractServices";

// function ContractInfo({ account }) {
//   const [balance, setBalance] = useState(null);

//   useEffect(() => {
//     const fetchBalance = async () => {
//       const balanceInETH = await getContractBalanceInETH();
//       setBalance(balanceInETH);
//     };
//     fetchBalance();

//     // Set up real-time balance updates
//     setBalanceUpdateCallback(setBalance);

//     return () => setBalanceUpdateCallback(null); // Clean up listener
//   }, []);

//   return (
//     <div>
//       <h2>Contract Balance: {balance} ETH</h2>
//       <p>Connected Account: {account}</p>
//     </div>
//   );
// }

function ContractInfo({ account }) {
  const [balance, setBalance] = useState(null);
  const [depositInfo, setDepositInfo] = useState({ amount: "0", unlockTime: "N/A" });

  useEffect(() => {
        const fetchBalance = async () => {
          const balanceInETH = await getContractBalanceInETH();
          setBalance(balanceInETH);
        };
        fetchBalance();
    
        // Set up real-time balance updates
        setBalanceUpdateCallback(setBalance);
    
        return () => setBalanceUpdateCallback(null); // Clean up listener
      }, []);


  useEffect(() => {
    const fetchDepositInfo = async () => {
      if (account) {
        const info = await getUserDeposit(account);
        setDepositInfo(info);
      }
    };

    fetchDepositInfo();

    setUserDepositUpdateCallback(setDepositInfo);
    
    return () => setUserDepositUpdateCallback(null);
  }, [account]);

  return (
    <div>
      <h1>Contract Balance: {balance} ETH</h1>
      <h2>Your Deposit: {depositInfo.amount} ETH</h2>
      <p>Unlock Time: {depositInfo.unlockTime}</p>
      <p>Connected Account: {account}</p>
    </div>
  );
}

export default ContractInfo;