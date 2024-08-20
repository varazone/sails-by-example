import React from "react";
import { useWallet } from "../contexts/WalletContext";

const WalletConnection = () => {
  const {
    accounts,
    selectedAccount,
    setSelectedAccount,
    isWalletInstalled,
    walletNotInstalledMessage,
  } = useWallet();

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
  };

  const handleDisconnect = () => {
    setSelectedAccount(null);
  };

  if (!isWalletInstalled) {
    return <div>{walletNotInstalledMessage}</div>;
  }

  return (
    <div>
      <h2>Wallet Connection</h2>
      {!selectedAccount
        ? (
          accounts.map((account) => (
            <button
              key={account.address}
              onClick={() => handleAccountSelect(account)}
            >
              Connect {account.meta.name}
            </button>
          ))
        )
        : (
          <div>
            <p>
              Connected: {selectedAccount.meta.name} ({selectedAccount.address})
            </p>
            <button onClick={handleDisconnect}>Disconnect</button>
          </div>
        )}
    </div>
  );
};

export default WalletConnection;
