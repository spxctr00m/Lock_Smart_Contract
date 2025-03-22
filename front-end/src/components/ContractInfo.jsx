import React, { useEffect, useState } from "react";
import { setBalanceUpdateCallback, getContractBalanceInETH } from "../utils/contractServices";

function ContractInfo({ account }) {
  const [balance, setBalance] = useState(null);

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

  return (
    <div>
      <h2>Contract Balance: {balance} ETH</h2>
      <p>Connected Account: {account}</p>
    </div>
  );
}

export default ContractInfo;