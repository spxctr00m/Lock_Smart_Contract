import React, { useState } from "react";
import { depositFund } from "../utils/contractServices";
import { withdrawFund } from "../utils/contractServices";
import { toast } from "react-toastify";

function ContractActions() {
  const [depositValue, setDepositValue] = useState("");

  const handleDeposit = async () => {
    try {
      await depositFund(depositValue)
      .then(() => toast.success("Deposit successful!"));
    } catch (error) {
      toast.error(error?.reason);
    }
    setDepositValue("");
  };

  const handleWithdraw = async () => {
    try {
      await withdrawFund()
      .then(() => toast.success("Withdrawal successful!"));
    } catch (error) {
      toast.error(error?.reason);
    }
  };

  return (
    <div>
      <h2>Contract Actions</h2>
      <div>
        <input
          type="text"
          value={depositValue}
          onChange={(e) => setDepositValue(e.target.value)}
          placeholder="Amount in ETH"
        />
        <button onClick={handleDeposit}>Deposit Funds</button>
      </div>
      <br />
      <div>
        <button onClick={handleWithdraw}>Withdraw Funds</button>
      </div>
    </div>
  );
}

export default ContractActions;