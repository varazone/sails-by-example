import React from "react";
import { useWallet } from "../contexts/WalletContext";
import useWalletBalances from "../hooks/useWalletBalances";
import { formatBalance } from "@polkadot/util";

const WalletBalances = () => {
  const { accounts } = useWallet();
  const { balances, loading } = useWalletBalances();

  if (loading) {
    return <div>Loading balances...</div>;
  }

  return (
    <div>
      <h2>Wallet Balances</h2>
      {accounts.length === 0 ? <p>No accounts available.</p> : (
        <ul>
          {accounts.map((account, i) => (
            <li key={account.address + i}>
              <strong>{account.meta.name}</strong>: {account.address}
              <br />
              Balance: {balances[account.address]
                ? formatBalance(balances[account.address], {
                  decimals: 12,
                  withSi: true,
                  withUnit: "VARA",
                })
                : "N/A"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WalletBalances;
