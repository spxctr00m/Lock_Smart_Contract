// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const Ten_minutes = Math.floor(Date.now() / 1000) + 10 * 60;
const Zero_point2_Eth = 200_000_000_000_000_000n;

module.exports = buildModule("LockModule", (m) => {
  const unlockTime = m.getParameter("unlockTime", Ten_minutes);
  const lockedAmount = m.getParameter("lockedAmount", Zero_point2_Eth);

  const lock = m.contract("Lock", [unlockTime], {
    value: lockedAmount,
  });

  return { lock };
});
